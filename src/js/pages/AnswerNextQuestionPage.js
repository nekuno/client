import PropTypes from 'prop-types';
import React, { Component } from 'react';
import selectn from 'selectn';
import RegisterQuestionsFinishedPopup from '../components/questions/RegisterQuestionsFinishedPopup';
import AnswerQuestion from '../components/questions/AnswerQuestion';
import AuthenticatedComponent from '../components/AuthenticatedComponent';
import translate from '../i18n/Translate';
import tutorial from '../components/tutorial/Tutorial';
import popup from '../components/Popup';
import connectToStores from '../utils/connectToStores';
import * as QuestionActionCreators from '../actions/QuestionActionCreators';
import RouterActionCreators from '../actions/RouterActionCreators';
import UserStore from '../stores/UserStore';
import QuestionStore from '../stores/QuestionStore';
import LoginStore from '../stores/LoginStore';
import ProfileStore from '../stores/ProfileStore';
import RouterStore from '../stores/RouterStore';
import Joyride from 'react-joyride';
import '../../scss/pages/answer/answer-next-question.scss';
import TopNavBar from "../components/TopNavBar/TopNavBar";


function parseId(user) {
    return user.id;
}

/**
 * Requests data from server (or store) for current props.
 */
function requestData(props) {
    const {user} = props;
    const currentUserId = parseId(user);
    QuestionActionCreators.requestNextQuestion(currentUserId);
}

/**
 * Retrieves state from stores for current props.
 */
function getState(props) {
    const {user} = props;
    const currentUserId = parseId(user);
    const currentUser = UserStore.get(currentUserId);
    const question = QuestionStore.getQuestion();
    const questionId = selectn('questionId', question);
    const userAnswer = questionId ? QuestionStore.getUserAnswer(currentUserId, questionId) : {};
    const errors = QuestionStore.getErrors();
    const noMoreQuestions = QuestionStore.noMoreQuestions();
    const isLoadingOwnQuestions = QuestionStore.isLoadingOwnQuestions();
    const goToQuestionStats = QuestionStore.mustGoToQuestionStats();
    const registerQuestionsLength = QuestionStore.registerQuestionsLength();
    const answersLength = QuestionStore.ownAnswersLength(currentUserId);
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
        isLoadingOwnQuestions,
        goToQuestionStats,
        isJustRegistered,
        isJustCompleted,
        totalQuestions,
        questionNumber
    };
}

@AuthenticatedComponent
@translate('AnswerNextQuestionPage')
@tutorial()
@popup('popup-register-finished')
@connectToStores([UserStore, QuestionStore], getState)
export default class AnswerNextQuestionPage extends Component {

    static propTypes = {
        // Injected by @AuthenticatedComponent
        user                 : PropTypes.object.isRequired,
        // Injected by @translate:
        strings              : PropTypes.object,
        // Injected by @tutorial:
        steps                : PropTypes.array,
        startTutorial        : PropTypes.func,
        endTutorialHandler   : PropTypes.func,
        tutorialLocale       : PropTypes.object,
        joyrideRunning       : PropTypes.bool,
        // Injected by @connectToStores:
        question             : PropTypes.object,
        userAnswer           : PropTypes.object,
        errors               : PropTypes.string,
        isLoadingOwnQuestions: PropTypes.bool,
        noMoreQuestions      : PropTypes.bool,
        goToQuestionStats    : PropTypes.bool,
        isJustRegistered     : PropTypes.bool,
        isJustCompleted      : PropTypes.bool,
        totalQuestions       : PropTypes.number,
        questionNumber       : PropTypes.number,
        // Injected by @popup:
        showPopup            : PropTypes.func,
        closePopup           : PropTypes.func,
        popupContentRef      : PropTypes.func,
    };

    static contextTypes = {
        router: PropTypes.object.isRequired
    };

    constructor(props) {
        super(props);

        this.skipQuestionHandler = this.skipQuestionHandler.bind(this);
        this.onContinue = this.onContinue.bind(this);
        this.onClosePopup = this.onClosePopup.bind(this);
        this.forceStartTutorial = this.forceStartTutorial.bind(this);
        this.onSkipClick = this.onSkipClick.bind(this);
    }

    componentWillMount() {
        window.setTimeout(() => requestData(this.props), 0);
        if (this.props.isJustCompleted) {
            QuestionActionCreators.popupDisplayed();
            window.setTimeout(() => {
                this.props.showPopup()
            }, 0);
        }
    }

