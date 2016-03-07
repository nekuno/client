import React, { PropTypes, Component } from 'react';
import { Link } from 'react-router';
import shouldPureComponentUpdate from 'react-pure-render/function';
import * as InterestsActionCreators from '../../actions/InterestsActionCreators';

export default class FilterContentPopup extends Component {
    static propTypes = {
        userId: PropTypes.number.isRequired,
        contentsCount: PropTypes.number.isRequired,
        ownContent: PropTypes.bool.isRequired
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

    shouldComponentUpdate = shouldPureComponentUpdate;

    render() {
        const { userId, contentsCount } = this.props;
        const popupClass = this.props.ownContent ? 'popup popup-filter-contents tablet-fullscreen' : 'popup popup-filter-other-contents tablet-fullscreen';

        return (

            <div className={popupClass}>
                <div className="content-block">
                    <p><a className="close-popup">Cerrar</a></p>
                    <div className="popup-filter-contents-title title">{contentsCount} intereses</div>
                    <div className="filter-icons-row-wrapper">
                        <div className="icons-large-wrapper" onClick={this.onVideosFilterClick}>
                            <div className="icon icon-video"></div>
                            <div className="icons-large-text">Vídeos</div>
                        </div>
                        <div className="icons-large-wrapper" onClick={this.onAudiosFilterClick}>
                            <div className="icon icon-audio"></div>
                            <div className="icons-large-text">Audios</div>
                        </div>
                        <div className="icons-large-wrapper" onClick={this.onImagesFilterClick}>
                            <div className="icon icon-photo"></div>
                            <div className="icons-large-text">Fotos</div>
                        </div>
                    </div>
                    <div className="filter-icons-row-wrapper">
                        <div className="icons-large-wrapper" onClick={this.onLinksFilterClick}>
                            <div className="icon icon-web-site"></div>
                            <div className="icons-large-text">Sitios web</div>
                        </div>
                        <div className="icons-large-wrapper" onClick={this.onUsersFilterClick}>
                            <div className="icon icon-person"></div>
                            <div className="icons-large-text">Personas</div>
                        </div>
                        <div className="icons-large-wrapper" onClick={this.onChannelsFilterClick}>
                            <div className="icon icon-channels"></div>
                            <div className="icons-large-text">Canales</div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    onVideosFilterClick() {
        InterestsActionCreators.resetOwnInterests(this.props.userId);
        InterestsActionCreators.requestOwnInterests(this.props.userId, 'Video');
        nekunoApp.closeModal('.popup-filter-contents');
    }

    onAudiosFilterClick() {
        InterestsActionCreators.resetOwnInterests(this.props.userId);
        InterestsActionCreators.requestOwnInterests(this.props.userId, 'Audio');
        nekunoApp.closeModal('.popup-filter-contents');
    }

    onImagesFilterClick() {
        InterestsActionCreators.resetOwnInterests(this.props.userId);
        InterestsActionCreators.requestOwnInterests(this.props.userId, 'Image');
        nekunoApp.closeModal('.popup-filter-contents');
    }

    onLinksFilterClick() {
        InterestsActionCreators.resetOwnInterests(this.props.userId);
        InterestsActionCreators.requestOwnInterests(this.props.userId, '');
        nekunoApp.closeModal('.popup-filter-contents');
    }

    onUsersFilterClick() {
        InterestsActionCreators.resetOwnInterests(this.props.userId);
        InterestsActionCreators.requestOwnInterests(this.props.userId, '');
        nekunoApp.closeModal('.popup-filter-contents');
    }

    onChannelsFilterClick() {
        InterestsActionCreators.resetOwnInterests(this.props.userId);
        InterestsActionCreators.requestOwnInterests(this.props.userId, '');
        nekunoApp.closeModal('.popup-filter-contents');
    }
}
