import React, { PropTypes, Component } from 'react';
import * as InterestsActionCreators from '../../actions/InterestsActionCreators';
import translate from '../../i18n/Translate';

@translate('FilterContentButtons')
export default class FilterContentButtons extends Component {

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
        // Injected by @translate:
        strings       : PropTypes.object
    };

    constructor(props) {
        super(props);

        this.onVideosFilterClick = this.onVideosFilterClick.bind(this);
        this.onAudiosFilterClick = this.onAudiosFilterClick.bind(this);
        this.onImagesFilterClick = this.onImagesFilterClick.bind(this);
        this.onLinksFilterClick = this.onLinksFilterClick.bind(this);
        this.onChannelsFilterClick = this.onChannelsFilterClick.bind(this);

        this.state = {
            active: ''
        };
    }

    onVideosFilterClick() {
        this.filterContent(this.props, 'Video');
        this.setState({
            active: 'Video'
        });
    }

    onAudiosFilterClick() {
        this.filterContent(this.props, 'Audio');
        this.setState({
            active: 'Audio'
        });
    }

    onImagesFilterClick() {
        this.filterContent(this.props, 'Image');
        this.setState({
            active: 'Image'
        });
    }

    onLinksFilterClick() {
        this.filterContent(this.props, '');
        this.setState({
            active: ''
        });
    }

    onChannelsFilterClick() {
        this.filterContent(this.props, 'Creator');
        this.setState({
            active: 'Creator'
        });
    }

    filterContent = function(props, type) {
        InterestsActionCreators.resetInterests(props.userId);
        if (props.ownContent) {
            InterestsActionCreators.requestOwnInterests(props.userId, type);
        } else {
            InterestsActionCreators.requestComparedInterests(props.ownUserId, props.userId, type, props.commonContent);
        }
        if (typeof this.props.onClickHandler == 'function') {
            this.props.onClickHandler(type);
        }
    };

    render() {
        const {contentsCount, linksCount, audiosCount, videosCount, imagesCount, channelsCount, strings} = this.props;
        const {active} = this.state;
        return (
            <div className="filter-content-buttons">
                <div className="content-block">
                    <div className="filter-icons-row-wrapper">
                        <div className={active === 'Video' ? "icons-large-wrapper active" : "icons-large-wrapper"} onClick={this.onVideosFilterClick}>
                            <div className="icon icon-video"></div>
                            <div className="icons-large-text">{videosCount || 0}<br/>{strings.videos}</div>
                        </div>
                        <div className={active === 'Audio' ? "icons-large-wrapper active" : "icons-large-wrapper"} onClick={this.onAudiosFilterClick}>
                            <div className="icon icon-audio"></div>
                            <div className="icons-large-text">{audiosCount || 0}<br/>{strings.audios}</div>
                        </div>
                        <div className={active === 'Image' ? "icons-large-wrapper active" : "icons-large-wrapper"} onClick={this.onImagesFilterClick}>
                            <div className="icon icon-photo"></div>
                            <div className="icons-large-text">{imagesCount || 0}<br/>{strings.photos}</div>
                        </div>
                        <div className={active === '' ? "icons-large-wrapper active" : "icons-large-wrapper"} onClick={this.onLinksFilterClick}>
                            <div className="icon icon-web-site"></div>
                            <div className="icons-large-text">{linksCount || 0}<br/>{strings.websites}</div>
                        </div>
                        <div className={active === 'Creator' ? "icons-large-wrapper active" : "icons-large-wrapper"} onClick={this.onChannelsFilterClick}>
                            <div className="icon icon-channels"></div>
                            <div className="icons-large-text">{channelsCount || 0}<br/>{strings.channels}</div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

}

FilterContentButtons.defaultProps = {
    strings: {
        videos   : 'Videos',
        audios   : 'Audios',
        photos   : 'Photos',
        websites : 'All',
        people   : 'People',
        channels : 'Channels'
    }
};