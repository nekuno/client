import React, { PropTypes, Component } from 'react';
import selectn from 'selectn';
import TopNavBar from '../components/ui/TopNavBar';
import AnswerQuestion from '../components/questions/AnswerQuestion';
import AuthenticatedComponent from '../components/AuthenticatedComponent';
import translate from '../i18n/Translate';
import connectToStores from '../utils/connectToStores';
import * as QuestionActionCreators from '../actions/QuestionActionCreators';
import UserStore from '../stores/UserStore';
import QuestionStore from '../stores/QuestionStore';

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
    const questionId = parseInt(params.questionId);
    const from = params.from;
    const userAnswer = questionId ? QuestionStore.getUserAnswer(currentUserId, questionId) : {};
    const errors = QuestionStore.getErrors();
    const noMoreQuestions = QuestionStore.noMoreQuestions();
    const goToQuestionStats = QuestionStore.mustGoToQuestionStats();

    return {
        currentUser,
        question,
        from,
        userAnswer,
        user,
        errors,
        noMoreQuestions,
        goToQuestionStats
    };
}

@AuthenticatedComponent
@translate('AnswerQuestionPage')
@connectToStores([UserStore, QuestionStore], getState)
export default class AnswerQuestionPage extends Component {

    static propTypes = {
        // Injected by React Router:
        params                 : PropTypes.shape({
            questionId: PropTypes.string,
            from      : PropTypes.string
        }),
        // Injected by @AuthenticatedComponent
        user                   : PropTypes.object.isRequired,
        // Injected by @translate:
        strings                : PropTypes.object,
        // Injected by @connectToStores:
        question               : PropTypes.object,
        userAnswer             : PropTypes.object,
        errors                 : PropTypes.string,
        goToQuestionStats      : PropTypes.bool
    };

    static contextTypes = {
        router: PropTypes.object.isRequired
    };

    constructor(props) {
        super(props);

        this.skipQuestionHandler = this.skipQuestionHandler.bind(this);
    }

    componentWillMount() {
        const questionId = this.props.params.questionId;
        if(!this.props.question || this.props.question.questionId !== questionId) {
            window.setTimeout(() => requestData(this.props), 0);
        }
    }

    componentDidUpdate() {
        const {goToQuestionStats, question, from} = this.props;
        if (goToQuestionStats) {
            this.context.router.replace(`/question-stats/${from}`);
        }
    }

    skipQuestionHandler() {
        let userId = parseId(this.props.user);
        let questionId = this.props.question.questionId;
        QuestionActionCreators.skipQuestion(userId, questionId);
    }

    render() {
        const {user, strings, errors, noMoreQuestions, userAnswer, question} = this.props;
        const userId = parseId(user);
        const ownPicture = user.photo ? user.photo.thumbnail.small : 'img/no-img/small.jpg';
        const isRegisterQuestion = selectn('isRegisterQuestion', question);

        return (
            <div className="views">
                <TopNavBar leftMenuIcon={true} centerText={strings.question} rightIcon={isRegisterQuestion ? '' : 'delete'} onRightLinkClickHandler={isRegisterQuestion ? null : this.skipQuestionHandler}/>
                <div className="view view-main">
                    <div className="page answer-question-page">
                        <div id="page-content" className="answer-question-content">
                            <AnswerQuestion question={question} userAnswer={userAnswer} userId={userId} errors={errors} noMoreQuestions={noMoreQuestions} ownPicture={ownPicture}/>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

AnswerQuestionPage.defaultProps = {
    strings: {
        question: 'Question',
        skip    : 'Skip'
    }
};