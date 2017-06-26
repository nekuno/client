import React, { PropTypes, Component } from 'react';
import TopNavBar from '../components/ui/TopNavBar';
import Image from '../components/ui/Image';
import AuthenticatedComponent from '../components/AuthenticatedComponent';
import translate from '../i18n/Translate';
import connectToStores from '../utils/connectToStores';
import GalleryPhotoStore from '../stores/GalleryPhotoStore';
import GalleryPhotoActionCreators from '../actions/GalleryPhotoActionCreators';

function parseId(user) {
    return user.id;
}

function requestData(props) {
    GalleryPhotoActionCreators.getPhotos(parseId(props.user));
}

function getState(props) {
    const userId = parseId(props.user);
    const photos = GalleryPhotoStore.get(userId);
    const photo = GalleryPhotoStore.getSelectedPhoto();

    return {
        photos: photos,
        photo: photo
    }
}

function initPhotosSwiper(photos, photoIndex) {
    // Init slider
    let gallerySwiper = nekunoApp.swiper('#gallery-swiper-container', {
        initialSlide: photoIndex,
        onSlideChangeEnd: onSlideChangeEnd,
        slidesPerView: 'auto',
        centeredSlides: true,
        paginationHide: false,
        paginationClickable: true,
        nextButton: '.swiper-button-next',
        prevButton: '.swiper-button-prev',
    });

    let activeIndex = gallerySwiper.activeIndex;

    function onSlideChangeEnd(swiper) {
        activeIndex = swiper.activeIndex;
        const photo = photos[activeIndex];
        GalleryPhotoActionCreators.selectPhoto(photo);
    }

    return gallerySwiper;
}

@AuthenticatedComponent
@translate('GalleryPhotoPage')
@connectToStores([GalleryPhotoStore], getState)
export default class GalleryPhotoPage extends Component {

    static propTypes = {
        // Injected by @AuthenticatedComponent
        user: PropTypes.object.isRequired,
        // Injected by @translate:
        strings: PropTypes.object,
        // Injected by @connectToStores:
        photo: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
        photos: PropTypes.array.isRequired,
    };

    static contextTypes = {
        router: PropTypes.object.isRequired
    };

    constructor(props) {
        super(props);

        this.setAsProfilePhoto = this.setAsProfilePhoto.bind(this);
        this.deletePhoto = this.deletePhoto.bind(this);

        this.state = {
            photosLoaded: null,
            swiper: null
        }
    }


    componentWillMount() {
        if (!this.props.photo) {
            this.context.router.push('gallery');
        }
    }

    componentDidMount() {
        requestData(this.props);
    }

    componentDidUpdate() {
        const {photos, photo, user} = this.props;
        if (this.props.photos.length > 0 && photo && !this.state.photosLoaded) {
            const photoIndex = photos.findIndex(singlePhoto => singlePhoto.id == photo.id);
            initPhotosSwiper(photos, photoIndex);
            this.setState({photosLoaded: true});
        }
    }

    setAsProfilePhoto() {
        this.context.router.push('gallery-profile-photo');
    }

    deletePhoto() {
        const userId = parseId(this.props.user);
        nekunoApp.confirm(this.props.strings.confirmDelete, () => {
            const photoId = this.props.photo.id;
            GalleryPhotoActionCreators.deletePhoto(userId, photoId);
            this.context.router.push('gallery');
        });
    }
    
    render() {
        const {user, photos, photo, strings} = this.props;
        const isProfilePhoto = photo && photo.isProfilePhoto;
        return (
            <div className="views">
                {isProfilePhoto ?
                    <TopNavBar leftIcon={'left-arrow'} centerText={strings.profilePhoto}/>
                    :
                    <TopNavBar leftIcon={'left-arrow'} centerText={strings.photos} rightIcon={'person'} secondRightIcon={'delete'} onRightLinkClickHandler={this.setAsProfilePhoto} onSecondRightLinkClickHandler={this.deletePhoto}/>
                }
                <div className="view view-main">
                    <div className="page gallery-photo-page">
                        <div id="page-content" className="gallery-photo-content">
                            <div className="swiper-custom">
                                {user.photo && photos ?
                                    <div id="gallery-swiper-container" className="swiper-container">
                                        <div className="swiper-wrapper">
                                            {photos.map((photo, index) =>
                                                <div className="swiper-slide" key={index}>
                                                    <div className="photo-absolute-wrapper">
                                                        <Image src={photo.thumbnail.big}/>
                                                        <div className="swiper-button-prev"></div>
                                                        <div className="swiper-button-next"></div>
                                                    </div>

                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    : null}
                            </div>
                            <br />
                            <br />
                            <br />
                            <br />
                            <br />
                            <br />
                        </div>
                    </div>
                </div>
            </div>
        );
    }
};

GalleryPhotoPage.defaultProps = {
    strings: {
        photos       : 'Photos',
        profilePhoto : 'Profile photo',
        confirmDelete: 'Are you sure you want to delete this photo?'
    }
};