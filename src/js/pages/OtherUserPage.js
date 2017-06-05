import React, { PropTypes, Component } from 'react';
import { ORIGIN_CONTEXT, SHARED_USER_URL } from '../constants/Constants';
import OtherProfileData from '../components/profile/OtherProfileData';
import OtherProfileDataList from '../components/profile/OtherProfileDataList'
import TopNavBar from '../components/ui/TopNavBar';
import ToolBar from '../components/ui/ToolBar';
import Image from '../components/ui/Image';
import EmptyMessage from '../components/ui/EmptyMessage';
import OrientationRequiredPopup from '../components/ui/OrientationRequiredPopup';
import ReportContentPopup from '../components/interests/ReportContentPopup';
import ShareService from '../services/ShareService';
import AuthenticatedComponent from '../components/AuthenticatedComponent';
import translate from '../i18n/Translate';
import connectToStores from '../utils/connectToStores';
import * as UserActionCreators from '../actions/UserActionCreators';
import GalleryPhotoActionCreators from '../actions/GalleryPhotoActionCreators';
import UserStore from '../stores/UserStore';
import ProfileStore from '../stores/ProfileStore';
import ComparedStatsStore from '../stores/ComparedStatsStore';
import MatchingStore from '../stores/MatchingStore';
import SimilarityStore from '../stores/SimilarityStore';
import BlockStore from '../stores/BlockStore';
import LikeStore from '../stores/LikeStore';
import GalleryPhotoStore from '../stores/GalleryPhotoStore';
import ChatUserStatusStore from '../stores/ChatUserStatusStore';
import selectn from 'selectn';

function parseId(user) {
    return user.id;
}

/**
 * Requests data from server for current props.
 */
function requestData(props) {
    const {params, user} = props;
    const otherUserSlug = params.slug;
    setTimeout(() => {
        UserActionCreators.requestUser(otherUserSlug, ['username', 'photo', 'status']).then(
            () => {
                const otherUser = UserStore.getBySlug(params.slug);
                UserActionCreators.requestMetadata();
                if (!ProfileStore.contains(parseId(user))) {
                    UserActionCreators.requestOwnProfile(parseId(user));
                }
                const otherUserId = parseId(otherUser);
                UserActionCreators.requestMatching(parseId(user), otherUserId);
                UserActionCreators.requestSimilarity(parseId(user), otherUserId);
                UserActionCreators.requestLikeUser(parseId(user), otherUserId);
                UserActionCreators.requestBlockUser(parseId(user), otherUserId);
                UserActionCreators.requestComparedStats(parseId(user), otherUserId);
                UserActionCreators.requestProfile(otherUserId);
                UserActionCreators.requestStats(otherUserId);
                GalleryPhotoActionCreators.getOtherPhotos(otherUserId);
            },
            (status) => {
                console.log(status.error)
            }
        );
    }, 0);
}

function initPhotosSwiper() {
    // Init slider if id exists
    if (!document.getElementById('photos-swiper-container')) {
        return null;
    }
    return nekunoApp.swiper('#photos-swiper-container', {
        slidesPerView      : 'auto',
        centeredSlides     : true,
        paginationHide     : false,
        paginationClickable: true,
        pagination         : '.swiper-pagination',
    });
}

/**
 * Retrieves state from stores for current props.
 */
function getState(props) {
    const otherUserSlug = props.params.slug;
    const otherUser = UserStore.getBySlug(otherUserSlug);
    const otherUserId = otherUser ? parseId(otherUser) : null;
    const {user} = props;
    const profile = otherUserId ? ProfileStore.get(otherUserId) : null;
    const profileWithMetadata = otherUserId ? ProfileStore.getWithMetadata(otherUserId) : [];
    const matching = otherUserId ? MatchingStore.get(otherUserId, parseId(user)) : null;
    const similarity = otherUserId ? SimilarityStore.get(otherUserId, parseId(user)) : null;
    const blocked = otherUserId ? BlockStore.get(parseId(user), otherUserId) : null;
    const like = otherUserId ? LikeStore.get(parseId(user), otherUserId) : null;
    const comparedStats = otherUserId ? ComparedStatsStore.get(parseId(user), otherUserId) : null;
    const photos = otherUserId ? GalleryPhotoStore.get(otherUserId) : [];
    const noPhotos = otherUserId ? GalleryPhotoStore.noPhotos(otherUserId) : null;
    const ownProfile = ProfileStore.get(parseId(user));
    const online = otherUserId ? ChatUserStatusStore.isOnline(otherUserId) || false : null;

    return {
        otherUser,
        profile,
        profileWithMetadata,
        matching,
        similarity,
        blocked,
        like,
        comparedStats,
        user,
        photos,
        noPhotos,
        ownProfile,
        online
    };
}

