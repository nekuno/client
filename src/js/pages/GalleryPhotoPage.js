import React, { PropTypes, Component } from 'react';
import TopNavBar from '../components/ui/TopNavBar';
import Image from '../components/ui/Image';
import AuthenticatedComponent from '../components/AuthenticatedComponent';
import translate from '../i18n/Translate';

@AuthenticatedComponent
@translate('GalleryPhotoPage')
export default class GalleryPhotoPage extends Component {

    static propTypes = {
        // Injected by @AuthenticatedComponent
        user: PropTypes.object.isRequired,
        // Injected by @translate:
        strings: PropTypes.object
        // Injected by @connectToStores:
        //...
    };

    static contextTypes = {
        history: PropTypes.object.isRequired
    };

    constructor(props) {
        super(props);

        this.setAsProfilePhoto = this.setAsProfilePhoto.bind(this);
        this.deletePhoto = this.deletePhoto.bind(this);
    }

    setAsProfilePhoto() {
        this.context.history.pushState(null, 'gallery-profile-photo');
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
        return (
            <div className="view view-main">
                <TopNavBar leftIcon={'left-arrow'} centerText={strings.photos} rightIcon={'person'} secondRightIcon={'delete'} onRightLinkClickHandler={this.setAsProfilePhoto} onSecondRightLinkClickHandler={this.deletePhoto}/>
                <div className="page gallery-photo-page">
                    <div id="page-content" className="gallery-photo-content">
                        <div className="photo-wrapper">
                            <Image src={selectedPhoto.url}/>
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
        );
    }
};

GalleryPhotoPage.defaultProps = {
    strings: {
        photos: 'Photos'
    }
};