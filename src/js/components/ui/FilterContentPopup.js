import React, { PropTypes, Component } from 'react';
import * as InterestsActionCreators from '../../actions/InterestsActionCreators';
import translate from '../../i18n/Translate';

@translate('FilterContentPopup')
export default class FilterContentPopup extends Component {

    static propTypes = {
        userId        : PropTypes.number.isRequired,
        contentsCount : PropTypes.number.isRequired,
        ownContent    : PropTypes.bool.isRequired,
        ownUserId     : PropTypes.number,
        onClickHandler: PropTypes.func,
        commonContent : PropTypes.number,
        // Injected by @translate:
        strings       : PropTypes.object
    };

    constructor(props) {
        super(props);

        this.onVideosFilterClick = this.onVideosFilterClick.bind(this);
        this.onAudiosFilterClick = this.onAudiosFilterClick.bind(this);
        this.onImagesFilterClick = this.onImagesFilterClick.bind(this);
        this.onLinksFilterClick = this.onLinksFilterClick.bind(this);
        this.onUsersFilterClick = this.onUsersFilterClick.bind(this);
        this.onChannelsFilterClick = this.onChannelsFilterClick.bind(this);
    }

    onVideosFilterClick() {
        this.filterContent(this.props, 'Video');
    }

    onAudiosFilterClick() {
        this.filterContent(this.props, 'Audio');
    }

    onImagesFilterClick() {
        this.filterContent(this.props, 'Image');
    }

    onLinksFilterClick() {
        this.filterContent(this.props, '');
    }

    onUsersFilterClick() {
        this.filterContent(this.props, '');
    }

    onChannelsFilterClick() {
        this.filterContent(this.props, 'Creator');
    }

    filterContent = function(props, type) {
        InterestsActionCreators.resetInterests(props.userId);
        if (props.ownContent) {
            InterestsActionCreators.requestOwnInterests(props.userId, type);
            nekunoApp.closeModal('.popup-filter-contents');
        } else {
            InterestsActionCreators.requestComparedInterests(props.ownUserId, props.userId, type, props.commonContent);
            nekunoApp.closeModal('.popup-filter-other-contents');
        }
        if (typeof this.props.onClickHandler == 'function') {
            this.props.onClickHandler(type);
        }
    };

    render() {
        const {contentsCount, strings} = this.props;
        const popupClass = this.props.ownContent ? 'popup popup-filter-contents tablet-fullscreen' : 'popup popup-filter-other-contents tablet-fullscreen';

        return (

            <div className={popupClass}>
                <div className="content-block">
                    <p><a className="close-popup">{strings.close}</a></p>
                    <div className="popup-filter-contents-title title">{contentsCount} {strings.interests}</div>
                    <div className="filter-icons-row-wrapper">
                        <div className="icons-large-wrapper" onClick={this.onVideosFilterClick}>
                            <div className="icon icon-video"></div>
                            <div className="icons-large-text">{strings.videos}</div>
                        </div>
                        <div className="icons-large-wrapper" onClick={this.onAudiosFilterClick}>
                            <div className="icon icon-audio"></div>
                            <div className="icons-large-text">{strings.audios}</div>
                        </div>
                        <div className="icons-large-wrapper" onClick={this.onImagesFilterClick}>
                            <div className="icon icon-photo"></div>
                            <div className="icons-large-text">{strings.photos}</div>
                        </div>
                    </div>
                    <div className="filter-icons-row-wrapper">
                        <div className="icons-large-wrapper" onClick={this.onLinksFilterClick}>
                            <div className="icon icon-web-site"></div>
                            <div className="icons-large-text">{strings.websites}</div>
                        </div>
                        {/*<div className="icons-large-wrapper" onClick={this.onUsersFilterClick}>
                         <div className="icon icon-person"></div>
                         <div className="icons-large-text">{strings.people}</div>
                         </div>*/}
                        <div className="icons-large-wrapper" onClick={this.onChannelsFilterClick}>
                            <div className="icon icon-channels"></div>
                            <div className="icons-large-text">{strings.channels}</div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

}

FilterContentPopup.defaultProps = {
    strings: {
        close    : 'Close',
        interests: 'interests',
        videos   : 'Videos',
        audios   : 'Audios',
        photos   : 'Photos',
        websites : 'All',
        people   : 'People',
        channels : 'Channels'
    }
};