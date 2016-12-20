import React, { PropTypes, Component } from 'react';
import TopNavBar from '../components/ui/TopNavBar';
import AuthenticatedComponent from '../components/AuthenticatedComponent';
import translate from '../i18n/Translate';
import connectToStores from '../utils/connectToStores';
import ReactCrop from 'react-image-crop';
import GalleryPhotoStore from '../stores/GalleryPhotoStore';
import * as UserActionCreators from '../actions/UserActionCreators';
import GalleryPhotoActionCreators from '../actions/GalleryPhotoActionCreators';

function parseId(user) {
    return user.id;
}

function getState() {
    const photo = GalleryPhotoStore.getSelectedPhoto();
    
    return {
        photo: photo
    }
}

@AuthenticatedComponent
@translate('GalleryProfilePhotoPage')
@connectToStores([GalleryPhotoStore], getState)
export default class GalleryProfilePhotoPage extends Component {

    static propTypes = {
        // Injected by @AuthenticatedComponent
        user: PropTypes.object.isRequired,
        // Injected by @translate:
        strings: PropTypes.object,
        // Injected by @connectToStores:
        photo: PropTypes.object
    };

    static contextTypes = {
        history: PropTypes.object.isRequired
    };
    
    constructor(props) {
        super(props);

        this.cropAndSaveAsProfilePhoto = this.cropAndSaveAsProfilePhoto.bind(this);
        this.onChange = this.onChange.bind(this);

        this.state = {
            crop: {}
        };
    }

    componentWillMount() {
        if (!this.props.photo) {
            this.context.history.pushState(null, 'gallery');
        }
    }

    cropAndSaveAsProfilePhoto() {
        const {photo, user, strings} = this.props;
        const {crop} = this.state;
        nekunoApp.confirm(strings.confirmSetAsProfilePhoto, () => {
            const photoId = photo.id;
            GalleryPhotoActionCreators.setAsProfilePhoto(photoId, crop).then(function() {
                UserActionCreators.requestUser(parseId(user), ['photo']);
            }, (error) => { console.log(error) });
            this.context.history.pushState(null, 'gallery');
        });
    }

    onChange(crop) {
        this.setState({
            crop: crop
        })
    }
    
    render() {
        const {photo, strings} = this.props;
        let crop = { 
            keepSelection: true,
            aspect: 1,
            x: 5,
            y: 5,
            width: 90
        };
        return (
            <div className="views">
                <TopNavBar leftText={strings.cancel} centerText={strings.photos} rightIcon={'checkmark'} onRightLinkClickHandler={photo ? this.cropAndSaveAsProfilePhoto : null}/>
                <div className="view view-main">
                    <div className="page gallery-photo-page">
                        <div id="page-content" className="gallery-photo-content">
                            {photo ?
                                <div className="photo-wrapper">
                                    <ReactCrop src={photo.thumbnail.medium} crop={crop} minWidth={30} keepSelection={true} onChange={this.onChange} onImageLoaded={this.onChange}/>
                                </div>
                                    :
                                ''}
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

GalleryProfilePhotoPage.defaultProps = {
    strings: {
        confirmSetAsProfilePhoto: 'Do you want to use this photo as your profile photo?',
        cancel                  : 'Cancel',
        photos                  : 'Photos',
        changeProfilePhoto      : 'Change profile photo'
    }
};