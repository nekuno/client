import React, { PropTypes, Component } from 'react';
import { IMAGES_ROOT } from '../constants/Constants';
import User from '../components/User';
import OtherProfileData from '../components/profile/OtherProfileData';
import ProfileDataList from '../components/profile/ProfileDataList'
import TopNavBar from '../components/ui/TopNavBar';
import ToolBar from '../components/ui/ToolBar';
import Button from '../components/ui/Button';
import AuthenticatedComponent from '../components/AuthenticatedComponent';
import translate from '../i18n/Translate';
import connectToStores from '../utils/connectToStores';
import * as UserActionCreators from '../actions/UserActionCreators';
import UserStore from '../stores/UserStore';
import ProfileStore from '../stores/ProfileStore';
import ComparedStatsStore from '../stores/ComparedStatsStore';
import MatchingStore from '../stores/MatchingStore';
import SimilarityStore from '../stores/SimilarityStore';
import BlockStore from '../stores/BlockStore';
import LikeStore from '../stores/LikeStore';

function parseId(user) {
    return user.id;
}

/**
 * Requests data from server for current props.
 */
function requestData(props) {
    const {params, user} = props;
    const otherUserId = params.userId;

    if (!MatchingStore.contains(parseId(user), otherUserId)) {
        UserActionCreators.requestMatching(parseId(user), otherUserId);
    }
    if (!SimilarityStore.contains(parseId(user), otherUserId)) {
        UserActionCreators.requestSimilarity(parseId(user), otherUserId);
    }
    if (!LikeStore.contains(parseId(user), otherUserId)) {
        UserActionCreators.requestLikeUser(parseId(user), otherUserId);
    }
    if (!BlockStore.contains(parseId(user), otherUserId)) {
        UserActionCreators.requestBlockUser(parseId(user), otherUserId);
    }
    if (!ComparedStatsStore.contains(parseId(user), otherUserId)) {
        UserActionCreators.requestComparedStats(parseId(user), otherUserId);
    }

    UserActionCreators.requestUser(otherUserId, ['username', 'email', 'picture', 'status']);
    UserActionCreators.requestProfile(otherUserId);
    UserActionCreators.requestMetadata();
    UserActionCreators.requestStats(otherUserId);
}

/**
 * Retrieves state from stores for current props.
 */
function getState(props) {
    const otherUserId = props.params.userId;
    const {user} = props;
    const otherUser = UserStore.get(otherUserId);
    const profile = ProfileStore.get(otherUserId);
    const profileWithMetadata = ProfileStore.getWithMetadata(otherUserId);
    const matching = MatchingStore.get(otherUserId, parseId(user));
    const similarity = SimilarityStore.get(otherUserId, parseId(user));
    const block = BlockStore.get(parseId(user), otherUserId);
    const like = LikeStore.get(parseId(user), otherUserId);
    const comparedStats = ComparedStatsStore.get(parseId(user), otherUserId);

    return {
        otherUser,
        profile,
        profileWithMetadata,
        matching,
        similarity,
        block,
        like,
        comparedStats,
        user
    };
}

function setBlockUser(props) {
    const {user, otherUser} = props;
    nekunoApp.confirm(props.strings.confirmBlock, () => {
        UserActionCreators.blockUser(parseId(user), parseId(otherUser));
    });
}

function unsetBlockUser(props) {
    const {user, otherUser} = props;
    UserActionCreators.deleteBlockUser(parseId(user), parseId(otherUser));
}

function setLikeUser(props) {
    const {user, otherUser} = props;
    UserActionCreators.likeUser(parseId(user), parseId(otherUser));
}

function unsetLikeUser(props) {
    const {user, otherUser} = props;
    UserActionCreators.deleteLikeUser(parseId(user), parseId(otherUser));
}

