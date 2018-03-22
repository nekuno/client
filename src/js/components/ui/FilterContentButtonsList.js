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
        return (
            <div className="filter-content-buttons">
                <div className="content-block">
                    <div className="filter-icons-row-wrapper">
                        <FilterContentButton text={strings.videos} count={videosCount || 0} onClickHandler={this.onFilterClick.bind(this, 'Video')} active={type === 'Video'} icon="video" loading={loading}/>
                        <FilterContentButton text={strings.audios} count={audiosCount || 0} onClickHandler={this.onFilterClick.bind(this, 'Audio')} active={type === 'Audio'} icon="audio" loading={loading}/>
                        <FilterContentButton text={strings.photos} count={imagesCount || 0} onClickHandler={this.onFilterClick.bind(this, 'Image')} active={type === 'Image'} icon="photo" loading={loading}/>
                        <FilterContentButton text={strings.websites} count={linksCount || 0} onClickHandler={this.onFilterClick.bind(this, 'Web')} active={type === 'Web'} icon="web-site" loading={loading}/>
                        <FilterContentButton text={strings.channels} count={channelsCount || 0} onClickHandler={this.onFilterClick.bind(this, 'Creator')} active={type === 'Creator'} icon="channels" loading={loading}/>
                        <FilterContentButton text={strings.games} count={gamesCount || 0} onClickHandler={this.onFilterClick.bind(this, 'Game')} active={type === 'Game'} icon="gamepad" loading={loading}/>
                        <br/>
                        <FilterContentButton text={''} count={facebookCount || 0} onClickHandler={this.onFilterClick.bind(this, 'LinkFacebook')} active={type === 'LinkFacebook'} icon="facebook" loading={loading} wrapperClass="facebook-button-wrapper"/>
                        <FilterContentButton text={''} count={twitterCount || 0} onClickHandler={this.onFilterClick.bind(this, 'LinkTwitter')} active={type === 'LinkTwitter'} icon="twitter" loading={loading} wrapperClass="twitter-button-wrapper"/>
                        <FilterContentButton text={''} count={youtubeCount || 0} onClickHandler={this.onFilterClick.bind(this, 'LinkYoutube')} active={type === 'LinkYoutube'} icon="youtube" loading={loading} wrapperClass="youtube-button-wrapper"/>
                        <FilterContentButton text={''} count={spotifyCount || 0} onClickHandler={this.onFilterClick.bind(this, 'LinkSpotify')} active={type === 'LinkSpotify'} icon="spotify" loading={loading} wrapperClass="spotify-button-wrapper"/>
                        <FilterContentButton text={''} count={tumblrCount || 0} onClickHandler={this.onFilterClick.bind(this, 'LinkTumblr')} active={type === 'LinkTumblr'} icon="tumblr" loading={loading} wrapperClass="tumblr-button-wrapper"/>
                        <FilterContentButton text={''} count={steamCount || 0} onClickHandler={this.onFilterClick.bind(this, 'LinkSteam')} active={type === 'LinkSteam'} icon="steam" loading={loading} wrapperClass="steam-button-wrapper"/>
                        <FilterContentButton text={''} count={instagramCount || 0} onClickHandler={this.onFilterClick.bind(this, 'LinkInstagram')} active={type === 'LinkInstagram'} icon="instagram" loading={loading} wrapperClass="instagram-button-wrapper"/>
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