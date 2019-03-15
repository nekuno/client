import PropTypes from 'prop-types';
import React, { Component } from 'react';
import TopNavBar from '../components/ui/TopNavBar';
import Image from '../components/ui/Image';
import EmptyMessage from '../components/ui/EmptyMessage/EmptyMessage';
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
    };

    static contextTypes = {
        router: PropTypes.object.isRequired
    };

    constructor(props) {
        super(props);

        this.handleScroll = this.handleScroll.bind(this);

        this.state = {
            importingAlbum: false
        };
    }

    componentWillMount() {
        if (this.props.albums.length === 0 && !this.props.noAlbums) {
            this.context.router.push('gallery');
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
                    this.context.router.push('gallery-album-photos');
                }, 500);
            }, (error) => { console.log(error) });
            this.setState({
                importingAlbum: true
            });
        }, (error) => { console.log(error) });
    }

    render() {
        const {albums, noAlbums, resource, strings} = this.props;
        return (
            <div className="views">
                <TopNavBar leftIcon={'left-arrow'} centerText={resource ? strings.albums.replace('%resource%', firstToUpperCase(resource)) : ''}/>
                <div className="view view-main" onScroll={this.handleScroll}>
                    <div className="page gallery-page">
                        <div id="page-content" className="gallery-content">
                            {noAlbums ? <EmptyMessage text={strings.empty}/> :
                                this.state.importingAlbum ? <EmptyMessage text={strings.importingAlbum} loadingGif={true}/> :
                                    albums.map(album =>
                                        <div key={album.id} className="import-album-wrapper photo-wrapper" onClick={this.importAlbum.bind(this, album.id, album.name)}>
                                            <div className="photo-absolute-wrapper">
                                                <Image src={album.thumbnail ? album.thumbnail : album.picture && album.picture.data.url ? album.picture.data.url : null}/>
                                            </div>
                                            <div className="text with-background">{album.name}</div>
                                        </div>
                                    )
                            }
                            <br />
                            <br />
                            <br />
                            <br />
                            <br />
                            <br />
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

GalleryAlbumsPage.defaultProps = {
    strings: {
        albums        : '%resource% albums',
        empty         : 'There are no albums',
        importingAlbum: 'Importing album'
    }
};