import React, { PropTypes, Component } from 'react';
import { Link } from 'react-router';
import selectn from 'selectn';
import { IMAGES_ROOT } from '../constants/Constants';
import * as QuestionActionCreators from '../actions/QuestionActionCreators';
import * as UserActionCreators from '../actions/UserActionCreators';
import RegularTopNavbar from '../components/ui/RegularTopNavbar';
import ToolBar from '../components/ui/ToolBar';
import OtherQuestionList from '../components/questions/OtherQuestionList';
import AuthenticatedComponent from '../components/AuthenticatedComponent';
import connectToStores from '../utils/connectToStores';
import UserStore from '../stores/UserStore';
import ProfileStore from '../stores/ProfileStore';
import QuestionStore from '../stores/QuestionStore';
import QuestionsByUserIdStore from '../stores/QuestionsByUserIdStore';

function parseId(user) {
    return user.qnoow_id;
}

/**
 * Requests data from server for current props.
 */
function requestData(props) {
    const { user, params } = props;
    const userId = parseId(user);
    const otherUserId = parseInt(params.userId);
    UserActionCreators.requestUser(otherUserId, ['username', 'email', 'picture', 'status']);
    QuestionActionCreators.requestComparedQuestions(userId, otherUserId);
}

/**
 * Retrieves state from stores for current props.
 */
function getState(props) {
    const currentUserId = parseId(props.user);
    const { user } = props;
    const otherUserId = parseInt(props.params.userId);
    const currentUser = UserStore.get(currentUserId);
    const otherUser = UserStore.get(otherUserId);
    const questions = QuestionStore.get(currentUserId);
    const otherQuestions = QuestionStore.get(otherUserId);
    const pagination = QuestionStore.getPagination(otherUserId);

    return {
        currentUser,
        pagination,
        otherQuestions,
        questions,
        user,
        otherUser
    };
}

@connectToStores([UserStore, ProfileStore, QuestionStore, QuestionsByUserIdStore], getState)
export default AuthenticatedComponent(class OtherQuestionsPage extends Component {
    static propTypes = {
        // Injected by React Router:
        params: PropTypes.shape({
            userId: PropTypes.string.isRequired
        }),

        // Injected by @connectToStores:
        questions: PropTypes.object,
        otherQuestions: PropTypes.object,
        pagination: PropTypes.object,
        otherUser: PropTypes.object,
        // Injected by AuthenticatedComponent
        user: PropTypes.object
    };

    constructor(props) {
        super(props);

        this.handleScroll = this.handleScroll.bind(this);
    }

    componentWillMount() {
        requestData(this.props);
    }

    componentWillUnmount() {
        document.getElementsByClassName('view')[0].removeEventListener('scroll', this.handleScroll);
    }

    render() {
        if (!this.props.questions || !this.props.user || !this.props.otherUser) {
            return null;
        }

        const ownPicture = this.props.user && this.props.user.picture ? `${IMAGES_ROOT}/media/cache/user_avatar_60x60/user/images/${this.props.user.picture}` : `${IMAGES_ROOT}/media/cache/user_avatar_60x60/bundles/qnoowweb/images/user-no-img.jpg`;
        const otherPicture = this.props.otherUser && this.props.otherUser.picture ? `${IMAGES_ROOT}/media/cache/user_avatar_60x60/user/images/${this.props.otherUser.picture}` : `${IMAGES_ROOT}/media/cache/user_avatar_60x60/bundles/qnoowweb/images/user-no-img.jpg`;
        return (
            <div className="view view-main" onScroll={this.handleScroll}>
                <RegularTopNavbar leftText={'Cancelar'} centerText={this.props.otherUser.username}/>
                <div data-page="index" className="page other-questions-page">
                    <div id="page-content" className="other-questions-content">

                        <OtherQuestionList otherQuestions={this.props.otherQuestions} questions={this.props.questions} userId={this.props.user.qnoow_id} ownPicture={ownPicture} otherPicture={otherPicture} />
                        <div className="loading-gif" style={{display: this.props.pagination.nextLink}}></div>
                        <br />
                        <br />
                        <br />
                    </div>
                </div>
                <ToolBar links={[
                {'url': `/profile/${this.props.params.userId}`, 'text': 'Acerca de'},
                {'url': `/users/${this.props.params.userId}/other-questions`, 'text': 'Respuestas'},
                {'url': `/users/${this.props.params.userId}/other-interests`, 'text': 'Intereses'}
                ]} activeLinkIndex={1}/>
            </div>
        );
    }

    handleScroll() {
        let pagination = this.props.pagination;
        let nextLink = pagination && pagination.hasOwnProperty('nextLink') ? pagination.nextLink : null;
        let offsetTop = parseInt(document.getElementsByClassName('view')[0].scrollTop + document.getElementsByClassName('view')[0].offsetHeight - 49);
        let offsetTopMax = parseInt(document.getElementById('page-content').offsetHeight);

        if (nextLink && offsetTop >= offsetTopMax) {
            QuestionActionCreators.requestNextComparedQuestions(parseId(this.props.user), parseId(this.props.otherUser), nextLink);
        }
    }
});