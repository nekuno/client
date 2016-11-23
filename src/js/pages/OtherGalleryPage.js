import React, { PropTypes, Component } from 'react';
import TopNavBar from '../components/ui/TopNavBar';
import Image from '../components/ui/Image';
import EmptyMessage from '../components/ui/EmptyMessage';
import AuthenticatedComponent from '../components/AuthenticatedComponent';
import translate from '../i18n/Translate';
import connectToStores from '../utils/connectToStores';
import * as UserActionCreators from '../actions/UserActionCreators';
import GalleryPhotoActionCreators from '../actions/GalleryPhotoActionCreators';
import GalleryPhotoStore from '../stores/GalleryPhotoStore';
import UserStore from '../stores/UserStore';

function requestData(props) {
    const userId = parseInt(props.params.userId);
    UserActionCreators.requestUser(userId, ['username', 'email', 'picture', 'status']);
    GalleryPhotoActionCreators.getOtherPhotos(userId);
}

function getState(props) {
    const otherUserId = parseInt(props.params.userId);
    const otherUser = UserStore.get(otherUserId);
    const photos = GalleryPhotoStore.get(otherUserId);
    const noPhotos = GalleryPhotoStore.noPhotos(otherUserId);
    const loadingPhotos = GalleryPhotoStore.getLoadingPhotos();

    return {
        otherUser,
        photos,
        noPhotos,
        loadingPhotos
    };
}

function initPhotosSwiper(photoIndex) {
    // Init slider
    return nekunoApp.swiper('#gallery-swiper-container', {
        initialSlide: photoIndex,
        effect: 'coverflow',
        slidesPerView: 'auto',
        coverflow: {
            rotate: 30,
            stretch: 0,
            depth: 100,
            modifier: 1,
            slideShadows: false
        },
        centeredSlides: true,
        paginationHide: false,
        paginationClickable: true,
        nextButton: '.swiper-button-next',
        prevButton: '.swiper-button-prev',
    });
}

@AuthenticatedComponent
@translate('OtherGalleryPage')
@connectToStores([UserStore, GalleryPhotoStore], getState)
export default class OtherGalleryPage extends Component {

    static propTypes = {
        // Injected by React Router:
        params   : PropTypes.shape({
            userId : PropTypes.string.isRequired,
            photoId: PropTypes.string
        }).isRequired,
        // Injected by @AuthenticatedComponent
        user     : PropTypes.object.isRequired,
        // Injected by @translate:
        strings  : PropTypes.object,
        // Injected by @connectToStores:
        otherUser: PropTypes.object,
        noPhotos : PropTypes.bool,
        photos   : PropTypes.array
    };

    constructor(props) {
        super(props);

        this.state = {
            photosLoaded: null,
            swiper: null
        }
    }

    componentWillMount() {
        requestData(this.props);
    }

    componentDidUpdate() {
        const {photos, otherUser, params} = this.props;
        if (this.props.photos.length > 0 && otherUser && otherUser.photo && !this.state.photosLoaded) {
            const photoIndex = photos.findIndex(photo => photo.id == params.photoId) + 1 || 0;
            initPhotosSwiper(photoIndex);
            this.setState({photosLoaded: true,});
        }
    }

    render() {
        const {otherUser, photos, noPhotos, strings} = this.props;
        return (
            <div className="view view-main" onScroll={this.handleScroll}>
                <TopNavBar leftIcon={'left-arrow'} centerText={otherUser ? otherUser.username : ''}/>
                <div className="page">
                    <div id="page-content" className="gallery-photo-content">
                        {otherUser && !otherUser.photo && noPhotos ?
                            <EmptyMessage text={strings.empty}/>
                            :
                            otherUser && otherUser.photo ?
                                <div className="swiper-custom">
                                    <div id="gallery-swiper-container" className="swiper-container">
                                        <div className="swiper-wrapper">
                                            <div className="swiper-slide" key={0}>
                                                <div className="photo-absolute-wrapper">
                                                    <Image src={otherUser.photo.url}/>
                                                    <div className="swiper-button-prev"></div>
                                                    <div className="swiper-button-next"></div>
                                                </div>
                                            </div>
                                            {photos.map((photo, index) =>
                                                <div className="swiper-slide" key={index + 1}>
                                                    <div className="photo-absolute-wrapper">
                                                        <Image src={photo.url}/>
                                                        <div className="swiper-button-prev"></div>
                                                        <div className="swiper-button-next"></div>
                                                    </div>

                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                :
                                <EmptyMessage text={strings.loading} loadingGif={true}/>
                        }
                        <br />
                        <br />
                        <br />
                        <br />
                        <br />
                        <br />
                    </div>
                </div>
            </div>
        );
    }
};

OtherGalleryPage.defaultProps = {
    strings: {
        empty  : 'User has not imported any photo yet',
        loading: 'Loading photos',
    }
};