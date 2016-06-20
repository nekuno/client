import React, { PropTypes, Component } from 'react';
import TopNavBar from '../components/ui/TopNavBar';
import ToolBar from '../components/ui/ToolBar';
import Image from '../components/ui/Image';
import EmptyMessage from '../components/ui/EmptyMessage';
import ImportAlbumPopup from '../components/gallery/ImportAlbumPopup';
import AuthenticatedComponent from '../components/AuthenticatedComponent';
import translate from '../i18n/Translate';
import connectToStores from '../utils/connectToStores';
import ConnectActionCreators from '../actions/ConnectActionCreators';

function parseId(user) {
    return user.qnoow_id;
}

function getState(props) {
    const userId = parseId(props.user);
    //TODO: Retrieve from store
    const noPhotos = false;
    // const photos = PhotoStore.get(userId);
    return {
        noPhotos
    };
}

@AuthenticatedComponent
@translate('GalleryPage')
@connectToStores([], getState)
export default class GalleryPage extends Component {

    static propTypes = {
        // Injected by @AuthenticatedComponent
        user: PropTypes.object.isRequired,
        // Injected by @translate:
        strings: PropTypes.object,
        // Injected by @connectToStores:
        noPhotos: PropTypes.bool
        //...
    };

    static contextTypes = {
        history: PropTypes.object.isRequired
    };

    constructor(props) {
        super(props);

        this.handleScroll = this.handleScroll.bind(this);
        this.goToPhotoGalleryPage = this.goToPhotoGalleryPage.bind(this);
    }

    handleScroll() {
        //TODO: Will be paginated?
    }

    goToPhotoGalleryPage() {
        //TODO: Trigger selectPhoto action (and save in PhotoStore, better than using photo ID in the URL)
        this.context.history.pushState(null, 'gallery-photo');
    }

    importAlbumPopUp() {
        nekunoApp.popup('.popup-import-album');
    }

    importAlbum(resource, scope) {
        hello(resource).login({scope: scope}).then(function(response) {
            var accessToken = response.authResponse.access_token;
            console.log('accessToken:', accessToken);
            hello(resource).api('me/albums').then(function(status) {
                    console.log('api(\'me/albums\')', status);
                    var resourceId = status.id.toString();
                    console.log('resourceId: ', resourceId);
                    ConnectActionCreators.connect(resource, accessToken, resourceId)
                        .then(() => {

                        }, (error) => {
                            console.log(error);
                            nekunoApp.alert(error.error);
                        });
                },
                function(status) {
                    nekunoApp.alert(resource + ' login failed: ' + status.error.message);
                }
            )
        }, function(response) {
            nekunoApp.alert(resource + ' login failed: ' + response.error.message);
        });
    }

    render() {
        const {noPhotos, strings} = this.props;
        //TODO: This is just an example (photos should be retrieved from PhotoStore)
        const photos = [
            {
                id: 1,
                url: 'https://nekuno.com/media/cache/user_avatar_180x180/user/images/msalsas_1445885030.jpg'
            },
            {
                id: 4,
                url: 'https://nekuno.com/media/cache/resolve/user_avatar_180x180/user/images/juanlu_1446117933.jpg'
            },
            {
                id: 54,
                url: 'https://nekuno.com/media/cache/resolve/user_avatar_180x180/user/images/yawmoght_1446116493.jpg'
            },
            {
                id: 23,
                url: 'https://nekuno.com/media/cache/resolve/user_avatar_180x180/user/images/FranRE11_1447096348.jpg'
            },
            {
                id: 7768,
                url: 'https://nekuno.com/media/cache/resolve/user_avatar_180x180/user/images/eleanombre_1458332606.jpg'
            },
            {
                id: 4354,
                url: 'https://nekuno.com/media/cache/resolve/user_avatar_180x180/user/images/Neko_1446131816.jpg'
            },
            {
                id: 54344,
                url: 'https://nekuno.com/media/cache/resolve/user_avatar_180x180/user/images/Elena_1427625582.jpg'
            },
            {
                id: 54354,
                url: 'https://nekuno.com/media/cache/resolve/user_avatar_180x180/user/images/Pavel_1457487064.jpg'
            },
            {
                id: 436754,
                url: 'https://nekuno.com/media/cache/resolve/user_avatar_180x180/user/images/Irene_1437241367.jpg'
            },
            {
                id: 5433444,
                url: 'https://nekuno.com/media/cache/resolve/user_avatar_180x180/user/images/designroot_1440521816.jpg'
            }

        ];
        return (
            <div className="view view-main" onScroll={this.handleScroll}>
                <TopNavBar leftMenuIcon={true} centerText={strings.myProfile} rightIcon={'uploadthin'} rightIconsWithoutCircle={true}/>
                <div className="page gallery-page">
                    <div id="page-content" className="gallery-content">
                        <div className="import-album-wrapper photo-wrapper" onClick={this.importAlbumPopUp}>
                            <div className="icon-image"></div>
                            <p>{strings.importAlbum}</p>
                        </div>
                        {noPhotos ? <EmptyMessage text={strings.empty}/> : photos.map(photo => 
                            <div key={photo.id} className="photo-wrapper" onClick={this.goToPhotoGalleryPage}>
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
        importAlbum: 'Import an album',
        empty      : 'You have not imported any photo yet',
        myProfile  : 'My profile',
        about      : 'About me',
        photos     : 'Photos',
        questions  : 'Answers',
        interests  : 'Interests'
    }
};