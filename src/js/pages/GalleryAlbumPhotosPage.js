import React, { PropTypes, Component } from 'react';
import TopNavBar from '../components/ui/TopNavBar';
import EmptyMessage from '../components/ui/EmptyMessage';
import Image from '../components/ui/Image';
import FullWidthButton from '../components/ui/FullWidthButton';
import AuthenticatedComponent from '../components/AuthenticatedComponent';
import translate from '../i18n/Translate';
import connectToStores from '../utils/connectToStores';
import GalleryAlbumStore from '../stores/GalleryAlbumStore';
import GalleryPhotoActionCreators from '../actions/GalleryPhotoActionCreators';

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
        history: PropTypes.object.isRequired
    };

    constructor(props) {
        super(props);

        this.handleScroll = this.handleScroll.bind(this);
        this.importPhotos = this.importPhotos.bind(this);
        this.isSelected = this.isSelected.bind(this);

        this.state = {
            selectedPhotos: []
        };
    }

    componentWillMount() {
        if ((!this.props.photos || this.props.photos.length === 0) && !this.props.noPhotos) {
            this.context.history.pushState(null, 'gallery');
        }
    }

    handleScroll() {
        
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
            url: selectedPhoto.picture
        }));
        this.context.history.pushState(null, 'gallery');
    }

    render() {
        const {name, photos, noPhotos, strings} = this.props;
        return (
            <div className="view view-main" onScroll={this.handleScroll}>
                <TopNavBar leftIcon={'left-arrow'} centerText={name}/>
                <div className="page gallery-page">
                    <div id="page-content" className="gallery-content">
                        {noPhotos ? <EmptyMessage text={strings.empty}/> : photos.map(photo =>
                            <div key={photo.id} className={this.isSelected(photo) ? 'photo-wrapper selected-photo' : 'photo-wrapper'} onClick={this.selectPhoto.bind(this, photo)}>
                                {this.isSelected(photo) ? <span className="icon icon-form-checkbox"></span> : ''}
                                <Image src={photo.picture}/>
                            </div>
                        )}
                        <br />
                        <br />
                        {noPhotos ? '' : <FullWidthButton onClick={this.importPhotos}>{strings.importPhotos}</FullWidthButton>}
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

GalleryAlbumPhotosPage.defaultProps = {
    strings: {
        empty       : 'There are no photos in this album',
        importPhotos: 'Import photos'
    }
};