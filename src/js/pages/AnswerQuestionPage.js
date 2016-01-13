import React, { PropTypes, Component } from 'react';
import { Link } from 'react-router';
import selectn from 'selectn';
import { IMAGES_ROOT } from '../constants/Constants';
import * as UserActionCreators from '../actions/UserActionCreators';
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
    const { user, questionId } = props;
    const currentUserId = parseUserId(user);

    UserActionCreators.requestQuestion(currentUserId, questionId);
}

/**
 * Retrieves state from stores for current props.
 */
function getState(props) {
    const { user, params } = props;
    const currentUserId = parseUserId(user);
    const currentUser = UserStore.get(currentUserId);
    const question = QuestionStore.getQuestion();

    return {
        currentUser,
        question,
        user
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

        // Injected by AuthenticatedComponent
        user: PropTypes.object.isRequired
    };

    componentWillMount() {
        requestData(this.props);
    }

    render() {
        if (!this.props.question) {
            return null;
        }

        const user = this.props.user;
        const userId = user.qnoow_id;
        const ownPicture = this.props.user && this.props.user.picture ? `${IMAGES_ROOT}/media/cache/user_avatar_60x60/bundles/qnoowweb/images/${user.picture}` : `${IMAGES_ROOT}/media/cache/user_avatar_60x60/bundles/qnoowweb/images/user-no-img.jpg`;
        const defaultPicture = `${IMAGES_ROOT}/media/cache/user_avatar_60x60/bundles/qnoowweb/images/user-no-img.jpg`;

        return (
            <div className="view view-main">
                <LeftMenuTopNavbar centerText={'Pregunta'} rightText={'Omitir'}/>
                <div data-page="index" className="page answer-question-page">
                    <div id="page-content" className="answer-question-content">
                        <AnswerQuestion question={this.props.question} userId={userId} ownPicture={ownPicture} defaultPicture={defaultPicture} />
                    </div>
                </div>
            </div>
        );
    }
});