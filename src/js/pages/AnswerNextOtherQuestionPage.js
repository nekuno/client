import React, { PropTypes, Component } from 'react';
import TopNavBar from '../components/ui/TopNavBar';
import AnswerQuestion from '../components/questions/AnswerQuestion';
import AuthenticatedComponent from '../components/AuthenticatedComponent';
import translate from '../i18n/Translate';
import connectToStores from '../utils/connectToStores';
import * as QuestionActionCreators from '../actions/QuestionActionCreators';
import * as UserActionCreators from '../actions/UserActionCreators';
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
    const currentUserId = parseId(user);
    const otherUserSlug = params.slug;

    UserActionCreators.requestUser(otherUserSlug, ['username', 'photo']).then(
        () => {
            const otherUser = UserStore.getBySlug(params.slug);
            const otherUserId = parseId(otherUser);
            QuestionActionCreators.requestNextOtherQuestion(currentUserId, otherUserId);
        },
        (status) => { console.log(status.error) }
    );
}

/**
 * Retrieves state from stores for current props.
 */
function getState(props) {
    const {user, params} = props;
    const slug = params.slug;
    const currentUserId = parseId(user);
    const question = QuestionStore.getQuestion();
    const questionId = question ? parseInt(question.questionId) : null;
    const userAnswer = questionId ? QuestionStore.getUserAnswer(currentUserId, questionId) : {};
    const errors = QuestionStore.getErrors();
    const noMoreQuestions = QuestionStore.noMoreQuestions();
    const goToQuestionStats = QuestionStore.mustGoToQuestionStats();
    const otherUser = UserStore.getBySlug(params.slug);

    return {
        question,
        slug,
        userAnswer,
        user,
        errors,
        noMoreQuestions,
        goToQuestionStats,
        otherUser
    };
}

@AuthenticatedComponent
@translate('AnswerNextOtherQuestionPage')
@connectToStores([UserStore, QuestionStore], getState)
export default class AnswerNextOtherQuestionPage extends Component {

    static propTypes = {
        // Injected by React Router:
        params                 : PropTypes.shape({
            slug: PropTypes.string,
        }),
        // Injected by @AuthenticatedComponent
        user                   : PropTypes.object.isRequired,
        // Injected by @translate:
        strings                : PropTypes.object,
        // Injected by @connectToStores:
        question               : PropTypes.object,
        userAnswer             : PropTypes.object,
        errors                 : PropTypes.string,
        noMoreQuestions        : PropTypes.bool,
        goToQuestionStats      : PropTypes.bool,
        otherUser              : PropTypes.object
    };

    static contextTypes = {
        router: PropTypes.object.isRequired
    };

    componentWillMount() {
        window.setTimeout(() => requestData(this.props), 0);
    }

    componentDidUpdate() {
        const {goToQuestionStats, noMoreQuestions, question, user, otherUser, params, strings} = this.props;
        if (goToQuestionStats) {
            setTimeout(() => {
                QuestionActionCreators.requestComparedQuestions(parseId(user), parseId(otherUser), ['showOnlyCommon']).then(() =>
                    this.context.router.replace(`/question-other-stats/${params.slug}`)
                ).catch((error) => console.log(error));
            }, 0);
        }
        if (noMoreQuestions) {
            nekunoApp.alert(strings.noMoreQuestions);
            this.context.router.replace(`/users/${params.slug}/other-questions`);
        }
    }

    render() {
        const {user, strings, errors, noMoreQuestions, userAnswer, question} = this.props;
        const userId = parseId(user);
        const ownPicture = user.photo ? user.photo.thumbnail.small : 'img/no-img/small.jpg';

        return (
            <div className="views">
                <TopNavBar leftIcon={'left-arrow'} centerText={strings.question}/>
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

AnswerNextOtherQuestionPage.defaultProps = {
    strings: {
        question       : 'Question',
        noMoreQuestions: 'No more questions from this user'
    }
};