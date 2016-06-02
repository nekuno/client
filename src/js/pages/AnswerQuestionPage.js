import React, { PropTypes, Component } from 'react';
import selectn from 'selectn';
import { IMAGES_ROOT } from '../constants/Constants';
import LeftMenuTopNavbar from '../components/ui/LeftMenuTopNavbar';
import RegularTopNavbar from '../components/ui/RegularTopNavbar';
import RegisterQuestionsFinishedPopup from '../components/questions/RegisterQuestionsFinishedPopup';
import AnswerQuestion from '../components/questions/AnswerQuestion';
import AuthenticatedComponent from '../components/AuthenticatedComponent';
import translate from '../i18n/Translate';
import connectToStores from '../utils/connectToStores';
import * as QuestionActionCreators from '../actions/QuestionActionCreators';
import UserStore from '../stores/UserStore';
import QuestionStore from '../stores/QuestionStore';
import QuestionsByUserIdStore from '../stores/QuestionsByUserIdStore';

function parseUserId(user) {
    return user.qnoow_id;
}

/**
 * Requests data from server (or store) for current props.
 */
function requestData(props) {
    const {user, params} = props;
    const questionId = params.hasOwnProperty('questionId') ? parseInt(params.questionId) : null;
    const currentUserId = parseUserId(user);
    
    return QuestionActionCreators.requestQuestion(currentUserId, questionId);
}

/**
 * Retrieves state from stores for current props.
 */
function getState(props) {
    const {user, params} = props;
    const currentUserId = parseUserId(user);
    const currentUser = UserStore.get(currentUserId);
    const question = QuestionStore.getQuestion();
    const isFirstQuestion = QuestionStore.isFirstQuestion(currentUserId);
    const questionId = params.hasOwnProperty('questionId') ? parseInt(params.questionId) : selectn('questionId', question);
    const userAnswer = questionId ? QuestionStore.getUserAnswer(currentUserId, questionId) : {};
    const errors = QuestionStore.getErrors();
    const noMoreQuestions = QuestionStore.noMoreQuestions();
    const goToQuestionStats = QuestionStore.mustGoToQuestionStats();
    const questionsLength = Object.keys(QuestionsByUserIdStore.getByUserId(currentUserId)).length || 0;
    const isJustRegistered = questionsLength < 4;
    const isJustCompleted = questionsLength == 4;

    return {
        currentUser,
        question,
        isFirstQuestion,
        userAnswer,
        user,
        errors,
        noMoreQuestions,
        goToQuestionStats,
        isJustRegistered,
        isJustCompleted
    };
}

@AuthenticatedComponent
@translate('AnswerQuestionPage')
@connectToStores([UserStore, QuestionStore, QuestionsByUserIdStore], getState)
export default class AnswerQuestionPage extends Component {

    static propTypes = {
        // Injected by React Router:
        params           : PropTypes.shape({
            questionId: PropTypes.string
        }),
        // Injected by @AuthenticatedComponent
        user             : PropTypes.object.isRequired,
        // Injected by @translate:
        strings          : PropTypes.object,
        // Injected by @connectToStores:
        question         : PropTypes.object,
        userAnswer       : PropTypes.object,
        isFirstQuestion  : PropTypes.bool,
        errors           : PropTypes.string,
        goToQuestionStats: PropTypes.bool,
        isJustRegistered : PropTypes.bool,
        isJustCompleted  : PropTypes.bool
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
        if(!this.props.question || this.props.question.questionId !== this.props.params.questionId) {
            requestData(this.props);
        }
        if(this.props.isJustCompleted) {
            window.setTimeout(function() { nekunoApp.popup('.popup-register-finished') }, 0);
        }
    }

    componentDidUpdate() {
        if(this.props.goToQuestionStats) {
            this.context.history.pushState(null, `/question-stats`);
        }
    }

    skipQuestionHandler() {
        let userId = parseUserId(this.props.user);
        let questionId = this.props.question.questionId;
        QuestionActionCreators.skipQuestion(userId, questionId);
    }

    onContinue() {
        this.context.history.pushState(null, '/threads');
    }

    render() {

        const {user, strings, errors, noMoreQuestions, isFirstQuestion, userAnswer, question} = this.props;
        const userId = selectn('qnoow_id', user);
        const ownPicture = user.picture ? `${IMAGES_ROOT}media/cache/resolve/user_avatar_60x60/user/images/${user.picture}` : `${IMAGES_ROOT}media/cache/user_avatar_60x60/bundles/qnoowweb/images/user-no-img.jpg`;
        const isRegisterQuestion = selectn('isRegisterQuestion', question);

        return (
            <div className="view view-main">
                {this.props.isJustRegistered ?
                    <RegularTopNavbar centerText={strings.question}/>
                    :
                    <LeftMenuTopNavbar centerText={strings.question} rightText={isRegisterQuestion ? '' : strings.skip} onRightLinkClickHandler={isRegisterQuestion ? null : this.skipQuestionHandler}/>
                }
                <div className="page answer-question-page">
                    <div id="page-content" className="answer-question-content">
                        <AnswerQuestion question={question} userAnswer={userAnswer} isFirstQuestion={isFirstQuestion} userId={userId} errors={errors} noMoreQuestions={noMoreQuestions} ownPicture={ownPicture}/>
                    </div>
                </div>
                <RegisterQuestionsFinishedPopup onContinue={this.onContinue} />
            </div>
        );
    }
}

AnswerQuestionPage.defaultProps = {
    strings: {
        question: 'Pregunta',
        skip    : 'Omitir'
    }
};