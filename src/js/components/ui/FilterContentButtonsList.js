import PropTypes from 'prop-types';
import React, { Component } from 'react';
import translate from '../../i18n/Translate';
import FilterContentButton from "./FilterContentButton";

@translate('FilterContentButtonsList')
export default class FilterContentButtonsList extends Component {

    static propTypes = {
        userId        : PropTypes.number.isRequired,
        contentsCount : PropTypes.number.isRequired,
        ownContent    : PropTypes.bool.isRequired,
        ownUserId     : PropTypes.number,
        onClickHandler: PropTypes.func,
        commonContent : PropTypes.number,
        linksCount    : PropTypes.number,
        audiosCount   : PropTypes.number,
        videosCount   : PropTypes.number,
        imagesCount   : PropTypes.number,
        channelsCount : PropTypes.number,
        gamesCount    : PropTypes.number,
        facebookCount : PropTypes.number,
        twitterCount  : PropTypes.number,
        youtubeCount  : PropTypes.number,
        spotifyCount  : PropTypes.number,
        tumblrCount   : PropTypes.number,
        steamCount    : PropTypes.number,
        instagramCount: PropTypes.number,
        loading       : PropTypes.bool,
        type          : PropTypes.string,
        // Injected by @translate:
        strings       : PropTypes.object
    };

    constructor(props) {
        super(props);
    }

    onFilterClick(type) {
        this.filterContent(this.props, type);
    }

    filterContent = function(props, type) {
        if (typeof this.props.onClickHandler === 'function') {
            this.props.onClickHandler(type);
        }
    };

    render() {
        const {linksCount, audiosCount, videosCount, imagesCount, channelsCount, gamesCount, facebookCount, twitterCount, youtubeCount, spotifyCount, tumblrCount, steamCount, instagramCount, strings, loading, type} = this.props;
        const metatype = type && (type.substring(0, 4) === 'Link' ? 'link' : 'content');

        return (
            <div className="filter-content-buttons">
                <div className="content-block">
                    <div className="filter-icons-row-wrapper">
                        <FilterContentButton text={''} count={facebookCount || 0} onClickHandler={this.onFilterClick.bind(this, 'LinkFacebook')} active={type === 'LinkFacebook'} grayed={metatype === 'link'} icon="facebook" loading={loading} wrapperClass="facebook-button-wrapper"/>
                        <FilterContentButton text={''} count={twitterCount || 0} onClickHandler={this.onFilterClick.bind(this, 'LinkTwitter')} active={type === 'LinkTwitter'} grayed={metatype === 'link'} icon="twitter" loading={loading} wrapperClass="twitter-button-wrapper"/>
                        <FilterContentButton text={''} count={youtubeCount || 0} onClickHandler={this.onFilterClick.bind(this, 'LinkYoutube')} active={type === 'LinkYoutube'} grayed={metatype === 'link'} icon="youtube" loading={loading} wrapperClass="youtube-button-wrapper"/>
                        <FilterContentButton text={''} count={spotifyCount || 0} onClickHandler={this.onFilterClick.bind(this, 'LinkSpotify')} active={type === 'LinkSpotify'} grayed={metatype === 'link'} icon="spotify" loading={loading} wrapperClass="spotify-button-wrapper"/>
                        <FilterContentButton text={''} count={tumblrCount || 0} onClickHandler={this.onFilterClick.bind(this, 'LinkTumblr')} active={type === 'LinkTumblr'} grayed={metatype === 'link'} icon="tumblr" loading={loading} wrapperClass="tumblr-button-wrapper"/>
                        <FilterContentButton text={''} count={steamCount || 0} onClickHandler={this.onFilterClick.bind(this, 'LinkSteam')} active={type === 'LinkSteam'} grayed={metatype === 'link'} icon="steam" loading={loading} wrapperClass="steam-button-wrapper"/>
                        <FilterContentButton text={''} count={instagramCount || 0} onClickHandler={this.onFilterClick.bind(this, 'LinkInstagram')} active={type === 'LinkInstagram'} grayed={metatype === 'link'} icon="instagram" loading={loading} wrapperClass="instagram-button-wrapper"/>
                    </div>
                    
                    <div className="filter-icons-row-wrapper">
                        <span className="placeholder"></span>
                        <FilterContentButton text={strings.videos} count={videosCount || 0} onClickHandler={this.onFilterClick.bind(this, 'Video')} active={type === 'Video'} grayed={metatype === 'content'} icon="play" loading={loading}/>
                        <FilterContentButton text={strings.audios} count={audiosCount || 0} onClickHandler={this.onFilterClick.bind(this, 'Audio')} active={type === 'Audio'} grayed={metatype === 'content'} icon="music-note" loading={loading}/>
                        <FilterContentButton text={strings.photos} count={imagesCount || 0} onClickHandler={this.onFilterClick.bind(this, 'Image')} active={type === 'Image'} grayed={metatype === 'content'} icon="image-filter-hdr" loading={loading}/>
                        <FilterContentButton text={strings.websites} count={linksCount || 0} onClickHandler={this.onFilterClick.bind(this, 'Web')} active={type === 'Web'} grayed={metatype === 'content'} icon="link-variant" loading={loading}/>
                        <FilterContentButton text={strings.channels} count={channelsCount || 0} onClickHandler={this.onFilterClick.bind(this, 'Creator')} active={type === 'Creator'} grayed={metatype === 'content'} icon="rss" loading={loading}/>
                        <FilterContentButton text={strings.games} count={gamesCount || 0} onClickHandler={this.onFilterClick.bind(this, 'Game')} active={type === 'Game'} grayed={metatype === 'content'} icon="gamepad-variant" loading={loading}/>
                        <span className="placeholder"></span>
                    </div>
                </div>
            </div>
        );
    }
}

FilterContentButtonsList.defaultProps = {
    strings: {
        videos   : 'Videos',
        audios   : 'Audios',
        photos   : 'Photos',
        websites : 'Links',
        people   : 'People',
        channels : 'Channels',
        games    : 'Games',
        facebook : 'Facebook',
        twitter  : 'Twitter',
        youtube  : 'Youtube',
        spotify  : 'Spotify',
        tumblr   : 'Tumblr',
        steam    : 'Steam',
        instagram: 'Instagram'
    },
    loading: false,
    type   : ''
};