@AuthenticatedComponent
@translate('OtherUserPage')
@connectToStores([UserStore, ProfileStore, MatchingStore, SimilarityStore, BlockStore, LikeStore, ComparedStatsStore], getState)
export default class OtherUserPage extends Component {
    static propTypes = {
        // Injected by React Router:
        params             : PropTypes.shape({
            userId: PropTypes.string.isRequired
        }).isRequired,
        // Injected by @AuthenticatedComponent
        user               : PropTypes.object,
        // Injected by @translate:
        strings            : PropTypes.object,
        // Injected by @connectToStores:
        otherUser          : PropTypes.object,
        profile            : PropTypes.object,
        profileWithMetadata: PropTypes.object,
        matching           : PropTypes.number,
        similarity         : PropTypes.number,
        block              : PropTypes.bool,
        like               : PropTypes.bool,
        comparedStats      : PropTypes.object
    };
    static contextTypes = {
        history: PropTypes.object.isRequired
    };

    constructor(props) {
        super(props);

        this.onRate = this.onRate.bind(this);
        this.onBlock = this.onBlock.bind(this);
        this.handleClickMessageLink = this.handleClickMessageLink.bind(this);
    }

    componentWillMount() {
        requestData(this.props);
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.params.userId !== this.props.params.userId) {
            requestData(nextProps);
        }
    }

    onBlock() {
        if (!this.props.block) {
            setBlockUser(this.props);
        } else {
            unsetBlockUser(this.props);
        }
    }

    onRate() {
        if (!this.props.like) {
            setLikeUser(this.props);
        } else {
            unsetLikeUser(this.props);
        }
    }

    handleClickMessageLink() {
        this.context.history.pushState(null, `/conversations/${this.props.params.userId}`)
    }

    render() {
        const {user, otherUser, profile, profileWithMetadata, matching, similarity, block, like, comparedStats, strings} = this.props;
        const otherPicture = otherUser && otherUser.picture ? `${IMAGES_ROOT}media/cache/resolve/user_avatar_60x60/user/images/${otherUser.picture}` : `${IMAGES_ROOT}media/cache/user_avatar_60x60/bundles/qnoowweb/images/user-no-img.jpg`;
        const ownPicture = user && user.picture ? `${IMAGES_ROOT}media/cache/resolve/user_avatar_60x60/user/images/${user.picture}` : `${IMAGES_ROOT}media/cache/user_avatar_60x60/bundles/qnoowweb/images/user-no-img.jpg`;
        const likeText = like ? strings.dontLike : strings.like;
        const blockClass = block ? "icon-block blocked" : "icon-block";
        return (
            <div className="view view-main">
                <TopNavBar leftMenuIcon={true} centerText={otherUser ? otherUser.username : ''} rightIcon={'message'} onRightLinkClickHandler={this.handleClickMessageLink}/>
                <div className="page user-page">
                    {otherUser && profile ?
                        <div id="page-content">
                            <User user={otherUser} profile={profile}/>
                            <div>
                                <div className="other-profile-buttons">
                                    <div className="other-profile-like-button">
                                        <Button onClick={this.onRate}>{likeText}</Button>
                                    </div>
                                    <div className="other-profile-block-button">
                                        <Button onClick={this.onBlock}><span className={blockClass}></span></Button>
                                    </div>
                                </div>
                                <div className="other-profile-wrapper bold">
                                    <OtherProfileData matching={matching} similarity={similarity} stats={comparedStats} ownImage={ownPicture} currentImage={otherPicture}/>
                                </div>
                            </div>
                            <ProfileDataList profile={profileWithMetadata}/>
                            <br />
                            <br />
                            <br />
                            <br />
                            <br />
                            <br />
                        </div>
                        : ''}
                </div>
                {otherUser && profileWithMetadata ?
                    <ToolBar links={[
                    {'url': `/profile/${parseId(otherUser)}`, 'text': strings.about},
                    {'url': `/users/${parseId(otherUser)}/other-gallery`, 'text': strings.photos},
                    {'url': `/users/${parseId(otherUser)}/other-questions`, 'text': strings.questions},
                    {'url': `/users/${parseId(otherUser)}/other-interests`, 'text': strings.interests}]} activeLinkIndex={0} arrowUpLeft={'10%'}/>
                    : ''}
            </div>
        );
    }
};

OtherUserPage.defaultProps = {
    strings: {
        about       : 'About',
        photos      : 'Photos',
        questions   : 'Answers',
        interests   : 'Interests',
        like        : 'Like',
        dontLike    : 'Don\'t like anymore',
        confirmBlock: 'Are you sure you want to block this user?'
    }
};