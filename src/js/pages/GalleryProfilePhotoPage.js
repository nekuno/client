import React, { PropTypes, Component } from 'react';
import TopNavBar from '../components/ui/TopNavBar';
import FullWidthButton from '../components/ui/FullWidthButton';
import AuthenticatedComponent from '../components/AuthenticatedComponent';
import translate from '../i18n/Translate';
import ReactCrop from 'react-image-crop';

@AuthenticatedComponent
@translate('GalleryProfilePhotoPage')
export default class GalleryProfilePhotoPage extends Component {

    static propTypes = {
        // Injected by @AuthenticatedComponent
        user: PropTypes.object.isRequired,
        // Injected by @translate:
        strings: PropTypes.object
        // Injected by @connectToStores:
        //...
    };

    constructor(props) {
        super(props);

        this.cropAndSaveAsProfilePhoto = this.cropAndSaveAsProfilePhoto.bind(this);
        this.deletePhoto = this.deletePhoto.bind(this);
    }

    cropAndSaveAsProfilePhoto() {
        
    }

    deletePhoto() {
        
    }
    
    render() {
        const {strings} = this.props;
        //TODO: This is just an example (selectedPhoto should be retrieved from PhotoStore)
        const selectedPhoto = {
            id: 1,
            url: 'http://pbs.twimg.com/profile_images/563611650767331328/fgiDg2uB.png'
        };
        let crop = { 
            keepSelection: true,
            aspect: 1,
            x: 5,
            y: 5,
            width: 90
        };
        return (
            <div className="view view-main">
                <TopNavBar leftText={strings.cancel} centerText={strings.photos}/>
                <div className="page gallery-photo-page">
                    <div id="page-content" className="gallery-photo-content">
                        <div className="photo-wrapper">
                            <ReactCrop src={selectedPhoto.url} crop={crop} minWidth={30} keepSelection={true}/>
                        </div>
                        <br />
                        <br />
                        <FullWidthButton onClick={this.cropAndSaveAsProfilePhoto}>{strings.changeProfilePhoto}</FullWidthButton>
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

GalleryProfilePhotoPage.defaultProps = {
    strings: {
        cancel            : 'Cancel',
        photos            : 'Photos',
        changeProfilePhoto: 'Change profile photo'
    }
};