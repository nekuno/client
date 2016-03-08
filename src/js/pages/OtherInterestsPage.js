import React, { PropTypes, Component } from 'react';
import { IMAGES_ROOT } from '../constants/Constants';
import LeftMenuRightSearchTopNavbar from '../components/ui/LeftMenuRightSearchTopNavbar';
import ToolBar from '../components/ui/ToolBar';
import AuthenticatedComponent from '../components/AuthenticatedComponent';
import connectToStores from '../utils/connectToStores';
import UserStore from '../stores/UserStore';
import InterestStore from '../stores/InterestStore';
import InterestsByUserStore from '../stores/InterestsByUserStore';
import * as UserActionCreators from '../actions/UserActionCreators';
import * as InterestsActionCreators from '../actions/InterestsActionCreators';
import CardContentList from '../components/interests/CardContentList';
import FilterContentPopup from '../components/ui/FilterContentPopup';
import ProfilesAvatarConnection from '../components/ui/ProfilesAvatarConnection';


function parseId(user) {
    return user.qnoow_id;
}

function requestData(props) {
    const { user } = props;
    const userId = parseId(user);
    UserActionCreators.requestUser(props.params.userId, ['username', 'email', 'picture', 'status']);
    UserActionCreators.requestComparedStats(userId, props.params.userId);
    InterestsActionCreators.requestComparedInterests(userId, props.params.userId);
}

function getState(props) {
    const otherUserId = props.params.userId;
    const interests = InterestStore.get(otherUserId) || [];
    const pagination = InterestStore.getPagination(otherUserId) || {};
    return {
        pagination,
        interests
    };
}

@connectToStores([UserStore, InterestStore, InterestsByUserStore], getState)
export default AuthenticatedComponent(class OtherInterestsPage extends Component {
    static propTypes = {
        // Injected by React Router:
        params: PropTypes.shape({
            userId: PropTypes.string.isRequired
        }).isRequired,

        user: PropTypes.object.isRequired,
    };

    constructor(props) {
        super(props);

        this.onSearchClick = this.onSearchClick.bind(this);
        this.handleScroll = this.handleScroll.bind(this);
    }

    componentWillMount() {
        if (Object.keys(this.props.pagination).length === 0) {
            requestData(this.props);
        }
    }

    componentWillUnmount() {
        document.getElementsByClassName('view')[0].removeEventListener('scroll', this.handleScroll);
    }

    render() {
        const interests = this.props.interests;
        const otherUser = this.props.otherUser;
        const ownUser = this.props.user;
        const ownUserId = this.props.user.qnoow_id;
        const otherUserId = parseInt(this.props.params.userId);
        const otherUserPicture = otherUser && otherUser.picture ? `${IMAGES_ROOT}media/cache/resolve/user_avatar_60x60/user/images/${otherUser.picture}` : `${IMAGES_ROOT}media/cache/user_avatar_60x60/bundles/qnoowweb/images/user-no-img.jpg`;
        const ownPicture = ownUser && ownUser.picture ? `${IMAGES_ROOT}media/cache/resolve/user_avatar_60x60/user/images/${ownUser.picture}` : `${IMAGES_ROOT}media/cache/user_avatar_60x60/bundles/qnoowweb/images/user-no-img.jpg`;
        return (
            <div className="view view-main" onScroll={this.handleScroll}>
                <LeftMenuRightSearchTopNavbar centerText={otherUser ? otherUser.username : ''} onRightLinkClickHandler={this.onSearchClick}/>
                <div data-page="index" className="page other-interests-page">
                    <div id="page-content" className="other-interests-content">
                        <ProfilesAvatarConnection ownPicture={ownPicture} otherPicture={otherUserPicture} />
                        {/* TODO: Use interests count */}
                        <div className="title">567 Intereses similares</div>
                        <CardContentList contents={interests} userId={otherUserId} />
                        <br />
                        <div className="loading-gif" style={this.props.pagination.nextLink ? {} : {display: 'none'}}></div>
                    </div>
                    <br/>
                    <br/>
                    <br/>
                </div>
                <ToolBar links={[
                {'url': `/profile/${otherUserId}`, 'text': 'Acerca de'},
                {'url': `/users/${otherUserId}/other-questions`, 'text': 'Respuestas'},
                {'url': `/users/${otherUserId}/other-interests`, 'text': 'Intereses'}
                ]} activeLinkIndex={2}/>
                {/* TODO: Pass interests count */}
                <FilterContentPopup userId={otherUserId} contentsCount={567} ownContent={false} ownUserId={ownUserId}/>
            </div>
        );
    }

    onSearchClick = function () {
        nekunoApp.popup('.popup-filter-other-contents');
    };

    handleScroll() {
        let pagination = this.props.pagination;
        let nextLink = pagination && pagination.hasOwnProperty('nextLink') ? pagination.nextLink : null;
        let offsetTop = parseInt(document.getElementsByClassName('view')[0].scrollTop + document.getElementsByClassName('view')[0].offsetHeight - 110);
        let offsetTopMax = parseInt(document.getElementById('page-content').offsetHeight);

        if (nextLink && offsetTop >= offsetTopMax) {
            document.getElementsByClassName('view')[0].removeEventListener('scroll', this.handleScroll);
            InterestsActionCreators.requestNextComparedInterests(parseId(this.props.user), this.props.params.userId, nextLink);
        }
    }
});