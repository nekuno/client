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
import Button from '../components/ui/Button';
import connectToStores from '../utils/connectToStores';
import AuthenticatedComponent from '../components/AuthenticatedComponent';

function parseId(params) {
    return params.login;
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
    const profile = ProfileStore.get(currentUserId);
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

/*@connectToStores([ThreadStore, RecommendationStore, RecommendationsByThreadStore], getState)
export default AuthenticatedComponent(class RecommendationPage extends Component {*/

@connectToStores([UserStore, ProfileStore, StatsStore, MatchingStore, SimilarityStore], getState)
export default AuthenticatedComponent(class UserPage extends Component {
    static propTypes = {
        // Injected by React Router:
        params: PropTypes.shape({
            login: PropTypes.string.isRequired
        }).isRequired,

        // Injected by @connectToStores:
        //currentUser: PropTypes.object,
        profile: PropTypes.object,
        stats: PropTypes.object,
        matching: PropTypes.number,

        // Injected by AuthenticatedComponent
        user: PropTypes.object
    };

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
            this.setLikeUser();
        } else {
            this.unsetLikeUser();
        }
    }

    /**
     * Set rate like.
     */
    setLikeUser() {
        const { user, currentUser } = this.props;

        UserActionCreators.likeUser(user.qnoow_id, currentUser.qnoow_id);
        this.rate = true;
    }

    /**
     * Unset rate like.
     */
    unsetLikeUser() {
        const { user, currentUser } = this.props;

        UserActionCreators.deleteLikeUser(user.qnoow_id, currentUser.qnoow_id);
        this.rate = false;
    }

    render() {
        const { userLoggedIn, user, currentUser, profile, stats, matching, similarity } = this.props;
        const currentUserId = currentUser? currentUser.qnoow_id : null;
        const currentPicture = currentUser? currentUser.picture : null;

        let ownProfile=false;
        if (userLoggedIn && user && (user.qnoow_id == currentUserId)){
            ownProfile = true;
        }
        let otherProfileHTML = '';

        if (!ownProfile) {
            const ownPicture = user && user.picture ? user.picture : `${IMAGES_ROOT}/media/cache/user_avatar_180x180/bundles/qnoowweb/images/user-no-img.jpg`;
            otherProfileHTML = <OtherProfileData matching = {matching} similarity = {similarity} stats = {stats} ownImage = {ownPicture} currentImage = {currentPicture} />
        }

        const _this = this;
        return (
            <div className="view view-main">
                <LeftMenuTopNavbar centerText={'Mi Perfil'} />
                <div data-page="index" className="page">
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
                            : <div className="otherProfileLikeButton"><Button onClick={function(){_this.onRate()}}>Me gusta</Button></div>
                        }

                        {otherProfileHTML}

                        {profile ?
                            <ProfileDataList profile={profile}/> :
                            <h1>Loading...</h1>
                        }
                    </div>
                </div>
            </div>
        );
    }

    renderList() {
        const { params } = this.props;
        return (
            <div>
                <p>{params.login}</p>
                <ul>
                    <li>1</li>
                    <li>2</li>
                    <li>3</li>
                </ul>
            </div>
        );
    }
})
