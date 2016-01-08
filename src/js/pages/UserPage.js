import React, { PropTypes, Component } from 'react';
import selectn from 'selectn';
import { IMAGES_ROOT } from '../constants/Constants';
import * as UserActionCreators from '../actions/UserActionCreators';
import UserStore from '../stores/UserStore';
import ProfileStore from '../stores/ProfileStore';
import StatsStore from '../stores/StatsStore';
import MatchingStore from '../stores/MatchingStore';
import SimilarityStore from '../stores/SimilarityStore';
import User from '../components/User';
import OtherProfileData from '../components/profile/OtherProfileData';
import ProfileDataList from '../components/profile/ProfileDataList'
import LeftMenuTopNavbar from '../components/ui/LeftMenuTopNavbar';
import ProgressBar from '../components/ui/ProgressBar';
import ToolBar from '../components/ui/ToolBar';
import Button from '../components/ui/Button';
import connectToStores from '../utils/connectToStores';
import AuthenticatedComponent from '../components/AuthenticatedComponent';

function parseId(params) {
    return params.userId;
}

/**
 * Requests data from server for current props.
 */
function requestData(props) {
    //user === logged user
    const { params, user, userLoggedIn } = props;
    //current === user whose profile is being viewed
    const currentUserId = parseId(params);

    if (!(userLoggedIn && user && (user.qnoow_id == currentUserId))) {
        UserActionCreators.requestMatching(parseInt(currentUserId), user.qnoow_id);
        UserActionCreators.requestSimilarity(currentUserId, user.qnoow_id);
    }

    UserActionCreators.requestUser(currentUserId, ['username', 'email', 'picture', 'status']);
    UserActionCreators.requestProfile(currentUserId);
    UserActionCreators.requestMetadata(currentUserId);
    UserActionCreators.requestStats(currentUserId);

}

/**
 * Retrieves state from stores for current props.
 */
function getState(props) {
    const currentUserId = parseId(props.params);
    const {userLoggedIn, user} = props;
    //to use when changing route
    const currentUser = UserStore.get(currentUserId);
    const profile = ProfileStore.getWithMetadata(currentUserId);
    const stats = StatsStore.get(currentUserId);

    let matching = 0;
    let similarity = 0;
    if (!(userLoggedIn && user && (user.qnoow_id == currentUserId))) {
        matching = MatchingStore.get(currentUserId, user.qnoow_id);
        similarity = SimilarityStore.get(currentUserId, user.qnoow_id);
    }

    return {
        currentUser,
        profile,
        stats,
        matching,
        similarity,
        userLoggedIn,
        user
    };
}

/**
 * Set rate like.
 */
function setLikeUser(props) {
    const { user, currentUser } = props;

    UserActionCreators.likeUser(user.qnoow_id, currentUser.qnoow_id);
}

/**
 * Unset rate like.
 */
function unsetLikeUser(props) {
    const { user, currentUser } = props;

    UserActionCreators.deleteLikeUser(user.qnoow_id, currentUser.qnoow_id);
}

@connectToStores([UserStore, ProfileStore, StatsStore, MatchingStore, SimilarityStore], getState)
export default AuthenticatedComponent(class UserPage extends Component {
    static propTypes = {
        // Injected by React Router:
        params: PropTypes.shape({
            userId: PropTypes.string.isRequired
        }).isRequired,

        // Injected by @connectToStores:
        //currentUser: PropTypes.object,
        //profile: PropTypes.array,
        stats: PropTypes.object,
        matching: PropTypes.number,

        // Injected by AuthenticatedComponent
        user: PropTypes.object
    };

    constructor(props) {
        super(props);

        this.onRate = this.onRate.bind(this);
    }

    componentWillMount() {
        requestData(this.props);
    }

    componentWillReceiveProps(nextProps) {
        if (parseId(nextProps.params) !== parseId(this.props.params)) {
            requestData(nextProps);
        }
    }

    onRate() {
        if (!this.rate){
            setLikeUser(this.props);
            this.rate = true;
        } else {
            unsetLikeUser(this.props);
            this.rate = false;
        }
    }


    render() {
        const { userLoggedIn, user, currentUser, profile, stats, matching, similarity } = this.props;
        const rate = this.rate;
        const currentUserId = currentUser? currentUser.qnoow_id : null;
        const currentPicture = currentUser? currentUser.picture : null;
        const likeText = rate ? "Ya no me gusta" : "Me gusta";

        let ownProfile=false;
        if (userLoggedIn && user && (user.qnoow_id == currentUserId)){
            ownProfile = true;
        }
        let otherProfileHTML = '';

        if (!ownProfile) {
            const ownPicture = user && user.picture ? user.picture : `${IMAGES_ROOT}/media/cache/user_avatar_180x180/bundles/qnoowweb/images/user-no-img.jpg`;
            otherProfileHTML =
                <div className="otherProfileWrapper" >
                    <OtherProfileData matching = {matching} similarity = {similarity} stats = {stats} ownImage = {ownPicture} currentImage = {currentPicture} />
                </div>
        }

        return (
            <div className="view view-main">
                <div data-page="index" className="page toolbar-fixed user-page">
                    <LeftMenuTopNavbar centerText={'Mi Perfil'} />

                    <div id="page-content">

                        {currentUser && profile ?
                            <User user={currentUser} profile={profile}/> :
                            <h1>Loading...</h1>
                        }

                        {ownProfile ?
                            <div className="user-interests">
                                <div className="number">
                                    {selectn('numberOfContentLikes', stats) ? stats.numberOfContentLikes : 0}
                                </div>
                                <div className="label">
                                    Intereses
                                </div>
                            </div>
                            : <div className="otherProfileLikeButton"><Button onClick={this.onRate}>{likeText}</Button></div>
                        }

                        {otherProfileHTML}

                        {profile ?
                            <ProfileDataList profile={profile}/> :
                            <h1>Loading...</h1>
                        }

                    </div>
                </div>

                <ToolBar links={ownProfile ? [
                {'url': `/profile/${selectn('qnoow_id', currentUser)}`, 'text': 'Sobre mí'},
                {'url': '/questions', 'text': 'Respuestas'},
                {'url': '/interests', 'text': 'Intereses'}]
                : [
                {'url': `/profile/${selectn('qnoow_id', currentUser)}`, 'text': `Sobre ${selectn('username', currentUser) ? currentUser.username : ''}`},
                {'url': `/users/${selectn('qnoow_id', currentUser)}/other-questions`, 'text': 'Respuestas'},
                {'url': `/users/${selectn('qnoow_id', currentUser)}/other-interests`, 'text': 'Intereses'}]

                } activeLinkIndex={0}/>
            </div>
        );
    }

    renderList() {
        const { params } = this.props;
        return (
            <div>
                <p>{params.userId}</p>
                <ul>
                    <li>1</li>
                    <li>2</li>
                    <li>3</li>
                </ul>
            </div>
        );
    }
})
