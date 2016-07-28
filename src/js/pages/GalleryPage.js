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
import WorkerStore from '../stores/WorkersStore';
import GalleryAlbumActionCreators from '../actions/GalleryAlbumActionCreators';
import GalleryPhotoActionCreators from '../actions/GalleryPhotoActionCreators';
import ConnectActionCreators from '../actions/ConnectActionCreators';
import SocialNetworkService from '../services/SocialNetworkService';

function parseId(user) {
    return user.id;
}

function requestData(props) {
    GalleryPhotoActionCreators.getPhotos(parseId(props.user));
}

function getState(props) {
    const userId = parseId(props.user);
    const noPhotos = false;
    const photos = GalleryPhotoStore.get(userId);
    const errors = GalleryPhotoStore.getErrors();
    const profilePhoto = props.user.picture ? `${IMAGES_ROOT}media/cache/resolve/user_avatar_180x180/user/images/${props.user.picture}` : '';
    return {
        photos,
        profilePhoto,
        noPhotos,
        errors
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
        requestData(this.props);
    }
    
    componentWillReceiveProps(nextProps) {
        if (nextProps.errors) {
            nekunoApp.alert(nextProps.errors);
        }
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
        SocialNetworkService.login(resource, scope).then(() => {
            if (!WorkerStore.isConnected(resource)) {
                ConnectActionCreators.connect(resource, SocialNetworkService.getAccessToken(resource), SocialNetworkService.getResourceId(resource), SocialNetworkService.getExpireTime(resource));
            }
            GalleryAlbumActionCreators.getAlbums(resource, scope).then(() => {
                window.setTimeout(() => {
                    this.context.history.pushState(null, 'gallery-albums')
                }, 500);
            }, (error) => { console.log(error) });
        }, (error) => { console.log(error) });
    }

    triggerUploadFile() {
        let {fileInput} = this.refs;
        if (document.createEvent) {
            var evt = document.createEvent('MouseEvents');
            evt.initEvent('click', true, false);
            fileInput.dispatchEvent(evt);
        } else if (document.createEventObject) {
            fileInput.fireEvent('onclick') ;
        } else if (typeof fileInput.onclick == 'function') {
            fileInput.onclick();
        }
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
            const userId = parseId(this.props.user);
            this.savePhoto(userId, files[0])
        }
    }

    savePhoto(userId, file) {
        var fileReader = new FileReader();

        fileReader.onload = function(fileLoadedEvent) {
            const base64 = fileLoadedEvent.target.result.replace(/^data:image\/(.+);base64,/, "");
            GalleryPhotoActionCreators.postPhoto(userId, {
                base64: base64
            });
        };
        fileReader.readAsDataURL(file);
    }

    render() {
        const {photos, profilePhoto, noPhotos, strings} = this.props;
        return (
            <div className="view view-main" onScroll={this.handleScroll}>
                <TopNavBar leftMenuIcon={true} centerText={strings.myProfile} rightIcon={'uploadthin'} rightIconsWithoutCircle={true} onRightLinkClickHandler={this.triggerUploadFile}/>
                <input style={{opacity: 0}} type='file' ref='fileInput' onChange={this.uploadFile} />
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
                                    <Image src={photo.thumbnail.small}/>
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