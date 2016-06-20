import React, { PropTypes, Component } from 'react';
import TopNavBar from '../components/ui/TopNavBar';
import ToolBar from '../components/ui/ToolBar';
import Image from '../components/ui/Image';
import EmptyMessage from '../components/ui/EmptyMessage';
import AuthenticatedComponent from '../components/AuthenticatedComponent';
import translate from '../i18n/Translate';
import connectToStores from '../utils/connectToStores';
import * as UserActionCreators from '../actions/UserActionCreators';
import UserStore from '../stores/UserStore';

function requestData(props) {
    const userId = props.params.userId;
    UserActionCreators.requestUser(userId, ['username', 'email', 'picture', 'status']);
}

function getState(props) {
    const otherUserId = props.params.userId;
    const otherUser = UserStore.get(otherUserId);
    //TODO: Retrieve from store
    const noPhotos = false;
    // const photos = PhotoStore.get(otherUserId);
    return {
        otherUser,
        noPhotos
    };
}

@AuthenticatedComponent
@translate('OtherGalleryPage')
@connectToStores([UserStore], getState)
export default class OtherGalleryPage extends Component {

    static propTypes = {
        // Injected by React Router:
        params    : PropTypes.shape({
            userId: PropTypes.string.isRequired
        }).isRequired,
        // Injected by @AuthenticatedComponent
        user: PropTypes.object.isRequired,
        // Injected by @translate:
        strings: PropTypes.object,
        // Injected by @connectToStores:
        otherUser: PropTypes.object,
        noPhotos: PropTypes.bool
        //...
    };

    static contextTypes = {
        history: PropTypes.object.isRequired
    };

    constructor(props) {
        super(props);

        this.handleScroll = this.handleScroll.bind(this);
        this.goToOtherPhotoGalleryPage = this.goToOtherPhotoGalleryPage.bind(this);
    }

    componentWillMount() {
        requestData(this.props);
    }

    handleScroll() {
        //TODO: Will be paginated?
    }

    goToOtherPhotoGalleryPage() {
        //TODO: Trigger selectPhoto action (and save in PhotoStore, better than using photo ID in the URL)
        this.context.history.pushState(null, `/users/${this.props.params.userId}/other-gallery-photo`);
    }

    render() {
        const {otherUser, noPhotos, strings, params} = this.props;
        const otherUserId = params.userId;
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
                <TopNavBar leftMenuIcon={true} centerText={otherUser ? otherUser.username : ''}/>
                <div className="page gallery-page">
                    <div id="page-content" className="gallery-content">
                        {noPhotos ? <EmptyMessage text={strings.empty}/> : photos.map(photo => 
                            <div key={photo.id} className="photo-wrapper" onClick={this.goToOtherPhotoGalleryPage}>
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