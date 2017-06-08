import React, { PropTypes, Component } from 'react';
import TopNavBar from '../components/ui/TopNavBar';
import ToolBar from '../components/ui/ToolBar';
import ImageComponent from '../components/ui/Image';
import EmptyMessage from '../components/ui/EmptyMessage';
import ImportAlbumPopup from '../components/gallery/ImportAlbumPopup';
import AuthenticatedComponent from '../components/AuthenticatedComponent';
import translate from '../i18n/Translate';
import popup from '../components/Popup';
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
    const user = props.user;
    const noPhotos = false;
    const photos = GalleryPhotoStore.get(userId);
    const errors = GalleryPhotoStore.getErrors();
    const loadingPhoto = GalleryPhotoStore.getLoadingPhoto();
    const profilePhoto = user.photo ? user.photo.thumbnail.medium : '';
    return {
        photos,
        profilePhoto,
        noPhotos,
        errors,
        loadingPhoto
    };
}

@AuthenticatedComponent
@translate('GalleryPage')
@popup('popup-import-album')
@connectToStores([UserStore, GalleryPhotoStore], getState)
export default class GalleryPage extends Component {

    static propTypes = {
        // Injected by @AuthenticatedComponent
        user        : PropTypes.object.isRequired,
        // Injected by @translate:
        strings     : PropTypes.object,
        // Injected by @popup:
        showPopup     : PropTypes.func,
        closePopup     : PropTypes.func,
        popupContentRef     : PropTypes.func,
        // Injected by @connectToStores:
        photos      : PropTypes.array,
        profilePhoto: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
        noPhotos    : PropTypes.bool,
        loadingPhoto: PropTypes.bool
    };

    static contextTypes = {
        router: PropTypes.object.isRequired
    };

    constructor(props) {
        super(props);

        this.handleScroll = this.handleScroll.bind(this);
        this.importAlbum = this.importAlbum.bind(this);
        this.importAlbumPopUp = this.importAlbumPopUp.bind(this);
        this.goToPhotoGalleryPage = this.goToPhotoGalleryPage.bind(this);
        this.triggerUploadFile = this.triggerUploadFile.bind(this);
        this.uploadFile = this.uploadFile.bind(this);
        
        this.state = {
            importingAlbums: false    
        };
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
        window.setTimeout(() => { this.context.router.push('gallery-photo') }, 0);
    }

    importAlbumPopUp() {
        this.props.showPopup();
    }

    importAlbum(resource, scope) {
        this.props.closePopup();
        const force = WorkerStore.isConnected(resource) ? null : true;
        SocialNetworkService.login(resource, scope, force).then(() => {
            ConnectActionCreators.connect(resource, SocialNetworkService.getAccessToken(resource), SocialNetworkService.getResourceId(resource), SocialNetworkService.getExpireTime(resource), SocialNetworkService.getRefreshToken(resource));
            GalleryAlbumActionCreators.getAlbums(resource, scope).then(() => {
                window.setTimeout(() => {
                    this.context.router.push('gallery-albums')
                }, 500);
            }, (error) => { console.log(error) });
            this.setState({
                importingAlbums: true
            });
        }, (error) => { console.log(error) });
    }

    triggerUploadFile() {
        this.props.closePopup();
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
        const {strings} = this.props;
        var files;
        if (e.dataTransfer) {
            files = e.dataTransfer.files;
        } else if (e.target) {
            files = e.target.files;
        }
        if (typeof files[0] !== 'undefined') {
            if (!this.isValidMimetype(files[0].type)) {
                nekunoApp.alert(strings.invalidMimeType);
                return;
            }
            const userId = parseId(this.props.user);
            this.savePhoto(userId, files[0]);
        }
    }

