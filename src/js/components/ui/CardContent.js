import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { ORIGIN_CONTEXT } from '../../constants/Constants';
import ProgressBar from './ProgressBar';
import Image from './Image';
import UserStore from '../../stores/UserStore';
import * as UserActionCreators from '../../actions/UserActionCreators'
import translate from '../../i18n/Translate';
import ShareService from '../../services/ShareService';
import LinkImageService from '../../services/LinkImageService';
import Framework7Service from '../../services/Framework7Service';

@translate('CardContent')
export default class CardContent extends Component {

    static propTypes = {
        contentId     : PropTypes.number.isRequired,
        title         : PropTypes.string,
        description   : PropTypes.string,
        types         : PropTypes.array.isRequired,
        url           : PropTypes.string.isRequired,
        embed_id      : PropTypes.string,
        embed_type    : PropTypes.string,
        thumbnail     : PropTypes.string,
        synonymous    : PropTypes.array.isRequired,
        matching      : PropTypes.number,
        rate          : PropTypes.oneOfType([PropTypes.number, PropTypes.bool]),
        hideLikeButton: PropTypes.bool.isRequired,
        fixedHeight   : PropTypes.bool,
        loggedUserId  : PropTypes.number.isRequired,
        onReport      : PropTypes.func,
        otherUserId   : PropTypes.number,
        // Injected by @translate:
        strings       : PropTypes.object
    };

    constructor(props) {
        super(props);

        this.onDropDown = this.onDropDown.bind(this);
        this.onRate = this.onRate.bind(this);
        this.onShare = this.onShare.bind(this);
        this.onReport = this.onReport.bind(this);
        this.handleClick = this.handleClick.bind(this);
        this.onShareSuccess = this.onShareSuccess.bind(this);
        this.onShareError = this.onShareError.bind(this);

        this.state = {
            embedHtml: null
        }
    }

    componentDidMount() {
        if (!window.cordova && this.state.embedHtml && this.props.embed_type === 'facebook') {
            FB.XFBML.parse();
        }
    }

    componentDidUpdate() {
        if (!window.cordova && this.state.embedHtml && this.props.embed_type === 'facebook') {
            FB.XFBML.parse();
        }
    }

    onDropDown(e) {
        e.stopPropagation();

        const {rate, title, strings} = this.props;
        const likeText = rate ? strings.unlike : strings.like;
        let buttons = [
            {
                text: title,
                label: true
            },
            {
                color: 'gray',
                text: '<span class="icon-star"></span> ' + likeText,
                onClick: this.onRate
            },
            {
                color: 'gray',
                text: '<span class="icon-share"></span> ' + strings.share,
                onClick: this.onShare
            }
        ];
        if (this.props.onReport) {
            buttons.push(
                {
                    color: 'gray',
                    text: '<span class="icon-warning"></span> ' + strings.report,
                    onClick: this.onReport
                }
            );
        }
        buttons.push(
            {
                color: 'red',
                text: strings.cancel
            }
        );

        Framework7Service.nekunoApp().actions(buttons);
    }

    onRate() {
        const {loggedUserId, otherUserId, contentId, rate} = this.props;
        if (!rate) {
            const originContext = otherUserId ? ORIGIN_CONTEXT.OTHER_INTERESTS_PAGE : ORIGIN_CONTEXT.OWN_INTERESTS_PAGE;
            const originName = otherUserId && UserStore.get(otherUserId) ? UserStore.get(otherUserId).username : null;
            UserActionCreators.likeContent(loggedUserId, contentId, originContext, originName);
        } else {
            UserActionCreators.deleteRateContent(loggedUserId, contentId);
        }
    }

    onShare() {
        const {title, url, strings} = this.props;
        ShareService.share(title, url, this.onShareSuccess, this.onShareError, strings.copiedToClipboard);
    }
    
    onShareSuccess() {
        const {loggedUserId, otherUserId, contentId, rate} = this.props;
        if (!rate) {
            const originContext = otherUserId ? ORIGIN_CONTEXT.OTHER_INTERESTS_PAGE : ORIGIN_CONTEXT.OWN_INTERESTS_PAGE;
            const originName = otherUserId ? otherUserId : null;
            UserActionCreators.likeContent(loggedUserId, contentId, originContext, originName);
        }
    }

    onShareError() {
        Framework7Service.nekunoApp().alert(this.props.strings.shareError)
    }

    onReport() {
        const {strings} = this.props;
        const buttons = [
            {
                color: 'gray',
                text: strings.notInteresting,
                onClick: this.onReportReason.bind(this, 'not interesting')
            },
            {
                color: 'gray',
                text: strings.harmful,
                onClick: this.onReportReason.bind(this, 'harmful')
            },
            {
                color: 'gray',
                text: strings.spam,
                onClick: this.onReportReason.bind(this, 'spam')
            },
            {
                color: 'gray',
                text: strings.otherReasons,
                onClick: this.onReportReason.bind(this, 'other')
            },
            {
                color: 'red',
                text: strings.cancel
            }
        ];
        Framework7Service.nekunoApp().actions(buttons);
    }

