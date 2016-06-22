import React, { PropTypes, Component } from 'react';
import TopNavBar from '../components/ui/TopNavBar';
import ToolBar from '../components/ui/ToolBar';
import Image from '../components/ui/Image';
import EmptyMessage from '../components/ui/EmptyMessage';
import AuthenticatedComponent from '../components/AuthenticatedComponent';
import translate from '../i18n/Translate';
import connectToStores from '../utils/connectToStores';
import * as UserActionCreators from '../actions/UserActionCreators';
import GalleryPhotoActionCreators from '../actions/GalleryPhotoActionCreators';
import GalleryPhotoStore from '../stores/GalleryPhotoStore';
import UserStore from '../stores/UserStore';

function requestData(props) {
    const userId = props.params.userId;
    UserActionCreators.requestUser(userId, ['username', 'email', 'picture', 'status']);
    GalleryPhotoActionCreators.getOtherPhotos(userId);
}

function getState(props) {
    const otherUserId = props.params.userId;
    const otherUser = UserStore.get(otherUserId);
    const noPhotos = GalleryPhotoStore.noPhotos(otherUserId);
    const photos = GalleryPhotoStore.get(otherUserId);
    return {
        otherUser,
        photos,
        noPhotos
    };
}

@AuthenticatedComponent
@translate('OtherGalleryPage')
@connectToStores([UserStore], getState)
export default class OtherGalleryPage extends Component {

    static propTypes = {
        // Injected by React Router:
        params   : PropTypes.shape({
            userId: PropTypes.string.isRequired
        }).isRequired,
        // Injected by @AuthenticatedComponent
        user     : PropTypes.object.isRequired,
        // Injected by @translate:
        strings  : PropTypes.object,
        // Injected by @connectToStores:
        otherUser: PropTypes.object,
        noPhotos : PropTypes.bool,
        photos   : PropTypes.array
    };

    static contextTypes = {
        history: PropTypes.object.isRequired
    };

    constructor(props) {
        super(props);

        this.handleScroll = this.handleScroll.bind(this);
    }

    componentWillMount() {
        requestData(this.props);
    }

    handleScroll() {
        //TODO: Will be paginated?
    }

    goToOtherPhotoGalleryPage(photo) {
        GalleryPhotoActionCreators.selectPhoto(photo);
        this.context.history.pushState(null, `/users/${this.props.params.userId}/other-gallery-photo`);
    }

    render() {
        const {otherUser, photos, noPhotos, strings, params} = this.props;
        const otherUserId = params.userId;
        return (
            <div className="view view-main" onScroll={this.handleScroll}>
                <TopNavBar leftMenuIcon={true} centerText={otherUser ? otherUser.username : ''}/>
                <div className="page gallery-page">
                    <div id="page-content" className="gallery-content">
                        {noPhotos ? <EmptyMessage text={strings.empty}/> : photos.map(photo => 
                            <div key={photo.id} className="photo-wrapper" onClick={this.goToOtherPhotoGalleryPage.bind(this, photo)}>
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
                {otherUser ?
                    <ToolBar links={[
                    {'url': `/profile/${otherUserId}`, 'text': strings.about},
                    {'url': `/users/${otherUserId}/other-gallery`, 'text': strings.photos},
                    {'url': `/users/${otherUserId}/other-questions`, 'text': strings.questions},
                    {'url': `/users/${otherUserId}/other-interests`, 'text': strings.interests}
                    ]} activeLinkIndex={1} arrowUpLeft={'36%'}/>
                    :
                    ''}
            </div>
        );
    }
};

OtherGalleryPage.defaultProps = {
    strings: {
        empty    : 'User has not imported any photo yet',
        about    : 'About',
        photos   : 'Photos',
        questions: 'Answers',
        interests: 'Interests'
    }
};