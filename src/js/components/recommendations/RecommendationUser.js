import React, { PropTypes, Component } from 'react';
import { Link } from 'react-router';
import Image from '../ui/Image';
import translate from '../../i18n/Translate';
import connectToStores from '../../utils/connectToStores';
import ComparedStatsStore from '../../stores/ComparedStatsStore';
import GalleryPhotoStore from '../../stores/GalleryPhotoStore';
import OtherProfileData from '../profile/OtherProfileData';
import RecommendationUserDetails from '../recommendations/RecommendationUserDetails';
import selectn from 'selectn';

function getState(props) {
    const userId = parseInt(props.userId);
    const otherUserId = parseInt(props.recommendation.id);
    const stats = ComparedStatsStore.get(userId, otherUserId);
    const photos = GalleryPhotoStore.get(otherUserId);
    const noPhotos = GalleryPhotoStore.noPhotos(otherUserId);

    return {
        stats,
        photos,
        noPhotos,
    };
}

function initPhotosSwiper(id) {
    // Init slider
    return nekunoApp.swiper('#photos-swiper-container-' + id, {
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

@translate('RecommendationUser')
@connectToStores([], getState)
export default class RecommendationUser extends Component {
    static propTypes = {
        recommendation: PropTypes.object.isRequired,
        accessibleKey : PropTypes.number.isRequired,
        userId        : PropTypes.number.isRequired,
        ownPicture    : PropTypes.string,
        currentTab    : PropTypes.string,
        onTabClick    : PropTypes.func
    };

    static contextTypes = {
        router: PropTypes.object.isRequired
    };

    constructor(props) {
        super(props);

        this.handleMessage = this.handleMessage.bind(this);

        this.state = {
            photosLoaded: null
        };
    }

    componentDidUpdate() {
        if (this.props.photos.length > 0 && !this.state.photosLoaded) {
            initPhotosSwiper(this.props.recommendation.id);
            this.setState({photosLoaded: true})
        }
    }

    handleMessage() {
        this.context.router.push(`/conversations/${this.props.recommendation.id}`);
    }

    handlePhotoClick(url) {
        const {photos, recommendation} = this.props;
        const selectedPhoto = photos.find(photo => photo.url === url) || recommendation.photo;
        const selectedPhotoId = selectedPhoto.id || 'profile';
        this.context.router.push(`/users/${recommendation.id}/other-gallery/${selectedPhotoId}`);
    }

    render() {
        const {recommendation, accessibleKey, stats, photos, userId, ownPicture, currentTab, strings} = this.props;
        const defaultSrc = 'img/no-img/big.jpg';
        let imgSrc = recommendation.photo ? recommendation.photo.thumbnail.big : defaultSrc;
        let ownImgSrc = ownPicture ? ownPicture : defaultSrc;

        return (
            <div className="swiper-slide">
                <div className={'recommendation recommendation-' + accessibleKey}>
                    <div className="user-images">
                        <div className="user-images-wrapper">
                            <div className="swiper-custom">
                                <div id={"photos-swiper-container-" + recommendation.id} className="swiper-container">
                                    <div className="swiper-wrapper">
                                        <div className="swiper-slide" key={0} onClick={this.handlePhotoClick.bind(this, recommendation.photo.url)}>
                                            <Image src={imgSrc} defaultSrc={defaultSrc}/>
                                        </div>
                                        {photos && photos.length > 0 ? photos.map((photo, index) =>
                                            <div className="swiper-slide" key={index + 1} onClick={this.handlePhotoClick.bind(this, photo.url)}>
                                                <Image src={photo.thumbnail.big} defaultSrc={defaultSrc}/>
                                            </div>
                                        ) : null}
                                    </div>
                                </div>
                                <div className="swiper-button-prev"></div>
                                <div className="swiper-button-next"></div>
                            </div>
                        </div>
                    </div>
                    <div className="username-title">
                        {recommendation.username}
                    </div>
                    <div className="send-message-button icon-wrapper icon-wrapper-with-text" onClick={this.handleMessage}>
                        <span className="icon-message"></span>
                        <span className="text">{strings.message}</span>
                    </div>
                    <div className="user-description">
                        <span className="icon-marker"></span> {selectn('location.locality', recommendation.profile) || selectn('location.address', recommendation.profile)} -
                        <span className="age"> {strings.age}: {recommendation.age}</span>
                    </div>
                    <div className="other-profile-wrapper bold">
                        <OtherProfileData matching={recommendation.matching}
                                          similarity={recommendation.similarity} stats={stats} ownImage={ownImgSrc}
                                          currentImage={imgSrc}
                                          interestsUrl={`/users/${recommendation.id}/other-interests`}
                                          questionsUrl={`/users/${recommendation.id}/other-questions`}
                        />
                    </div>
                    <RecommendationUserDetails recommendation={recommendation} userId={userId} currentTab={currentTab} ownPicture={ownImgSrc} onTabClick={this.props.onTabClick}/>
                </div>
                <br />
                <br />
                <br />
                <br />
                <br />
                <br />
            </div>
        );
    }
}

RecommendationUser.defaultProps = {
    strings: {
        age    : 'Age',
        message: 'Message',
    }
};