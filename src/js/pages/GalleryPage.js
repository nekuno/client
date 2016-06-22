import React, { PropTypes, Component } from 'react';
import { IMAGES_ROOT } from '../constants/Constants';
import TopNavBar from '../components/ui/TopNavBar';
import ToolBar from '../components/ui/ToolBar';
import Image from '../components/ui/Image';
import EmptyMessage from '../components/ui/EmptyMessage';
import ImportAlbumPopup from '../components/gallery/ImportAlbumPopup';
import AuthenticatedComponent from '../components/AuthenticatedComponent';
import translate from '../i18n/Translate';
import connectToStores from '../utils/connectToStores';
import GalleryPhotoStore from '../stores/GalleryPhotoStore';
import UserStore from '../stores/UserStore';
import GalleryAlbumActionCreators from '../actions/GalleryAlbumActionCreators';
import GalleryPhotoActionCreators from '../actions/GalleryPhotoActionCreators';

function parseId(user) {
    return user.qnoow_id;
}

function requestData() {
    GalleryPhotoActionCreators.getPhotos();
}

function getState(props) {
    const userId = parseId(props.user);
    const noPhotos = false;
    const photos = GalleryPhotoStore.photos;
    const user = UserStore.get(userId);
    const profilePhoto = props.user.picture ? `${IMAGES_ROOT}media/cache/resolve/user_avatar_180x180/user/images/${props.user.picture}` : '';
    return {
        photos,
        profilePhoto,
        noPhotos
    };
}

@AuthenticatedComponent
@translate('GalleryPage')
@connectToStores([UserStore, GalleryPhotoStore], getState)
export default class GalleryPage extends Component {

    static propTypes = {
        // Injected by @AuthenticatedComponent
        user        : PropTypes.object.isRequired,
        // Injected by @translate:
        strings     : PropTypes.object,
        // Injected by @connectToStores:
        photos      : PropTypes.array,
        profilePhoto: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
        noPhotos    : PropTypes.bool
    };

    static contextTypes = {
        history: PropTypes.object.isRequired
    };

    constructor(props) {
        super(props);

        this.handleScroll = this.handleScroll.bind(this);
        this.importAlbum = this.importAlbum.bind(this);
        this.goToPhotoGalleryPage = this.goToPhotoGalleryPage.bind(this);
        this.triggerUploadFile = this.triggerUploadFile.bind(this);
        this.uploadFile = this.uploadFile.bind(this);
    }
    
    componentWillMount() {
        requestData();
    }
    
    handleScroll() {
        //TODO: Will be paginated?
    }

    goToPhotoGalleryPage(photo) {
        GalleryPhotoActionCreators.selectPhoto(photo);
        window.setTimeout(() => { this.context.history.pushState(null, 'gallery-photo') }, 0);
    }

    importAlbumPopUp() {
        nekunoApp.popup('.popup-import-album');
    }

    importAlbum(resource, scope) {
        nekunoApp.closeModal('.popup-import-album');
        GalleryAlbumActionCreators.getAlbums(resource, scope).then(() => {
            window.setTimeout(() => { this.context.history.pushState(null, 'gallery-albums') }, 500);
        });
    }

    triggerUploadFile() {
        this.refs.fileInput.click();
    }
    
    uploadFile(e) {
        e.preventDefault();
        var files;
        if (e.dataTransfer) {
            files = e.dataTransfer.files;
        } else if (e.target) {
            files = e.target.files;
        }
        if (typeof files[0] !== 'undefined') {
            this.savePhoto(files[0])
        }
    }

    savePhoto(file) {
        var fileReader = new FileReader();

        fileReader.onload = function(fileLoadedEvent) {
            const base64 = fileLoadedEvent.target.result.replace(/^data:image\/(png|jpg);base64,/, "");
            GalleryPhotoActionCreators.postPhoto({
                base64: base64
            })
            
        };
        fileReader.readAsDataURL(file);
    }

    render() {
        const {photos, profilePhoto, noPhotos, strings} = this.props;
        return (
            <div className="view view-main" onScroll={this.handleScroll}>
                <TopNavBar leftMenuIcon={true} centerText={strings.myProfile} rightIcon={'uploadthin'} rightIconsWithoutCircle={true} onRightLinkClickHandler={this.triggerUploadFile}/>
                <input style={{display: 'none' }} type='file' multiple ref='fileInput' onChange={this.uploadFile} />
                <div className="page gallery-page">
                    <div id="page-content" className="gallery-content">
                        <div className="import-album-wrapper photo-wrapper" onClick={this.importAlbumPopUp}>
                            <div className="icon-image"></div>
                            <div className="text">{strings.importAlbum}</div>
                        </div>
                        {profilePhoto ?
                            <div className="photo-wrapper" onClick={this.goToPhotoGalleryPage.bind(this, profilePhoto)}>
                                <div className="photo-absolute-wrapper">
                                    <Image src={profilePhoto}/>
                                </div>
                                <div className="profile-photo-text"><span className="icon-person"></span><div className="text">&nbsp;{strings.profilePhoto}</div></div>
                            </div>
                            : null}
                        {noPhotos ? <EmptyMessage text={strings.empty}/> : photos.map(photo => 
                            <div key={photo.id} className="photo-wrapper" onClick={this.goToPhotoGalleryPage.bind(this, photo)}>
                                <div className="photo-absolute-wrapper">
                                    <Image src={photo.url}/>
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
                <ToolBar links={[
                {'url': '/profile', 'text': strings.about},
                {'url': '/gallery', 'text': strings.photos},
                {'url': '/questions', 'text': strings.questions},
                {'url': '/interests', 'text': strings.interests}
                ]} activeLinkIndex={1} arrowUpLeft={'36%'} />
                <ImportAlbumPopup onClickHandler={this.importAlbum}/>
            </div>
        );
    }
};

GalleryPage.defaultProps = {
    strings: {
        importAlbum : 'Import an album',
        empty       : 'You have not imported any photo yet',
        myProfile   : 'My profile',
        profilePhoto: 'Profile photo',
        about       : 'About me',
        photos      : 'Photos',
        questions   : 'Answers',
        interests   : 'Interests'
    }
};