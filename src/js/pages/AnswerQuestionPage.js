import React, { PropTypes, Component } from 'react';
import { Link } from 'react-router';
import selectn from 'selectn';
import { IMAGES_ROOT } from '../constants/Constants';
import * as QuestionActionCreators from '../actions/QuestionActionCreators';
import LeftMenuTopNavbar from '../components/ui/LeftMenuTopNavbar';
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
    QuestionActionCreators.requestQuestion(currentUserId, questionId);
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

    return {
        currentUser,
        question,
        isFirstQuestion,
        userAnswer,
        user,
        errors,
        goToQuestionStats
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

        // Injected by AuthenticatedComponent
        user: PropTypes.object.isRequired
    };


    static contextTypes = {
        history: PropTypes.object.isRequired
    };

    constructor(props) {
        super(props);

        this.skipQuestionHandler = this.skipQuestionHandler.bind(this);

        this.state = {
            ready: false
        };
    }

    componentWillMount() {
        requestData(this.props);
    }

    componentWillUnmount() {
        this.setState({
            ready: false
        })
    }

    componentDidUpdate() {
        if (this.props.goToQuestionStats) {
            this.context.history.pushState(null, `/question-stats`);
        }
    }

    componentWillReceiveProps() {
        this.setState({
            ready: true
        })
    }

    render() {
        const user = this.props.user;
        const userId = selectn('qnoow_id', user);
        const ownPicture = selectn('picture', user) ? `${IMAGES_ROOT}/media/cache/user_avatar_60x60/bundles/qnoowweb/images/${user.picture}` : `${IMAGES_ROOT}/media/cache/user_avatar_60x60/bundles/qnoowweb/images/user-no-img.jpg`;
        const defaultPicture = `${IMAGES_ROOT}/media/cache/user_avatar_60x60/bundles/qnoowweb/images/user-no-img.jpg`;
        const isRegisterQuestion = selectn('question.isRegisterQuestion', this.props);

        return (
            <div className="view view-main">
                <LeftMenuTopNavbar centerText={'Pregunta'} rightText={isRegisterQuestion ? '' : 'Omitir'} onRightLinkClickHandler={isRegisterQuestion ? null : this.skipQuestionHandler} />
                <div data-page="index" className="page answer-question-page">
                    <div id="page-content" className="answer-question-content">
                        {this.props.question && this.state.ready ?
                            <AnswerQuestion question={this.props.question} userAnswer={this.props.userAnswer} isFirstQuestion={this.props.isFirstQuestion} userId={userId} errors={this.props.errors} ownPicture={ownPicture} defaultPicture={defaultPicture} />
                            :
                            <h1>Loading...</h1>
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