@AuthenticatedComponent
@translate('OtherUserPage')
@connectToStores([UserStore, ProfileStore, MatchingStore, SimilarityStore, BlockStore, LikeStore, ComparedStatsStore, GalleryPhotoStore, ChatUserStatusStore], getState)
export default class OtherUserPage extends Component {
    static propTypes = {
        // Injected by React Router:
        params             : PropTypes.shape({
            slug: PropTypes.string.isRequired
        }).isRequired,
        // Injected by @AuthenticatedComponent
        user               : PropTypes.object,
        // Injected by @translate:
        strings            : PropTypes.object,
        // Injected by @connectToStores:
        otherUser          : PropTypes.object,
        profile            : PropTypes.object,
        profileWithMetadata: PropTypes.array,
        matching           : PropTypes.number,
        similarity         : PropTypes.number,
        //block              : PropTypes.bool,
        like               : PropTypes.number,
        comparedStats      : PropTypes.object,
        photos             : PropTypes.array,
        noPhotos           : PropTypes.bool,
        ownProfile         : PropTypes.object,
        online             : PropTypes.bool
    };
    static contextTypes = {
        router: PropTypes.object.isRequired
    };

    constructor(props) {
        super(props);

        this.onRate = this.onRate.bind(this);
        this.onBlock = this.onBlock.bind(this);
        this.handleClickMessageLink = this.handleClickMessageLink.bind(this);
        this.handlePhotoClick = this.handlePhotoClick.bind(this);
        this.goToDiscover = this.goToDiscover.bind(this);
        this.setOrientationRequired = this.setOrientationRequired.bind(this);
        this.showBlockActions = this.showBlockActions.bind(this);
        this.showUnblockActions = this.showUnblockActions.bind(this);
        this.reportReasonButton = this.reportReasonButton.bind(this);
        this.onReportReason = this.onReportReason.bind(this);
        this.onReportReasonOther = this.onReportReasonOther.bind(this);
        this.optionButton = this.optionButton.bind(this);
        this.cancelButton = this.optionButton.bind(this);
        this.onShareError = this.onShareError.bind(this);

        this.state = {
            orientationRequired: null,
            photosLoaded       : null
        };
    }