    savePhoto(userId, file) {
        const MAX_WIDTH = 2048;
        const MAX_HEIGHT = 2048;

        let reader = new FileReader();
        reader.onload = function(fileLoadedEvent) {
            let canvas = document.createElement('canvas');
            let img = new Image();

            img.onload = function () {
                let ctx = canvas.getContext("2d");
                ctx.drawImage(img, 0, 0);

                let width = img.width;
                let height = img.height;

                if (width > height) {
                    if (width > MAX_WIDTH) {
                        height *= MAX_WIDTH / width;
                        width = MAX_WIDTH;
                    }
                } else {
                    if (height > MAX_HEIGHT) {
                        width *= MAX_HEIGHT / height;
                        height = MAX_HEIGHT;
                    }
                }
                canvas.width = width;
                canvas.height = height;
                ctx = canvas.getContext("2d");
                ctx.drawImage(img, 0, 0, width, height);

                const mimeType = fileLoadedEvent.target.result
                    .substr(5, 20)
                    .replace(/;base64,.*/, "");

                let base64 = canvas.toDataURL(mimeType);
                if(!base64.search(mimeType) >= 0) {
                    // image/png is always supported
                    base64 = canvas.toDataURL("image/png");
                }

                GalleryPhotoActionCreators.postPhoto(userId, {
                    base64: base64.replace(/^data:image\/(.+);base64,/, "")
                });
            };
            img.src = fileLoadedEvent.target.result;

        };
        reader.readAsDataURL(file);
    }

    isValidMimetype = function (mimeType) {
        switch (mimeType) {
            case 'image/png':
            case 'image/jpeg':
            case 'image/gif':
                return true;
        }

        return false;
    };

    render() {
        const {user, photos, profilePhoto, noPhotos, loadingPhoto, strings} = this.props;
        return (
            <div className="views">
                <TopNavBar leftMenuIcon={true} centerText={strings.myProfile} rightIcon={'uploadthin'} rightIconsWithoutCircle={true} onRightLinkClickHandler={this.importAlbumPopUp}/>
                <ToolBar links={[
                    {'url': `/p/${user.slug}`, 'text': strings.about},
                    {'url': '/gallery', 'text': strings.photos},
                    {'url': '/questions', 'text': strings.questions},
                    {'url': '/interests', 'text': strings.interests}
                ]} activeLinkIndex={1} arrowUpLeft={'36%'} />
                <div className="view view-main" onScroll={this.handleScroll}>
                    <input style={{opacity: 0}} type='file' ref='fileInput' onChange={this.uploadFile} />
                    <div className="page gallery-page">
                        {this.state.importingAlbums ? <EmptyMessage text={strings.importingAlbums} loadingGif={true}/>
                            :
                            <div id="page-content" className="gallery-content">
                                <div className="import-album-wrapper photo-wrapper" onClick={this.importAlbumPopUp}>
                                    <div className="icon-image"></div>
                                    <div className="text">{strings.importAlbum}</div>
                                </div>
                                {profilePhoto ?
                                    <div className="photo-wrapper" onClick={this.goToPhotoGalleryPage.bind(this, profilePhoto)}>
                                        <div className="photo-absolute-wrapper">
                                            <ImageComponent src={profilePhoto}/>
                                        </div>
                                        <div className="profile-photo-text"><span className="icon-person"></span><div className="text">&nbsp;{strings.profilePhoto}</div></div>
                                    </div>
                                    : null}
                                {noPhotos ? <EmptyMessage text={strings.empty}/> : photos.map(photo =>
                                    <div key={photo.id} className="photo-wrapper" onClick={this.goToPhotoGalleryPage.bind(this, photo)}>
                                        <div className="photo-absolute-wrapper">
                                            <ImageComponent src={photo.thumbnail.small}/>
                                        </div>
                                    </div>
                                )}
                                {loadingPhoto ?
                                    <div className="photo-loading-wrapper photo-wrapper">
                                        <div className="loading-gif"></div>
                                    </div>
                                    : null}
                                <br />
                                <br />
                                <br />
                                <br />
                                <br />
                                <br />
                            </div>
                        }
                    </div>
                    <ImportAlbumPopup onAlbumClickHandler={this.importAlbum} onFileUploadClickHandler={this.triggerUploadFile} contentRef={this.props.popupContentRef}/>
                </div>
            </div>
        );
    }
};

GalleryPage.defaultProps = {
    strings: {
        importAlbum    : 'Import photos',
        empty          : 'You have not imported any photo yet',
        myProfile      : 'My profile',
        profilePhoto   : 'Profile photo',
        about          : 'About me',
        photos         : 'Photos',
        questions      : 'Answers',
        interests      : 'Interests',
        importingAlbums: 'Importing albums',
        invalidMimeType: 'Invalid image'
    }
};