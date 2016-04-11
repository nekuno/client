import React, { PropTypes, Component } from 'react';
import { IMAGES_ROOT } from '../constants/Constants';
import RegularTopNavbar from '../components/ui/RegularTopNavbar';
import ToolBar from '../components/ui/ToolBar';
import OtherQuestionList from '../components/questions/OtherQuestionList';
import ProfilesAvatarConnection from '../components/ui/ProfilesAvatarConnection';
import AuthenticatedComponent from '../components/AuthenticatedComponent';
import translate from '../i18n/Translate';
import connectToStores from '../utils/connectToStores';
import * as QuestionActionCreators from '../actions/QuestionActionCreators';
import * as UserActionCreators from '../actions/UserActionCreators';
import UserStore from '../stores/UserStore';
import QuestionStore from '../stores/QuestionStore';
import QuestionsByUserIdStore from '../stores/QuestionsByUserIdStore';

function parseId(user) {
    return user.qnoow_id;
}

/**
 * Requests data from server for current props.
 */
function requestData(props, state) {
    const {params} = props;
    const userId = parseId(props.user);
    const otherUserId = parseInt(params.userId);
    UserActionCreators.requestUser(otherUserId, ['username', 'email', 'picture', 'status']);
    QuestionActionCreators.requestComparedQuestions(userId, otherUserId, state.filters);
}

/**
 * Retrieves state from stores for current props.
 */
function getState(props) {
    const currentUserId = parseId(props.user);
    const otherUserId = parseInt(props.params.userId);
    const pagination = QuestionStore.getPagination(otherUserId) || {};
    const questions = QuestionStore.get(currentUserId);
    const otherQuestions = QuestionStore.get(otherUserId) || {};
    const otherUser = UserStore.get(otherUserId);

    return {
        pagination,
        questions,
        otherQuestions,
        otherUser
    };
}

@AuthenticatedComponent
@translate('OtherQuestionsPage')
@connectToStores([UserStore, QuestionStore, QuestionsByUserIdStore], getState)
export default class OtherQuestionsPage extends Component {
    static propTypes = {
        // Injected by React Router:
        params        : PropTypes.shape({
            userId: PropTypes.string.isRequired
        }),
        // Injected by @AuthenticatedComponent
        user          : PropTypes.object.isRequired,
        // Injected by @translate:
        strings       : PropTypes.object,
        // Injected by @connectToStores:
        pagination    : PropTypes.object.isRequired,
        questions     : PropTypes.object,
        otherQuestions: PropTypes.object.isRequired,
        otherUser     : PropTypes.object
    };

    constructor(props) {

        super(props);

        this.handleScroll = this.handleScroll.bind(this);

        this.state = {
            filters: ['showOnlyCommon']
        }
    }

    componentWillMount() {
        if (Object.keys(this.props.pagination).length === 0) {
            requestData(this.props, this.state);
        }
    }

    componentWillUnmount() {
        document.getElementsByClassName('view')[0].removeEventListener('scroll', this.handleScroll);
    }

    componentWillReceiveProps(nextProps) {
        if (parseId(nextProps.params) !== parseId(this.props.params)) {
            requestData(nextProps);
        }
    }

    handleScroll() {
        let pagination = this.props.pagination;
        let nextLink = pagination && pagination.hasOwnProperty('nextLink') ? pagination.nextLink : null;
        let offsetTop = parseInt(document.getElementsByClassName('view')[0].scrollTop + document.getElementsByClassName('view')[0].offsetHeight - 49);
        let offsetTopMax = parseInt(document.getElementById('page-content').offsetHeight);

        if (nextLink && offsetTop >= offsetTopMax) {
            document.getElementsByClassName('view')[0].removeEventListener('scroll', this.handleScroll);
            QuestionActionCreators.requestNextComparedQuestions(parseId(this.props.user), parseId(this.props.otherUser), nextLink);
        }
    }

    render() {
        const ownPicture = this.props.user && this.props.user.picture ? `${IMAGES_ROOT}media/cache/resolve/user_avatar_60x60/user/images/${this.props.user.picture}` : `${IMAGES_ROOT}media/cache/user_avatar_60x60/bundles/qnoowweb/images/user-no-img.jpg`;
        const otherPicture = this.props.otherUser && this.props.otherUser.picture ? `${IMAGES_ROOT}media/cache/resolve/user_avatar_60x60/user/images/${this.props.otherUser.picture}` : `${IMAGES_ROOT}media/cache/user_avatar_60x60/bundles/qnoowweb/images/user-no-img.jpg`;
        const strings = this.props.strings;
        return (
            <div className="view view-main" onScroll={this.handleScroll}>
                <RegularTopNavbar leftText={strings.cancel} centerText={this.props.otherUser ? this.props.otherUser.username : ''}/>
                <div className="page other-questions-page">
                    {this.props.user && this.props.otherUser ?
                        <div id="page-content" className="other-questions-content">
                            <div className="other-questions-header-container">
                                <ProfilesAvatarConnection ownPicture={ownPicture} otherPicture={otherPicture}/>
                                <div className="other-questions-stats-title title">{this.props.pagination.total || 0} {strings.coincidences}</div>
                            </div>
                            <OtherQuestionList otherQuestions={this.props.otherQuestions} questions={this.props.questions} userId={this.props.user.qnoow_id} ownPicture={ownPicture} otherPicture={otherPicture}/>
                            <div className="loading-gif" style={this.props.pagination.nextLink ? {} : {display: 'none'}}></div>
                            <br />
                            <br />
                            <br />
                        </div>
                        : ''
                    }
                </div>
                <ToolBar links={[
                {'url': `/profile/${this.props.params.userId}`, 'text': strings.about},
                {'url': `/users/${this.props.params.userId}/other-questions`, 'text': strings.questions},
                {'url': `/users/${this.props.params.userId}/other-interests`, 'text': strings.interests}
                ]} activeLinkIndex={1}/>
            </div>
        );
    }

};

OtherQuestionsPage.defaultProps = {
    strings: {
        cancel      : 'Cancel',
        coincidences: 'Coincidences',
        about       : 'About',
        questions   : 'Answers',
        interests   : 'Interests'
    }
};