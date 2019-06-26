import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { ORIGIN_CONTEXT, SHARED_USER_URL } from '../constants/Constants';
import OtherProfileData from '../components/profile/OtherProfileData';
import TopNavBar from '../components/ui/TopNavBar';
import ToolBar from '../components/ui/ToolBar';
import Image from '../components/ui/Image';
import EmptyMessage from '../components/ui/EmptyMessage';
import OrientationRequiredPopup from '../components/ui/OrientationRequiredPopup';
import ReportContentPopup from '../components/interests/ReportContentPopup';
import ShareService from '../services/ShareService';
import Framework7Service from '../services/Framework7Service';
import AuthenticatedComponent from '../components/AuthenticatedComponent';
import translate from '../i18n/Translate';
import popup from '../components/Popup';
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
import AboutMeCategory from "../components/profile/AboutMeCategory/AboutMeCategory";
import NaturalCategory from "../components/profile/NaturalCategory/NaturalCategory";

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
        UserActionCreators.requestMetadata();
        if (user.slug && !ProfileStore.contains(user.slug)) {
            UserActionCreators.requestOwnProfile(user.slug);
        }
        UserActionCreators.requestProfile(otherUserSlug);
        UserActionCreators.requestLikeUser(user.slug, otherUserSlug);
        UserActionCreators.requestBlockUser(user.slug, otherUserSlug);
        UserActionCreators.requestUser(otherUserSlug, ['username', 'photo', 'status']).then(
            () => {
                const otherUser = UserStore.getBySlug(params.slug);
                const otherUserId = parseId(otherUser);
                UserActionCreators.requestMatching(parseId(user), otherUserId);
                UserActionCreators.requestSimilarity(parseId(user), otherUserId);
                UserActionCreators.requestComparedStats(parseId(user), otherUserId);
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
    return Framework7Service.nekunoApp().swiper('#photos-swiper-container', {
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
    const profile = ProfileStore.get(otherUserSlug);
    const profileWithMetadata = ProfileStore.getWithMetadata(otherUserSlug);
    const metadata = ProfileStore.getMetadata();
    const matching = otherUserId ? MatchingStore.get(otherUserId, parseId(user)) : null;
    const similarity = otherUserId ? SimilarityStore.get(otherUserId, parseId(user)) : null;
    const blocked = BlockStore.get(user.slug, otherUserSlug);
    const like = LikeStore.get(user.slug, otherUserSlug);
    const comparedStats = otherUserId ? ComparedStatsStore.get(parseId(user), otherUserId) : null;
    const photos = otherUserId ? GalleryPhotoStore.get(otherUserId) : [];
    const noPhotos = otherUserId ? GalleryPhotoStore.noPhotos(otherUserId) : null;
    const ownProfile = ProfileStore.get(user.slug);
    const online = otherUserId ? ChatUserStatusStore.isOnline(otherUserId) || false : null;
    const orientationMustBeAsked = ProfileStore.orientationMustBeAsked();

    return {
        otherUser,
        profile,
        profileWithMetadata,
        metadata,
        matching,
        similarity,
        blocked,
        like,
        comparedStats,
        user,
        photos,
        noPhotos,
        ownProfile,
        online,
        orientationMustBeAsked
    };
}

@AuthenticatedComponent
@translate('OtherUserPage')
@popup('popup-report-content')
@connectToStores([UserStore, ProfileStore, MatchingStore, SimilarityStore, BlockStore, LikeStore, ComparedStatsStore, GalleryPhotoStore, ChatUserStatusStore], getState)
export default class OtherUserPage extends Component {
    static propTypes = {
        // Injected by React Router:
        params                : PropTypes.shape({
            slug: PropTypes.string.isRequired
        }).isRequired,
        // Injected by @AuthenticatedComponent
        user                  : PropTypes.object,
        // Injected by @translate:
        strings               : PropTypes.object,
        // Injected by @connectToStores:
        otherUser             : PropTypes.object,
        profile               : PropTypes.object,
        profileWithMetadata   : PropTypes.array,
        metadata              : PropTypes.object,
        matching              : PropTypes.number,
        similarity            : PropTypes.number,
        //block               : PropTypes.bool,
        like                  : PropTypes.number,
        comparedStats         : PropTypes.object,
        photos                : PropTypes.array,
        noPhotos              : PropTypes.bool,
        ownProfile            : PropTypes.object,
        online                : PropTypes.bool,
        orientationMustBeAsked: PropTypes.bool,
        // Injected by @popup:
        showPopup             : PropTypes.func,
        closePopup            : PropTypes.func,
        popupContentRef       : PropTypes.func,
    };
    static contextTypes = {
        router: PropTypes.object.isRequired
    };

    constructor(props) {
        super(props);

        this.getNatural = this.getNatural.bind(this);
        this.onRate = this.onRate.bind(this);
        this.onBlock = this.onBlock.bind(this);
        this.handleClickMessageLink = this.handleClickMessageLink.bind(this);
        this.handlePhotoClick = this.handlePhotoClick.bind(this);
        this.goToDiscover = this.goToDiscover.bind(this);
        this.setOrientationRequired = this.setOrientationRequired.bind(this);
        this.showBlockActions = this.showBlockActions.bind(this);
        this.showUnlockActions = this.showUnlockActions.bind(this);
        this.reportReasonButton = this.reportReasonButton.bind(this);
        this.onReportReason = this.onReportReason.bind(this);
        this.onReportReasonOther = this.onReportReasonOther.bind(this);
        this.showOtherReasonPopup = this.showOtherReasonPopup.bind(this);
        this.optionButton = this.optionButton.bind(this);
        this.cancelButton = this.optionButton.bind(this);
        this.onShareError = this.onShareError.bind(this);
        this.requestOtherUserPhoto = this.requestOtherUserPhoto.bind(this);

        this.state = {
            orientationRequired      : null,
            orientationPopUpDisplayed: false,
            photosLoaded             : null
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
        if (this.state.orientationRequired && !this.state.orientationPopUpDisplayed && this.props.orientationMustBeAsked) {
            Framework7Service.nekunoApp().popup('.popup-orientation-required');
            this.setState({orientationPopUpDisplayed: true});
        } else if (this.state.orientationRequired === null && this.props.orientationMustBeAsked) {
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
            this.showUnlockActions();
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

        Framework7Service.nekunoApp().actions(reportButtons);
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
        Framework7Service.nekunoApp().alert(this.props.strings.shareError)
    }

    showUnlockActions() {
        const {otherUser, strings} = this.props;
        const buttons = [
            this.optionTitle(otherUser.username),
            this.optionButton(strings.unlock, this.unsetBlockUser.bind(this, this.props)),
            this.cancelButton(strings.cancel)
        ];

        Framework7Service.nekunoApp().actions(buttons);
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
        Framework7Service.nekunoApp().actions(reportButtons);
    }

    reportReasonButton(text, reason, callback = null) {
        callback = callback ? callback : this.onReportReason.bind(this, reason, null);

        return this.optionButton(text, callback);
    }

    showOtherReasonPopup() {
        this.props.showPopup()
    }

    cancelButton(text) {
        return {
            color: 'red',
            text : text
        }
    }

    onReportReasonOther(reasonText) {
        this.props.closePopup();
        return this.onReportReason('other', reasonText);
    }

    onReportReason(reason, reasonText = null) {
        const {user, otherUser} = this.props;
        const data = {
            reason    : reason,
            reasonText: reasonText
        };
        UserActionCreators.reportUser(user.slug, otherUser.slug, data);
    }

    blockUser(props) {
        const {user, otherUser} = props;
        UserActionCreators.blockUser(user.slug, otherUser.slug);
    }

    unsetBlockUser(props) {
        const {user, otherUser} = props;
        UserActionCreators.deleteBlockUser(user.slug, otherUser.slug);
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
        UserActionCreators.likeUser(user.slug, otherUser.slug, ORIGIN_CONTEXT.OTHER_USER_PAGE, otherUser.username);
    }

    unsetLikeUser(props) {
        const {user, otherUser} = props;
        UserActionCreators.deleteLikeUser(user.slug, otherUser.slug);
    }

    handleClickMessageLink() {
        this.context.router.push(`/conversations/${this.props.params.slug}`);
    }

    handlePhotoClick(photo) {
        const {params} = this.props;
        this.context.router.push(`/users/${params.slug}/other-gallery/${photo.id}`);
    }

    goToDiscover() {
        this.context.router.push(`discover`);
    }

    setOrientationRequired(bool) {
        this.setState({orientationRequired: bool});
    }

    requestOtherUserPhoto() {
        UserActionCreators.requestUser(this.props.params.slug, ['photo', 'force']);
    }

    getNatural() {
        const {profile} = this.props;
        const natural = profile.naturalProfile;

        const categories = Object.keys(natural).map((type) => {
            const text = natural[type];
            return <div key={type}>
                {
                    type === 'About Me' ?
                        <AboutMeCategory text={text}/>
                        :
                        <NaturalCategory category={type} text={text}/>
                }
            </div>

        });

        return categories;
    }

    render() {
        const {user, otherUser, profile, ownProfile, profileWithMetadata, metadata, matching, similarity, blocked, like, comparedStats, photos, noPhotos, online, orientationMustBeAsked, params, strings} = this.props;
        const otherPictureSmall = selectn('photo.thumbnail.small', otherUser);
        const otherPictureBig = selectn('photo.thumbnail.big', otherUser);
        const ownPicture = selectn('photo.thumbnail.small', user);
        const defaultImgBig = 'img/no-img/big.jpg';
        const birthdayDataSet = profileWithMetadata.find(profileDataSet => typeof selectn('fields.birthday.value', profileDataSet) !== 'undefined');
        const genderDataSet = profileWithMetadata.find(profileDataSet => typeof selectn('fields.gender.value', profileDataSet) !== 'undefined');
        const age = selectn('fields.birthday.value', birthdayDataSet);
        const gender = selectn('fields.gender.value', genderDataSet);
        const location = selectn('location.locality', profile) || selectn('location.country', profile) || strings.noLocation;
        const enoughData = otherUser && profile && profileWithMetadata && ownProfile;
        const profilePhoto = photos.find((photo) => photo.isProfilePhoto === true);

        return (
            <div className="views">
                <TopNavBar leftIcon={'left-arrow'} wrapIcons={true} background="transparent"/>
                {enoughData ?
                    <ToolBar links={[
                        {'url': `/p/${params.slug}`, 'text': strings.about, 'icon': 'account'},
                        {'url': `/users/${params.slug}/other-questions`, 'text': strings.questions, 'icon': 'comment-question'},
                        {'url': `/users/${params.slug}/other-interests`, 'text': strings.interests, 'icon': 'thumbs-up-down'}
                    ]} activeLinkIndex={0} arrowUpLeft={'13%'}/>
                    : null}
                <div className="view view-main">
                    <div className="page other-user-page">
                        {enoughData && !orientationMustBeAsked ?
                            <div id="page-content" className="with-tab-bar">
                                <div className="user-images">
                                    <div className="swiper-pagination"></div>
                                    <div className="user-images-wrapper">
                                        <div className="swiper-custom">
                                            <div id={"photos-swiper-container"} className="swiper-container">
                                                <div className="swiper-wrapper">
                                                    {profilePhoto ?
                                                        <div className="swiper-slide" key={0} onClick={this.handlePhotoClick.bind(this, profilePhoto)}>
                                                            <Image src={profilePhoto.thumbnail.big} defaultSrc={defaultImgBig} onError={this.requestOtherUserPhoto}/>
                                                        </div>
                                                        : null
                                                    }

                                                    {photos.map((photo, index) =>
                                                        photo.isProfilePhoto ? null :
                                                            <div className="swiper-slide" key={index + 1} onClick={this.handlePhotoClick.bind(this, photo)}>
                                                                <Image src={photo.thumbnail.big} defaultSrc={defaultImgBig}/>
                                                            </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="user-header">
                                    <div className="user-header-data">
                                        <div className="username-title">
                                            {otherUser.username}
                                            {online ? <span className="online-status mdi mdi-circle"></span> : null}
                                        </div>
                                        <div className="user-description">
                                            {location}
                                            {' · '}
                                            <span className="age">{age}</span>
                                        </div>
                                    </div>
                                    <div className="user-header-actions">
                                        <div className="like-button action" onClick={like !== null ? this.onRate : null}>
                                            <span className={like === null ? 'icon-spinner rotation-animation' : like && like !== -1 ? 'mdi mdi-heart' : 'mdi mdi-heart-outline'}/>
                                        </div>
                                        <div className="send-message-button action" onClick={this.handleClickMessageLink}>
                                            <span className="mdi mdi-email-plus-outline"/>
                                        </div>
                                        <div className="block-button action" onClick={blocked !== null ? this.onBlock : null}>
                                            <span className="mdi mdi-dots-vertical"/>
                                        </div>
                                    </div>
                                </div>
                                <div className="other-profile-wrapper">
                                    <OtherProfileData matching={matching} similarity={similarity} stats={comparedStats} ownImage={ownPicture}
                                                      currentImage={otherPictureSmall}
                                                      interestsUrl={`/users/${params.slug}/other-interests`}
                                                      questionsUrl={`/users/${params.slug}/other-questions`}
                                                      userId={user.id}
                                                      otherUserId={otherUser.id}
                                    />
                                </div>
                                {/*<OtherProfileDataList profileWithMetadata={profileWithMetadata} metadata={metadata}/>*/}
                                {this.getNatural()}
                            </div>
                            : <EmptyMessage text={strings.loading} loadingGif={true}/>}
                    </div>
                </div>
                {ownProfile ? <OrientationRequiredPopup profile={ownProfile} onCancel={this.goToDiscover} onClick={this.setOrientationRequired.bind(this, false)}/> : null}
                <ReportContentPopup onClick={this.onReportReasonOther} contentRef={this.props.popupContentRef}/>
            </div>
        );
    }
}

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
        unlock                : 'Unlock user',
        blockAndReport        : 'Block and report user',
        cancel                : 'Cancel',
        confirmBlock          : 'Are you sure you want to block this user?',
        notAPerson            : 'This user is not a person',
        harmful               : 'This user is abusive or harmful',
        spam                  : 'This user sends spam',
        otherReasons          : 'Other reasons'
    }
};