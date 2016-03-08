import React, { PropTypes, Component } from 'react';
import { Link } from 'react-router';
import selectn from 'selectn';
import { IMAGES_ROOT } from '../constants/Constants';
import * as QuestionActionCreators from '../actions/QuestionActionCreators';
import LeftMenuTopNavbar from '../components/ui/LeftMenuTopNavbar';
import RegularTopNavbar from '../components/ui/RegularTopNavbar';
import AnswerQuestion from '../components/questions/AnswerQuestion';
import AuthenticatedComponent from '../components/AuthenticatedComponent';
import connectToStores from '../utils/connectToStores';
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
    const { user, params } = props;
    const questionId = params.hasOwnProperty('questionId') ? parseInt(params.questionId) : null;
    const currentUserId = parseUserId(user);
    return QuestionActionCreators.requestQuestion(currentUserId, questionId);
}

/**
 * Retrieves state from stores for current props.
 */
function getState(props) {
    const { user, params } = props;
    const currentUserId = parseUserId(user);
    const currentUser = UserStore.get(currentUserId);
    const question = QuestionStore.getQuestion();
    const isFirstQuestion = QuestionStore.isFirstQuestion(currentUserId);
    const questionId = params.hasOwnProperty('questionId') ? parseInt(params.questionId) : selectn('questionId', question);
    const userAnswer = questionId ? QuestionStore.getUserAnswer(currentUserId, questionId) : {};
    const errors = QuestionStore.getErrors();
    const goToQuestionStats = QuestionStore.mustGoToQuestionStats();
    const isJustRegistered = Object.keys(QuestionsByUserIdStore.getByUserId(currentUserId)).length < 4;

    return {
        currentUser,
        question,
        isFirstQuestion,
        userAnswer,
        user,
        errors,
        goToQuestionStats,
        isJustRegistered
    };
}

@connectToStores([UserStore, QuestionStore, QuestionsByUserIdStore], getState)
export default AuthenticatedComponent(class AnswerQuestionPage extends Component {
    static propTypes = {
        // Injected by React Router:
        params: PropTypes.shape({
            questionId: PropTypes.string
        }),

        // Injected by @connectToStores:
        question: PropTypes.object,
        userAnswer: PropTypes.object,
        isFirstQuestion: PropTypes.bool,
        errors: PropTypes.string,
        goToQuestionStats: PropTypes.bool,
        isJustRegistered: PropTypes.bool,

        // Injected by AuthenticatedComponent
        user: PropTypes.object.isRequired
    };


    static contextTypes = {
        history: PropTypes.object.isRequired
    };

    constructor(props) {
        super(props);

        this.skipQuestionHandler = this.skipQuestionHandler.bind(this);
    }

    componentWillMount() {
        if (!this.props.question || this.props.question.questionId !== this.props.params.questionId) {
            let promise = requestData(this.props);
            let isJustRegistered = this.props.isJustRegistered;
            let history = this.context.history;
            let userId = parseUserId(this.props.user);
            promise.then(function (data) {
                    const questions =data.entities.question;
                    if (isJustRegistered && questions[Object.keys(questions)[0]].isRegisterQuestion === false) {
                        history.pushState(null, '/threads/' + userId);
                    }
                }
            );
        }
    }

    componentDidUpdate() {
        if (this.props.goToQuestionStats) {
            this.context.history.pushState(null, `/question-stats`);
        }
    }

    render() {
        const user = this.props.user;
        const userId = selectn('qnoow_id', user);
        const ownPicture = user.picture ? `${IMAGES_ROOT}media/cache/resolve/user_avatar_60x60/user/images/${user.picture}` : `${IMAGES_ROOT}media/cache/user_avatar_60x60/bundles/qnoowweb/images/user-no-img.jpg`;
        const defaultPicture = `${IMAGES_ROOT}media/cache/user_avatar_60x60/bundles/qnoowweb/images/user-no-img.jpg`;
        const isRegisterQuestion = selectn('question.isRegisterQuestion', this.props);

        return (
            <div className="view view-main">
                {this.props.isJustRegistered ?
                    <RegularTopNavbar centerText={'Pregunta'}/>
                    :
                    <LeftMenuTopNavbar centerText={'Pregunta'} rightText={isRegisterQuestion ? '' : 'Omitir'} onRightLinkClickHandler={isRegisterQuestion ? null : this.skipQuestionHandler}/>
                }
                <div data-page="index" className="page answer-question-page">
                    <div id="page-content" className="answer-question-content">
                        {this.props.question ?
                            <AnswerQuestion question={this.props.question} userAnswer={this.props.userAnswer} isFirstQuestion={this.props.isFirstQuestion} userId={userId} errors={this.props.errors} ownPicture={ownPicture} defaultPicture={defaultPicture} />
                            :
                            ''
                        }
                    </div>
                </div>
            </div>
        );
    }

    skipQuestionHandler() {
        let userId = parseUserId(this.props.user);
        let questionId = this.props.question.questionId;
        QuestionActionCreators.skipQuestion(userId, questionId);
    }
});