    componentWillMount() {
        requestData(this.props);
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.params.slug !== this.props.params.slug) {
            requestData(nextProps);
        }
    }

    componentDidUpdate(prevProps) {
        if (this.state.orientationRequired && !this.props.ownProfile.orientation) {
            nekunoApp.popup('.popup-orientation-required');
        } else if (this.state.orientationRequired === null && this.props.ownProfile && this.props.ownProfile.orientationRequired) {
            this.setOrientationRequired(true);
        }
        if (this.props.photos.length > 0 && !this.state.photosLoaded) {
            if (initPhotosSwiper()) {
                this.setState({photosLoaded: true});
            }
        }
    }

    /** Block-Related */

    onBlock() {
        if (!this.props.blocked) {
            this.showBlockActions();
        } else {
            this.showUnblockActions();
        }
    }

    showBlockActions() {
        const {otherUser, strings} = this.props;
        const reportButtons = [
            this.optionTitle(otherUser.username),
            this.optionButton(strings.share, this.shareUser.bind(this, this.props)),
            this.optionButton(strings.block, this.blockUser.bind(this, this.props)),
            this.optionButton(strings.blockAndReport, this.showReportActions.bind(this, this.props)),
            this.cancelButton(strings.cancel)
        ];

        nekunoApp.actions(reportButtons);
    }

    shareUser() {
        const {otherUser, params, strings} = this.props;
        const url = SHARED_USER_URL.replace('{slug}', params.slug);
        ShareService.share(
            strings.compatibilityCheckWith.replace('%username%', otherUser.username),
            url,
            this.onShareSuccess,
            this.onShareError,
            strings.copiedToClipboard
        );
    }

    onShareSuccess() {
    }

    onShareError() {
        nekunoApp.alert(this.props.strings.shareError)
    }

    showUnblockActions() {
        const {otherUser, strings} = this.props;
        const buttons = [
            this.optionTitle(otherUser.username),
            this.optionButton(strings.unblock, this.unsetBlockUser.bind(this, this.props)),
            this.cancelButton(strings.cancel)
        ];

        nekunoApp.actions(buttons);
    }

    optionTitle(title) {
        return {
            text : title,
            label: true
        }
    }

    optionButton(text, callback) {
        return {
            color  : 'gray',
            text   : text,
            onClick: callback
        }
    }

    showReportActions(props) {
        const {otherUser, strings} = props;

        const reportButtons = [
            this.optionTitle(otherUser.username),
            this.reportReasonButton(strings.notAPerson, 'not a person'),
            this.reportReasonButton(strings.harmful, 'harmful'),
            this.reportReasonButton(strings.spam, 'spam'),
            this.reportReasonButton(strings.otherReasons, 'other', this.showOtherReasonPopup),
            this.cancelButton(strings.cancel)
        ];
        nekunoApp.actions(reportButtons);
    }

    reportReasonButton(text, reason, callback = null) {
        callback = callback ? callback : this.onReportReason.bind(this, reason, null);

        return this.optionButton(text, callback);
    }

    showOtherReasonPopup() {
        nekunoApp.popup('.popup-report-content');
    }

    cancelButton(text) {
        return {
            color: 'red',
            text : text
        }
    }

    onReportReasonOther(reasonText) {
        return this.onReportReason('other', reasonText);
    }

    onReportReason(reason, reasonText = null) {
        const {user, otherUser} = this.props;
        const data = {
            reason    : reason,
            reasonText: reasonText
        };
        UserActionCreators.reportUser(parseId(user), parseId(otherUser), data);
    }

    blockUser(props) {
        const {user, otherUser} = props;
        UserActionCreators.blockUser(parseId(user), parseId(otherUser));
    }

    unsetBlockUser(props) {
        const {user, otherUser} = props;
        UserActionCreators.deleteBlockUser(parseId(user), parseId(otherUser));
    }

    /** Like-related **/

    onRate() {
        if (!this.props.like || this.props.like === -1) {
            this.setLikeUser(this.props);
        } else {
            this.unsetLikeUser(this.props);
        }
    }

    setLikeUser(props) {
        const {user, otherUser} = props;
        UserActionCreators.likeUser(parseId(user), parseId(otherUser), ORIGIN_CONTEXT.OTHER_USER_PAGE, otherUser.username);
    }

    unsetLikeUser(props) {
        const {user, otherUser} = props;
        UserActionCreators.deleteLikeUser(parseId(user), parseId(otherUser));
    }

    handleClickMessageLink() {
        this.context.router.push(`/conversations/${this.props.params.slug}`);
    }

    handlePhotoClick(url) {
        const {photos, otherUser, params} = this.props;
        const selectedPhoto = photos.find(photo => photo.url === url) || otherUser.photo;
        const selectedPhotoId = selectedPhoto.id || 'profile';
        this.context.router.push(`/users/${params.slug}/other-gallery/${selectedPhotoId}`);
    }

    goToDiscover() {
        this.context.router.push(`discover`);
    }

    setOrientationRequired(bool) {
        this.setState({orientationRequired: bool});
    }

    render() {
        const {user, otherUser, profile, ownProfile, profileWithMetadata, matching, similarity, blocked, like, comparedStats, photos, noPhotos, online, params, strings} = this.props;
        const otherPictureSmall = selectn('photo.thumbnail.small', otherUser);
        const otherPictureBig = selectn('photo.thumbnail.big', otherUser);
        const ownPicture = selectn('photo.thumbnail.small', user);
        const defaultImgBig = 'img/no-img/big.jpg';
        const birthdayDataSet = profileWithMetadata.find(profileDataSet => typeof selectn('fields.birthday.value', profileDataSet) !== 'undefined');
        const genderDataSet = profileWithMetadata.find(profileDataSet => typeof selectn('fields.gender.value', profileDataSet) !== 'undefined');
        const age = selectn('fields.birthday.value', birthdayDataSet);
        const gender = selectn('fields.gender.value', genderDataSet);
        const location = selectn('location.locality', profile) || selectn('location.country', profile);
        const canLookOtherProfiles = !(ownProfile && ownProfile.orientationRequired && !ownProfile.orientation);
        const enoughData = otherUser && profile && profileWithMetadata && ownProfile;

        return (
            <div className="views">
                <TopNavBar leftIcon={'left-arrow'} transparentBackground={true}/>
                {enoughData ?
                    <ToolBar links={[
                        {'url': `/p/${params.slug}`, 'text': strings.about},
                        {'url': `/users/${params.slug}/other-questions`, 'text': strings.questions},
                        {'url': `/users/${params.slug}/other-interests`, 'text': strings.interests}]} activeLinkIndex={0} arrowUpLeft={'13%'}/>
                    : null}
                <div className="view view-main">
                    <div className="page other-user-page">
                        {enoughData && canLookOtherProfiles ?
                            <div id="page-content">
                                <div className="user-images">
                                    <div className="swiper-pagination"></div>
                                    <div className="user-images-wrapper">
                                        <div className="swiper-custom">
                                            <div id={"photos-swiper-container"} className="swiper-container">
                                                <div className="swiper-wrapper">
                                                    <div className="swiper-slide" key={0} onClick={this.handlePhotoClick.bind(this, otherUser.photo.url)}>
                                                        <Image src={otherPictureBig} defaultSrc={defaultImgBig}/>
                                                    </div>
                                                    {photos && photos.length > 0 ? photos.map((photo, index) =>
                                                            <div className="swiper-slide" key={index + 1} onClick={this.handlePhotoClick.bind(this, photo.url)}>
                                                                <Image src={photo.thumbnail.big} defaultSrc={defaultImgBig}/>
                                                            </div>
                                                        ) : null}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="other-user-main-data">
                                    <div className="username-title">
                                        {otherUser.username}
                                    </div>
                                    <div className="user-description">
                                        <span className="icon-marker"/> {location} -
                                        <span className="age"> {strings.age}: {age}</span> -
                                        <span className="gender"> {gender}</span>
                                    </div>
                                    {online ? <div className="online-status">Online</div> : null}
                                    <div className="send-message-button icon-wrapper icon-wrapper-with-text" onClick={this.handleClickMessageLink}>
                                        <span className="icon-message"/>
                                        <span className="text">{strings.message}</span>
                                    </div>
                                    <div className="like-button icon-wrapper" onClick={like !== null ? this.onRate : null}>
                                        <span className={like === null ? 'icon-spinner rotation-animation' : like && like !== -1 ? 'icon-star yellow' : 'icon-star'}/>
                                    </div>
                                    <div className="block-button icon-wrapper" onClick={blocked !== null ? this.onBlock : null}>
                                        <span className="icon-fa-plus"/>
                                    </div>
                                    <div className="other-profile-wrapper bold">
                                        <OtherProfileData matching={matching} similarity={similarity} stats={comparedStats} ownImage={ownPicture}
                                                          currentImage={otherPictureSmall}
                                                          interestsUrl={`/users/${params.slug}/other-interests`}
                                                          questionsUrl={`/users/${params.slug}/other-questions`}
                                                          userId={user.id}
                                                          otherUserId={otherUser.id}
                                        />
                                    </div>
                                </div>
                                <OtherProfileDataList profileWithMetadata={profileWithMetadata}/>
                                <br />
                                <br />
                                <br />
                                <br />
                                <br />
                                <br />
                            </div>
                            : <EmptyMessage text={strings.loading} loadingGif={true}/>}
                    </div>
                    {ownProfile ? <OrientationRequiredPopup profile={ownProfile} onCancel={this.goToDiscover} onClick={this.setOrientationRequired.bind(this, false)}/> : null}
                </div>
                <ReportContentPopup onClick={this.onReportReasonOther}/>
            </div>
        );
    }
};

OtherUserPage.defaultProps = {
    strings: {
        profile               : 'Profile',
        loading               : 'Loading profile',
        age                   : 'Age',
        message               : 'Message',
        about                 : 'About',
        photos                : 'Photos',
        questions             : 'Answers',
        interests             : 'Interests',
        like                  : 'Like',
        dontLike              : 'Don\'t like anymore',
        saving                : 'Saving...',
        share                 : 'Share this profile',
        shareError            : 'An error occurred sending the link.',
        compatibilityCheckWith: 'Check your compatibility with %username%',
        copiedToClipboard     : 'Copied to clipboard',
        block                 : 'Block user',
        unblock               : 'Unblock user',
        blockAndReport        : 'Block and report user',
        cancel                : 'Cancel',
        confirmBlock          : 'Are you sure you want to block this user?',
        notAPerson            : 'This user is not a person',
        harmful               : 'This user is abusive or harmful',
        spam                  : 'This user sends spam',
        otherReasons          : 'Other reasons'
    }
};