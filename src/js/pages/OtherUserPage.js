import React, { PropTypes, Component } from 'react';
import { ORIGIN_CONTEXT } from '../constants/Constants';
import OtherProfileData from '../components/profile/OtherProfileData';
import OtherProfileDataList from '../components/profile/OtherProfileDataList'
import TopNavBar from '../components/ui/TopNavBar';
import ToolBar from '../components/ui/ToolBar';
import Image from '../components/ui/Image';
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
import selectn from 'selectn';

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
    GalleryPhotoActionCreators.getOtherPhotos(otherUserId);
}

function initPhotosSwiper() {
    // Init slider
    return nekunoApp.swiper('#photos-swiper-container', {
        effect          : 'coverflow',
        slidesPerView   : 'auto',
        coverflow       : {
            rotate      : 30,
            stretch     : 0,
            depth       : 100,
            modifier    : 1,
            slideShadows: false
        },
        centeredSlides  : true,
        paginationHide: false,
        paginationClickable: true,
        nextButton: '.swiper-button-next',
        prevButton: '.swiper-button-prev',
    });
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
    const photos = GalleryPhotoStore.get(otherUserId);
    const noPhotos = GalleryPhotoStore.noPhotos(otherUserId);

    return {
        otherUser,
        profile,
        profileWithMetadata,
        matching,
        similarity,
        block,
        like,
        comparedStats,
        user,
        photos,
        noPhotos
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
    UserActionCreators.likeUser(parseId(user), parseId(otherUser), ORIGIN_CONTEXT.OTHER_USER_PAGE, otherUser.username);
}

function unsetLikeUser(props) {
    const {user, otherUser} = props;
    UserActionCreators.deleteLikeUser(parseId(user), parseId(otherUser));
}

@AuthenticatedComponent
@translate('OtherUserPage')
@connectToStores([UserStore, ProfileStore, MatchingStore, SimilarityStore, BlockStore, LikeStore, ComparedStatsStore, GalleryPhotoStore], getState)
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
        profileWithMetadata: PropTypes.array,
        matching           : PropTypes.number,
        similarity         : PropTypes.number,
        block              : PropTypes.bool,
        like               : PropTypes.number,
        comparedStats      : PropTypes.object,
        photos             : PropTypes.array,
        noPhotos           : PropTypes.bool
    };
    static contextTypes = {
        history: PropTypes.object.isRequired
    };

    constructor(props) {
        super(props);

        this.onRate = this.onRate.bind(this);
        this.onBlock = this.onBlock.bind(this);
        this.handleClickMessageLink = this.handleClickMessageLink.bind(this);
        this.handlePhotoClick = this.handlePhotoClick.bind(this);

        this.state = {
            photosLoaded: null
        };
    }

    componentWillMount() {
        requestData(this.props);
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.params.userId !== this.props.params.userId) {
            requestData(nextProps);
        }
    }

    componentDidUpdate() {
        if (this.props.photos.length > 0 && !this.state.photosLoaded) {
            initPhotosSwiper();
            this.setState({photosLoaded: true})
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
        if (!this.props.like || this.props.like === -1) {
            setLikeUser(this.props);
        } else {
            unsetLikeUser(this.props);
        }
    }

    handleClickMessageLink() {
        this.context.history.pushState(null, `/conversations/${this.props.params.userId}`)
    }

    handlePhotoClick(url) {
        const {photos, otherUser} = this.props;
        const selectedPhoto = photos.find(photo => photo.url === url) || otherUser.photo;
        const selectedPhotoId = selectedPhoto.id || 'profile';
        this.context.history.pushState(null, `/users/${otherUser.id}/other-gallery/${selectedPhotoId}`);
    }

    render() {
        const {user, otherUser, profile, profileWithMetadata, matching, similarity, block, like, comparedStats, photos, noPhotos, strings} = this.props;
        const otherPictureSmall = selectn('photo.thumbnail.small', otherUser);
        const otherPictureBig = selectn('photo.thumbnail.big', otherUser);
        const ownPicture = selectn('photo.thumbnail.small', user);
        const defaultImgBig = 'img/no-img/big.jpg';
        //const blockClass = block ? "icon-block blocked" : "icon-block";
        const birthdayDataSet = profileWithMetadata.find(profileDataSet => selectn('fields.birthday.value', profileDataSet) !== null);
        const age = selectn('fields.birthday.value', birthdayDataSet);
        const location = selectn('location.locality', profile) || selectn('location.country', profile);

        return (
            <div className="view view-main">
                <TopNavBar leftIcon={'left-arrow'} centerText={otherUser ? otherUser.username : ''}/>
                <div className="page other-user-page">
                    {otherUser && profile && profileWithMetadata ?
                        <div id="page-content">
                            <div className="user-images">
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
                                        <div className="swiper-button-prev"></div>
                                        <div className="swiper-button-next"></div>
                                    </div>
                                </div>
                            </div>
                            <div className="other-user-main-data">
                                <div className="username-title">
                                    {otherUser.username}
                                </div>
                                <div className="send-message-button icon-wrapper icon-wrapper-with-text" onClick={this.handleClickMessageLink}>
                                    <span className="icon-message"></span>
                                    <span className="text">{strings.message}</span>
                                </div>
                                <div className="like-button icon-wrapper" onClick={like !== null ? this.onRate : null}>
                                    <span className={like === null ? 'icon-spinner' : like && like !== -1 ? 'icon-cross' : 'icon-checkmark'}></span>
                                </div>
                                <div className="user-description">
                                    <span className="icon-marker"></span> {location} -
                                    <span className="age"> {strings.age}: {age}</span>
                                </div>
                                <div className="other-profile-wrapper bold">
                                    <OtherProfileData matching={matching} similarity={similarity} stats={comparedStats} ownImage={ownPicture}
                                                      currentImage={otherPictureSmall}
                                                      interestsUrl={`/users/${parseId(otherUser)}/other-interests`}
                                                      questionsUrl={`/users/${parseId(otherUser)}/other-questions`}/>
                                </div>
                            </div>
                            <OtherProfileDataList profile={profile} profileWithMetadata={profileWithMetadata}/>
                            <br />
                            <br />
                            <br />
                            <br />
                            <br />
                            <br />
                        </div>
                        : ''}
                </div>
                {otherUser && profile && profileWithMetadata ?
                    <ToolBar links={[
                    {'url': `/profile/${parseId(otherUser)}`, 'text': strings.about},
                    {'url': `/users/${parseId(otherUser)}/other-questions`, 'text': strings.questions},
                    {'url': `/users/${parseId(otherUser)}/other-interests`, 'text': strings.interests}]} activeLinkIndex={0} arrowUpLeft={'13%'}/>
                    : ''}
            </div>
        );
    }
};

OtherUserPage.defaultProps = {
    strings: {
        age         : 'Age',
        message     : 'Message',
        about       : 'About',
        photos      : 'Photos',
        questions   : 'Answers',
        interests   : 'Interests',
        like        : 'Like',
        dontLike    : 'Don\'t like anymore',
        saving      : 'Saving...',
        confirmBlock: 'Are you sure you want to block this user?'
    }
};