    componentDidUpdate() {
        const {goToQuestionStats, question} = this.props;
        if (goToQuestionStats) {
            setTimeout(() => {
                RouterActionCreators.replaceRoute(`/question-stats`);
            }, 0);
        } else if (question && question.questionId) {
            // TODO: Uncomment to start the tutorial the first time
            //window.setTimeout(() => this.props.startTutorial(), 2000);
        }
    }

    componentWillUnmount() {
        this.joyride.reset();
    }

    skipQuestionHandler() {
        let userId = parseId(this.props.user);
        let questionId = this.props.question.questionId;
        QuestionActionCreators.skipQuestion(userId, questionId);
    }

    onContinue() {
        if (RouterStore.hasNextTransitionPath()) {
            const route = RouterStore.nextTransitionPath;
            this.context.router.push(route);
        } else {
            this.context.router.push('/proposals');
        }
    }

    onClosePopup() {
        this.props.closePopup();
    }

    forceStartTutorial() {
        this.joyride.reset(true);
    }

    onSkipClick() {
        let userId = parseId(this.props.user);
        let questionId = this.props.question.questionId;
        QuestionActionCreators.skipQuestion(userId, questionId);
    }

    render() {
        const {user, strings, errors, noMoreQuestions, isLoadingOwnQuestions, userAnswer, question, isJustRegistered, isJustCompleted, totalQuestions, questionNumber, steps, tutorialLocale, endTutorialHandler, joyrideRunning} = this.props;
        const userId = parseId(user);
        const navBarTitle = question && question.questionId && (isJustRegistered || isJustCompleted) ? strings.question + ' ' + questionNumber + '/' + totalQuestions : strings.question;
        const ownPicture = user.photo ? user.photo.thumbnail.small : 'img/no-img/small.jpg';
        const isRegisterQuestion = selectn('isRegisterQuestion', question);

        return (
            <div className="answer-next-question-page">
                <TopNavBar
                    background={'FFFFFF'}
                    iconLeft={'arrow-left'}
                    textCenter={strings.topNavBarText}
                    textSize={'small'}
                    //onLeftLinkClickHandler={this.topNavBarLeftLinkClick}
                />
                {/*{isJustRegistered ?*/}
                    {/*<TopNavBar centerText={navBarTitle}/>*/}
                    {/*:*/}
                    {/*<TopNavBar leftIcon={'left-arrow'} centerText={navBarTitle} rightText={isRegisterQuestion ? '' : strings.skip} onRightLinkClickHandler={isRegisterQuestion ? null : this.skipQuestionHandler}/>*/}
                {/*}*/}
                <div className="answer-next-question-page-wrapper">
                    <Joyride ref={c => this.joyride = c} steps={steps} locale={tutorialLocale} callback={endTutorialHandler} type="continuous" run={joyrideRunning} autoStart={true}/>
                    <div className="">
                        <div id="page-content" className="answer-question-content">
                            <AnswerQuestion question={question} userAnswer={userAnswer} userId={userId} errors={errors} noMoreQuestions={noMoreQuestions} ownPicture={ownPicture} startTutorial={this.forceStartTutorial} isLoadingOwnQuestions={isLoadingOwnQuestions}/>
                        </div>
                    </div>
                    <RegisterQuestionsFinishedPopup onContinue={this.onContinue} onClose={this.onClosePopup} contentRef={this.props.popupContentRef}/>
                </div>
                <div className="skip-nav-bar" onClick={this.onSkipClick}>
                    <div className="text">Omitir <span className="icon icon-arrow-right"/></div>
                </div>
            </div>
        );
    }
}

AnswerNextQuestionPage.defaultProps = {
    strings: {
        topNavBarText          : 'Personality test',
        question               : 'Question',
        skip                   : 'Skip',
        tutorialFirstStepTitle : 'Your answer',
        tutorialFirstStep      : 'This is your answer to the above question.',
        tutorialSecondStepTitle: 'Others answers',
        tutorialSecondStep     : 'Here you choose what other person should answer to be compatible with you; you can choose more than one answer.',
        tutorialThirdStepTitle : 'Importance',
        tutorialThirdStep      : 'This will be the question`s importance when making compatibility calculations.'
    },
    steps  : [
        {
            titleRef: 'tutorialFirstStepTitle',
            textRef : 'tutorialFirstStep',
            selector: '#joyride-1-your-answer',
            position: 'bottom',
        },
        {
            titleRef: 'tutorialSecondStepTitle',
            textRef : 'tutorialSecondStep',
            selector: '#joyride-2-others-answers',
            position: 'bottom',
        },
        {
            titleRef: 'tutorialThirdStepTitle',
            textRef : 'tutorialThirdStep',
            selector: '#joyride-3-answer-importance',
            position: 'top',
        }
    ]
};