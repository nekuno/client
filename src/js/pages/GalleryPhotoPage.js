import React, { PropTypes, Component } from 'react';
import TopNavBar from '../components/ui/TopNavBar';
import Image from '../components/ui/Image';
import AuthenticatedComponent from '../components/AuthenticatedComponent';
import translate from '../i18n/Translate';
import connectToStores from '../utils/connectToStores';
import GalleryPhotoStore from '../stores/GalleryPhotoStore';
import GalleryPhotoActionCreators from '../actions/GalleryPhotoActionCreators';

function parseId(user) {
    return user.qnoow_id;
}

function getState() {
    const photo = GalleryPhotoStore.getSelectedPhoto();
    
    return {
        photo: photo
    }
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
        photo: PropTypes.oneOfType([PropTypes.object, PropTypes.string])
    };

    static contextTypes = {
        history: PropTypes.object.isRequired
    };

    constructor(props) {
        super(props);

        this.setAsProfilePhoto = this.setAsProfilePhoto.bind(this);
        this.deletePhoto = this.deletePhoto.bind(this);
    }


    componentWillMount() {
        if (!this.props.photo) {
            this.context.history.pushState(null, 'gallery');
        }
    }

    setAsProfilePhoto() {
        this.context.history.pushState(null, 'gallery-profile-photo');
    }

    deletePhoto() {
        const userId = parseId(this.props.user)
        nekunoApp.confirm(this.props.strings.confirmDelete, () => {
            const photoId = this.props.photo.id;
            const history = this.context.history;
            GalleryPhotoActionCreators.deletePhoto(userId, photoId).then(function() {
                history.pushState(null, 'gallery');
            });
        });
    }
    
    render() {
        const {photo, strings} = this.props;
        const isProfilePhoto = photo && typeof photo.url == 'undefined';
        return (
            <div className="view view-main">
                {isProfilePhoto ?
                    <TopNavBar leftIcon={'left-arrow'} centerText={strings.photos}/>
                    :
                    <TopNavBar leftIcon={'left-arrow'} centerText={strings.photos} rightIcon={'person'} secondRightIcon={'delete'} onRightLinkClickHandler={this.setAsProfilePhoto} onSecondRightLinkClickHandler={this.deletePhoto}/>
                }
                <div className="page gallery-photo-page">
                    <div id="page-content" className="gallery-photo-content">
                        {isProfilePhoto || photo && photo.url ?
                            <div className="photo-wrapper">
                                <Image src={isProfilePhoto ? photo : photo.url}/>
                            </div>
                            : null}
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

GalleryPhotoPage.defaultProps = {
    strings: {
        photos       : 'Photos',
        confirmDelete: 'Are you sure you want to delete this photo?'
    }
};