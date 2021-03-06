import PropTypes from 'prop-types';
import React, { Component } from 'react';
import TopNavBar from '../components/ui/TopNavBar';
import EmptyMessage from '../components/ui/EmptyMessage/EmptyMessage';
import Image from '../components/ui/Image';
import FullWidthButton from '../components/ui/FullWidthButton';
import AuthenticatedComponent from '../components/AuthenticatedComponent';
import translate from '../i18n/Translate';
import connectToStores from '../utils/connectToStores';
import GalleryAlbumStore from '../stores/GalleryAlbumStore';
import GalleryPhotoActionCreators from '../actions/GalleryPhotoActionCreators';

const photosPerPage = 32;

function parseId(user) {
    return user.id;
}

function getState() {
    const name = GalleryAlbumStore.getAlbumName();
    const photos = GalleryAlbumStore.getAlbumPhotos();
    const noPhotos = GalleryAlbumStore.noPhotos();
    return {
        name,
        photos,
        noPhotos
    };
}

//TODO: Remove
@AuthenticatedComponent
@translate('GalleryAlbumPhotosPage')
@connectToStores([GalleryAlbumStore], getState)
export default class GalleryAlbumPhotosPage extends Component {

    static propTypes = {
        // Injected by @AuthenticatedComponent
        user: PropTypes.object.isRequired,
        // Injected by @translate:
        strings: PropTypes.object,
        // Injected by @connectToStores:
        name: PropTypes.string.isRequired,
        photos: PropTypes.array.isRequired,
        noPhotos: PropTypes.bool
    };

    static contextTypes = {
        router: PropTypes.object.isRequired
    };

    constructor(props) {
        super(props);

        this.handleScroll = this.handleScroll.bind(this);
        this.importPhotos = this.importPhotos.bind(this);
        this.isSelected = this.isSelected.bind(this);

        this.state = {
            displayedPhotos: props.photos.filter((photo, index) => index < photosPerPage),
            paginationIndex: 0,
            selectedPhotos: []
        };
    }

    componentWillMount() {
        if ((!this.props.photos || this.props.photos.length === 0) && !this.props.noPhotos) {
            this.context.router.push('gallery');
        }
    }
    
    componentDidMount() {
        const {photos} = this.props;
        const {paginationIndex} = this.state;
        if (!this.canScroll()) {
            this.setState({
                paginationIndex: paginationIndex + 1,
                displayedPhotos: photos.filter((photo, index) => index < photosPerPage * (paginationIndex + 2))

            });
        }
    }

    handleScroll() {
        const {photos} = this.props;
        const {paginationIndex} = this.state;
        let offsetTop = parseInt(document.getElementsByClassName('view')[0].scrollTop + document.getElementsByClassName('view')[0].offsetHeight - 50);
        let offsetTopMax = parseInt(document.getElementById('page-content').offsetHeight);

        if (offsetTop >= offsetTopMax) {
            document.getElementsByClassName('view')[0].removeEventListener('scroll', this.handleScroll);
            this.setState({
                paginationIndex: paginationIndex + 1,
                displayedPhotos: photos.filter((photo, index) => index < photosPerPage * (paginationIndex + 2))
            });
        }
    }

    canScroll() {
        const totalHeight = parseInt(document.getElementsByClassName('view')[0].offsetHeight);
        const scrollHeight = parseInt(document.getElementsByClassName('view')[0].scrollHeight);
        return totalHeight !== scrollHeight;
    }
    
    selectPhoto(photo) {
        let selectedPhotos = this.state.selectedPhotos;
        if (this.isSelected(photo)) {
            const index = selectedPhotos.indexOf(photo);
            selectedPhotos.splice(index, 1);
        } else {
            selectedPhotos.push(photo);
        }
        this.setState({selectedPhotos: selectedPhotos});
    }
    
    isSelected(photo) {
        return this.state.selectedPhotos.some(selectedPhoto => selectedPhoto.id === photo.id);
    }

    importPhotos() {
        const userId = parseId(this.props.user);
        this.state.selectedPhotos.forEach(selectedPhoto => GalleryPhotoActionCreators.postPhoto(userId, {
            url: selectedPhoto.images && selectedPhoto.images[selectedPhoto.images.length - 1] ? selectedPhoto.images[selectedPhoto.images.length - 1].source : selectedPhoto.picture
        }));
        this.context.router.push('gallery');
    }

    render() {
        const {name, noPhotos, strings} = this.props;
        return (
            <div className="views">
                <TopNavBar leftIcon={'left-arrow'} centerText={name}/>
                <div className="view view-main" onScroll={this.handleScroll}>
                    <div className="page gallery-page">
                        <div id="page-content" className="gallery-content">
                            {noPhotos ? <EmptyMessage text={strings.empty}/> : this.state.displayedPhotos.map(photo =>
                                <div key={photo.id} className={this.isSelected(photo) ? 'photo-wrapper selected-photo' : 'photo-wrapper'} onClick={this.selectPhoto.bind(this, photo)}>
                                    {this.isSelected(photo) ? <span className="icon icon-form-checkbox"></span> : ''}
                                    <div className="photo-absolute-wrapper">
                                        <Image src={photo.picture}/>
                                    </div>
                                </div>
                            )}
                            <br />
                            <br />
                            <br />
                            <br />
                            <br />
                            <br />
                        </div>
                    </div>
                    {noPhotos ? '' :
                        <div className="fixed-button">
                            <FullWidthButton onClick={this.importPhotos}>{strings.importPhotos}</FullWidthButton>
                        </div>
                    }
                </div>
            </div>
        );
    }
}

GalleryAlbumPhotosPage.defaultProps = {
    strings: {
        empty       : 'There are no photos in this album',
        importPhotos: 'Import photos'
    }
};