import React, { PropTypes, Component } from 'react';
import selectn from 'selectn';
import { IMAGES_ROOT } from '../constants/Constants';
import TopNavBar from '../components/ui/TopNavBar';
import RegisterQuestionsFinishedPopup from '../components/questions/RegisterQuestionsFinishedPopup';
import AnswerQuestion from '../components/questions/AnswerQuestion';
import AuthenticatedComponent from '../components/AuthenticatedComponent';
import translate from '../i18n/Translate';
import tutorial from '../tutorial/Tutorial';
import connectToStores from '../utils/connectToStores';
import * as QuestionActionCreators from '../actions/QuestionActionCreators';
import UserStore from '../stores/UserStore';
import QuestionStore from '../stores/QuestionStore';
import QuestionsByUserIdStore from '../stores/QuestionsByUserIdStore';
import LoginStore from '../stores/LoginStore';
import ProfileStore from '../stores/ProfileStore';
import Joyride from 'react-joyride';

function parseId(user) {
    return user.id;
}

/**
 * Requests data from server (or store) for current props.
 */
function requestData(props) {
    const {user, params} = props;
    const questionId = params.hasOwnProperty('questionId') ? parseInt(params.questionId) : null;
    const currentUserId = parseId(user);
    QuestionActionCreators.requestQuestion(currentUserId, questionId);
}

/**
 * Retrieves state from stores for current props.
 */
function getState(props) {
    const {user, params} = props;
    const currentUserId = parseId(user);
    const currentUser = UserStore.get(currentUserId);
    const question = QuestionStore.getQuestion();
    const questionId = params.hasOwnProperty('questionId') ? parseInt(params.questionId) : selectn('questionId', question);
    const userAnswer = questionId ? QuestionStore.getUserAnswer(currentUserId, questionId) : {};
    const errors = QuestionStore.getErrors();
    const noMoreQuestions = QuestionStore.noMoreQuestions();
    const goToQuestionStats = QuestionStore.mustGoToQuestionStats();
    const registerQuestionsLength = QuestionStore.registerQuestionsLength();
    const answersLength = QuestionStore.answersLength(currentUserId);
    const isJustRegistered = QuestionStore.isJustRegistered(currentUserId);
    const isJustCompleted = QuestionStore.isJustCompleted(currentUserId);
    const initialUserQuestionsCount = LoginStore.getInitialRequiredUserQuestionsCount();
    const initialProfileQuestionsCount = ProfileStore.getInitialRequiredProfileQuestionsCount();
    const totalQuestions = initialUserQuestionsCount + initialProfileQuestionsCount + registerQuestionsLength;
    const questionNumber = initialUserQuestionsCount + initialProfileQuestionsCount + answersLength + 1;

    return {
        currentUser,
        question,
        userAnswer,
        user,
        errors,
        noMoreQuestions,
        goToQuestionStats,
        isJustRegistered,
        isJustCompleted,
        totalQuestions,
        questionNumber
    };
}

@AuthenticatedComponent
@translate('AnswerQuestionPage')
@tutorial()
@connectToStores([UserStore, QuestionStore, QuestionsByUserIdStore], getState)
export default class AnswerQuestionPage extends Component {

    static propTypes = {
        // Injected by React Router:
        params                 : PropTypes.shape({
            questionId: PropTypes.string
        }),
        // Injected by @AuthenticatedComponent
        user                   : PropTypes.object.isRequired,
        // Injected by @translate:
        strings                : PropTypes.object,
        // Injected by @tutorial:
        steps                  : PropTypes.array,
        startTutorial          : PropTypes.func,
        resetTutorial          : PropTypes.func,
        endTutorialHandler     : PropTypes.func,
        tutorialLocale         : PropTypes.object,
        // Injected by @connectToStores:
        question               : PropTypes.object,
        userAnswer             : PropTypes.object,
        errors                 : PropTypes.string,
        goToQuestionStats      : PropTypes.bool,
        isJustRegistered       : PropTypes.bool,
        isJustCompleted        : PropTypes.bool,
        totalQuestions         : PropTypes.number,
        questionNumber         : PropTypes.number,
    };

