import React, { PropTypes, Component } from 'react';
import selectn from 'selectn';
import { IMAGES_ROOT } from '../constants/Constants';
import * as UserActionCreators from '../actions/UserActionCreators';
import UserStore from '../stores/UserStore';
import ProfileStore from '../stores/ProfileStore';
import StatsStore from '../stores/StatsStore';
import ComparedStatsStore from '../stores/ComparedStatsStore';
import MatchingStore from '../stores/MatchingStore';
import SimilarityStore from '../stores/SimilarityStore';
import BlockStore from '../stores/BlockStore';
import LikeStore from '../stores/LikeStore';
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
        if (!MatchingStore.contains(currentUserId, user.qnoow_id)){
            UserActionCreators.requestMatching(parseInt(currentUserId), user.qnoow_id);
        }
        if (!SimilarityStore.contains(currentUserId, user.qnoow_id)){
            UserActionCreators.requestSimilarity(currentUserId, user.qnoow_id);
        }
        if (!LikeStore.contains(user.qnoow_id, currentUserId)){
            UserActionCreators.requestLikeUser(user.qnoow_id, currentUserId);
        }
        if (!BlockStore.contains(user.qnoow_id, currentUserId)){
            UserActionCreators.requestBlockUser(user.qnoow_id, currentUserId);
        }
        if (!ComparedStatsStore.contains(user.qnoow_id, currentUserId)){
            UserActionCreators.requestComparedStats(user.qnoow_id, currentUserId);
        }

    }

    UserActionCreators.requestUser(currentUserId, ['username', 'email', 'picture', 'status']);
    UserActionCreators.requestProfile(currentUserId);
    UserActionCreators.requestMetadata();
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

    let matching = 0;
    let similarity = 0;
    let like = 0;
    let block = 0;
    let comparedStats = {};
    let stats = {};
    if (!(userLoggedIn && user && (user.qnoow_id == currentUserId))) {

        matching = MatchingStore.get(currentUserId, user.qnoow_id);
        similarity = SimilarityStore.get(currentUserId, user.qnoow_id);
        block = BlockStore.get(user.qnoow_id, currentUserId);
        like = LikeStore.get(user.qnoow_id, currentUserId);
        comparedStats = ComparedStatsStore.get(user.qnoow_id, currentUserId);
    } else {
        stats = StatsStore.get(currentUserId);
    }

    return {
        currentUser,
        profile,
        stats,
        matching,
        similarity,
        block,
        like,
        comparedStats,
        userLoggedIn,
        user
    };
}

function setBlockUser(props) {
    const { user, currentUser } = props;

    UserActionCreators.blockUser(user.qnoow_id, currentUser.qnoow_id);
}

function unsetBlockUser(props) {
    const { user, currentUser } = props;

    UserActionCreators.deleteBlockUser(user.qnoow_id, currentUser.qnoow_id);
}

function setLikeUser(props) {
    const { user, currentUser } = props;

    UserActionCreators.likeUser(user.qnoow_id, currentUser.qnoow_id);
}

function unsetLikeUser(props) {
    const { user, currentUser } = props;

    UserActionCreators.deleteLikeUser(user.qnoow_id, currentUser.qnoow_id);
}

@connectToStores([UserStore, ProfileStore, StatsStore, MatchingStore, SimilarityStore, BlockStore, LikeStore, ComparedStatsStore], getState)
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
        this.onBlock = this.onBlock.bind(this);
    }

    componentWillMount() {
        requestData(this.props);
    }

    componentWillReceiveProps(nextProps) {
        if (parseId(nextProps.params) !== parseId(this.props.params)) {
            requestData(nextProps);
        }
    }

    onBlock() {
        if (!this.props.block){
            setBlockUser(this.props);
        } else {
            unsetBlockUser(this.props);
        }
    }

    onRate() {
        if (!this.props.like){
            setLikeUser(this.props);
        } else {
            unsetLikeUser(this.props);
        }
    }


    render() {
        const { userLoggedIn, user, currentUser, profile, stats, matching, similarity, block, like, comparedStats } = this.props;
        const currentUserId = currentUser ? currentUser.qnoow_id : null;
        const currentPicture = currentUser && currentUser.picture ? `${IMAGES_ROOT}media/cache/resolve/user_avatar_60x60/user/images/${currentUser.picture}` : `${IMAGES_ROOT}media/cache/user_avatar_60x60/bundles/qnoowweb/images/user-no-img.jpg`;
        const ownPicture = user && user.picture ? `${IMAGES_ROOT}media/cache/resolve/user_avatar_60x60/user/images/${user.picture}` : `${IMAGES_ROOT}media/cache/user_avatar_60x60/bundles/qnoowweb/images/user-no-img.jpg`;
        const likeText = like ? "Ya no me gusta" : "Me gusta";
        const blockClass = block? "icon-block blocked" : "icon-block";

        let ownProfile=false;
        if (userLoggedIn && user && (user.qnoow_id == currentUserId)){
            ownProfile = true;
        }

        return (
            <div className="view view-main">
                <div className="page toolbar-fixed user-page">
                    <LeftMenuTopNavbar centerText={currentUser && !ownProfile ? currentUser.username : 'Mi Perfil'} />

                    <div id="page-content">

                        {currentUser && profile ?
                            <User user={currentUser} profile={profile}/> :
                            ''
                        }

                        {currentUser && profile && ownProfile ?
                            <div className="user-interests">
                                <div className="number">
                                    {selectn('numberOfContentLikes', stats) ? stats.numberOfContentLikes : 0}
                                </div>
                                <div className="label">
                                    Intereses
                                </div>
                            </div>
                            : ''
                        }

                        {currentUser && profile && !ownProfile ?
                            <div>
                                <div className = "other-profile-buttons">
                                    <div className="other-profile-like-button">
                                        <Button onClick={this.onRate}>{likeText}</Button>
                                    </div>
                                    <div className = "other-profile-block-button">
                                        <Button onClick = {this.onBlock}><span className={blockClass}></span></Button>
                                    </div>
                                </div>
                                <div className="other-profile-wrapper bold" >
                                    <OtherProfileData matching={matching} similarity={similarity} stats={comparedStats} ownImage={ownPicture} currentImage={currentPicture} />
                                </div>
                            </div>
                            : ''
                        }


                        {currentUser && profile ?
                            <ProfileDataList profile={profile}/> :
                            ''
                        }
                        <br />
                        <br />
                        <br />
                        <br />
                        <br />
                        <br />
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
})
