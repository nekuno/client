import React, { PropTypes, Component } from 'react';
import TopNavBar from '../components/ui/TopNavBar';
import ToolBar from '../components/ui/ToolBar';
import Image from '../components/ui/Image';
import AuthenticatedComponent from '../components/AuthenticatedComponent';
import translate from '../i18n/Translate';

@AuthenticatedComponent
@translate('GalleryPage')
export default class GalleryPage extends Component {

    static propTypes = {
        // Injected by @AuthenticatedComponent
        user: PropTypes.object.isRequired,
        // Injected by @translate:
        strings: PropTypes.object
        // Injected by @connectToStores:
        //...
    };

    onScroll() {

    }

    render() {
        const {strings} = this.props;
        //TODO: This is just an example
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
                        {photos.map(photo => 
                            <div className="photo-wrapper">
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
            </div>
        );
    }
};

GalleryPage.defaultProps = {
    strings: {
        myProfile: 'My profile',
        about    : 'About me',
        photos   : 'Photos',
        questions: 'Answers',
        interests: 'Interests'
    }
};