    onReportReason(reason) {
        const {loggedUserId, contentId, rate} = this.props;
        if (rate) {
            UserActionCreators.deleteRateContent(loggedUserId, contentId);
        }
        setTimeout(() => this.props.onReport(contentId, reason), 0);

    }

    handleClick() {
        const {url, types, embed_type, embed_id} = this.props;

        const isVideo = types.indexOf('Video') > -1;
        if (isVideo && !window.cordova && window.screen.width > 320) {
            this.preVisualizeVideo(embed_type, embed_id, url);
        } else {
            window.cordova ? document.location = url : window.open(url);
        }

    }

    preVisualizeVideo = function (embed_type, embed_id, url) {
        let html = null;
        switch (embed_type) {
            case 'youtube':
                html = <iframe className="discover-video" src={'https://www.youtube.com/embed/' + embed_id + '?autoplay=1'} frameBorder="0" allowFullScreen></iframe>;
                break;
            case 'facebook':
                html = <div className="fb-video" data-href={url} data-show-text="false" data-autoplay="true"></div>;
                break;
            case 'tumblr':
                html = <div dangerouslySetInnerHTML={{__html: embed_id.replace('<video', '<video controls style="width: 100%"')}}></div>;
                break;
            default:
                break;
        }
        
        this.setState({
            embedHtml: html
        });
    };

    preventDefault(e) {
        e.preventDefault();
    }

    render() {
        const {title, description, types, rate, hideLikeButton, fixedHeight, thumbnail, url, matching, strings} = this.props;
        const cardTitle = title ? title.length > 25 ? title.substr(0, 25) +  '...' : title : strings.emptyTitle;
        const subTitle = description ? (description.substr(0, 40) + (description.length > 40 ? '...' : '')) : '';
        const imageClass = fixedHeight ? 'image fixed-max-height-image' : 'image';
        const isImage = types.indexOf('Image') > -1;
        const defaultSrc = 'img/default-content-image.jpg';
        let imgSrc = defaultSrc;
        if (thumbnail) {
            imgSrc = thumbnail;
        } else if (isImage) {
            imgSrc = url;
        }
        imgSrc = LinkImageService.getThumbnail(imgSrc, 'medium');

        let network = null;
        const networkIndex = types.findIndex(type => type.length > 4 && type.substr(0, 4) === 'Link');
        if (networkIndex !== -1)
            network = types[networkIndex].substr(4);

        const contentIcons = {
            Video: 'play',
            Audio: 'music-note',
            Image: 'image-filter-hdr',
            Web: 'link-variant',
            Creator: 'rss',
            Game: 'gamepad-variant',
        };
        const contentIndex = types.findIndex({}.hasOwnProperty.bind(contentIcons));
        const contentIcon = contentIcons[types[contentIndex]];

        return (
            <div className="card content-card" onClick={this.handleClick}>
                <div className="card-content" style={{ backgroundImage: `url(${imgSrc || defaultSrc})` }}>
                    {this.state.embedHtml ?
                        <div className="card-content-embed">
                            {this.state.embedHtml}
                        </div>
                        :
                        <div className="card-content-overlay">
                            <div className={"card-drop-down-menu"} onClick={this.onDropDown}>
                                <span className="mdi mdi-dots-vertical"></span>
                            </div>
                        </div>
                    }
                </div>
                <div className="card-footer">
                    <div className="content-indicators">
                        {network ?
                            <div className="content-network">
                                <span className={`icon mdi mdi-${network.toLowerCase()}`}></span>
                                <span className="label">{network}</span>
                            </div>
                            : <div className="content-network"></div> }
                        {contentIcon ?
                            <div className="content-type">
                                <span className={`mdi mdi-${contentIcon}`}></span>
                            </div>
                            : '' }
                    </div>
                    
                    <div className="card-title">{cardTitle}</div>
                    <div className="card-sub-title">{subTitle}</div>
                </div>
            </div>
        );
    }

}

CardContent.defaultProps = {
    strings: {
        like             : 'Like',
        unlike           : 'Remove like',
        share            : 'Share',
        report           : 'Report',
        cancel           : 'Cancel',
        compatibility    : 'Compatibility',
        emptyTitle       : 'Title',
        copiedToClipboard: 'Copied to clipboard',
        shareError       : 'An error occurred sharing the content',
        saving           : 'Saving...',
        notInteresting   : 'I’m not interested in this content',
        harmful          : 'This content is abusive or harmful',
        spam             : 'This content is spam',
        otherReasons     : 'Other reasons',
    }
};