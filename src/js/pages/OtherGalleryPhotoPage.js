import PropTypes from 'prop-types';
import React, { Component } from 'react';
import TopNavBar from '../components/ui/TopNavBar';
import Image from '../components/ui/Image';
import AuthenticatedComponent from '../components/AuthenticatedComponent';
import translate from '../i18n/Translate';
import connectToStores from '../utils/connectToStores';
import GalleryPhotoStore from '../stores/GalleryPhotoStore';

function getState() {
    const photo = GalleryPhotoStore.getSelectedPhoto();

    return {
        photo: photo
    }
}

//TODO: Remove
@AuthenticatedComponent
@translate('OtherGalleryPhotoPage')
@connectToStores([GalleryPhotoStore], getState)
export default class OtherGalleryPhotoPage extends Component {

    static propTypes = {
        // Injected by @AuthenticatedComponent
        user   : PropTypes.object.isRequired,
        // Injected by @translate:
        strings: PropTypes.object,
        // Injected by @connectToStores:
        photo  : PropTypes.object
    };

    static contextTypes = {
        router: PropTypes.object.isRequired
    };

    componentWillMount() {
        if (!this.props.photo) {
            this.context.router.push('gallery');
        }
    }

    render() {
        const {photo, strings} = this.props;
        return (
            <div className="views">
                <div className="view view-main">
                    <TopNavBar leftIcon={'left-arrow'} centerText={strings.photos}/>
                    <div className="page gallery-photo-page">
                        <div id="page-content" className="gallery-photo-content">
                            {photo ?
                                <div className="photo-wrapper">
                                    <Image src={photo.thumbnail.medium}/>
                                </div>
                                : ''}
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
}

OtherGalleryPhotoPage.defaultProps = {
    strings: {
        photos: 'Photos'
    }
};