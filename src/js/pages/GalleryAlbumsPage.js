import React, { PropTypes, Component } from 'react';
import TopNavBar from '../components/ui/TopNavBar';
import EmptyMessage from '../components/ui/EmptyMessage';
import AuthenticatedComponent from '../components/AuthenticatedComponent';
import translate from '../i18n/Translate';
import connectToStores from '../utils/connectToStores';
import GalleryAlbumStore from '../stores/GalleryAlbumStore';
import GalleryAlbumActionCreators from '../actions/GalleryAlbumActionCreators';
import SocialNetworkService from '../services/SocialNetworkService';

function firstToUpperCase(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function getState() {
    const resource = GalleryAlbumStore.getResource();
    const scope = GalleryAlbumStore.getScope();
    const albums = GalleryAlbumStore.albums;
    const noAlbums = GalleryAlbumStore.noAlbums();
    return {
        resource,
        scope,
        albums,
        noAlbums
    };
}

@AuthenticatedComponent
@translate('GalleryAlbumsPage')
@connectToStores([GalleryAlbumStore], getState)
export default class GalleryAlbumsPage extends Component {

    static propTypes = {
        // Injected by @AuthenticatedComponent
        user: PropTypes.object.isRequired,
        // Injected by @translate:
        strings: PropTypes.object,
        // Injected by @connectToStores:
        resource: PropTypes.string.isRequired,
        albums: PropTypes.array.isRequired,
        noAlbums: PropTypes.bool
        //...
    };

    static contextTypes = {
        history: PropTypes.object.isRequired
    };

    constructor(props) {
        super(props);

        this.handleScroll = this.handleScroll.bind(this);
    }

    componentWillMount() {
        if (this.props.albums.length === 0 && !this.props.noAlbums) {
            this.context.history.pushState(null, 'gallery');
        }
    }

    handleScroll() {
        
    }

    importAlbum(id, name) {
        const {resource, scope} = this.props;
        SocialNetworkService.login(resource, scope).then(() => {
            GalleryAlbumActionCreators.getAlbum({
                id: id,
                name: name
            }, resource, scope).then(() => {
                window.setTimeout(() => {
                    this.context.history.pushState(null, 'gallery-album-photos');
                }, 500);
            }, (error) => { console.log(error) });
        }, (error) => { console.log(error) });
    }

    render() {
        const {albums, noAlbums, resource, strings} = this.props;
        return (
            <div className="view view-main" onScroll={this.handleScroll}>
                <TopNavBar leftIcon={'left-arrow'} centerText={resource ? strings.albums.replace('%resource%', firstToUpperCase(resource)) : ''}/>
                <div className="page gallery-page">
                    <div id="page-content" className="gallery-content">
                        {noAlbums ? <EmptyMessage text={strings.empty}/> : albums.map(album =>
                            <div key={album.id} className="import-album-wrapper photo-wrapper" onClick={this.importAlbum.bind(this, album.id, album.name)}>
                                <div className="icon-image"></div>
                                <div className="text">{album.name}</div>
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
            </div>
        );
    }
};

GalleryAlbumsPage.defaultProps = {
    strings: {
        albums     : '%resource% albums',
        empty      : 'There are no albums'
    }
};