    static contextTypes = {
        history: PropTypes.object.isRequired
    };

    constructor(props) {
        super(props);

        this.skipQuestionHandler = this.skipQuestionHandler.bind(this);
        this.onContinue = this.onContinue.bind(this);
    }

    componentWillMount() {
        const questionId = this.props.params.questionId;
        if(!this.props.question || this.props.question.questionId !== questionId) {
            window.setTimeout(() => requestData(this.props), 0);
        }
        if(this.props.isJustCompleted) {
            QuestionActionCreators.popupDisplayed();
            window.setTimeout(function() { nekunoApp.popup('.popup-register-finished') }, 0);
        }
    }

    componentDidUpdate() {
        const {goToQuestionStats, question} = this.props;
        if(goToQuestionStats) {
            this.context.history.pushState(null, `/question-stats`);
        } else if (question && question.questionId) {
            this.props.startTutorial(this.refs.joyrideAnswerQuestion);
        }
    }

    componentWillUnmount() {
        this.props.resetTutorial(this.refs.joyrideAnswerQuestion);
    }

    skipQuestionHandler() {
        let userId = parseId(this.props.user);
        let questionId = this.props.question.questionId;
        QuestionActionCreators.skipQuestion(userId, questionId);
    }

    onContinue() {
        this.context.history.pushState(null, '/threads');
    }

    render() {
        const {user, strings, errors, noMoreQuestions, userAnswer, question, isJustRegistered, isJustCompleted, totalQuestions, questionNumber, steps, tutorialLocale, endTutorialHandler} = this.props;
        const userId = parseId(user);
        const navBarTitle = question && (isJustRegistered || isJustCompleted) ? strings.question + ' ' + questionNumber + '/' + totalQuestions : strings.question;
        const ownPicture = user.picture ? `${IMAGES_ROOT}media/cache/resolve/user_avatar_60x60/user/images/${user.picture}` : `${IMAGES_ROOT}media/cache/user_avatar_60x60/bundles/qnoowweb/images/user-no-img.jpg`;
        const isRegisterQuestion = selectn('isRegisterQuestion', question);

        return (
            <div className="view view-main">
                {isJustRegistered ?
                    <TopNavBar centerText={navBarTitle}/>
                    :
                    <TopNavBar leftMenuIcon={true} centerText={navBarTitle} rightText={isRegisterQuestion ? '' : strings.skip} onRightLinkClickHandler={isRegisterQuestion ? null : this.skipQuestionHandler}/>
                }
                <Joyride ref="joyrideAnswerQuestion" steps={steps} locale={tutorialLocale} callback={endTutorialHandler}/>
                <div className="page answer-question-page">
                    <div id="page-content" className="answer-question-content">
                        <AnswerQuestion question={question} userAnswer={userAnswer} userId={userId} errors={errors} noMoreQuestions={noMoreQuestions} ownPicture={ownPicture}/>
                    </div>
                </div>
                <RegisterQuestionsFinishedPopup onContinue={this.onContinue} />
            </div>
        );
    }
}

AnswerQuestionPage.defaultProps = {
    strings: {
        question: 'Question',
        skip: 'Skip',
        tutorialFirstStep: 'Select first your answer in the first column. Then, select the answers that you would accept from other users in the second column',
        tutorialSecondStepTitle: 'Answers importance',
        tutorialSecondStep: 'Select how important are these answers for you'
    },
    steps: [
        {
            titleRef: 'question',
            textRef: 'tutorialFirstStep',
            selector: '#joyride-1-question',
            position: 'bottom',
        },
        {
            titleRef: 'tutorialSecondStepTitle',
            textRef: 'tutorialSecondStep',
            selector: '#joyride-2-answer-importance',
            position: 'top',
        }
    ]
};