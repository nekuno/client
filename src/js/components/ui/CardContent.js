import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { ORIGIN_CONTEXT } from '../../constants/Constants';
import ProgressBar from './ProgressBar';
import CardIcons from './CardIcons';
import Image from './Image';
import UserStore from '../../stores/UserStore';
import * as UserActionCreators from '../../actions/UserActionCreators'
import translate from '../../i18n/Translate';
import Shareservice from '../../services/ShareService';

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

    onDropDown() {
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

        nekunoApp.actions(buttons);
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
        Shareservice.share(title, url, this.onShareSuccess, this.onShareError, strings.copiedToClipboard);
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
        nekunoApp.alert(this.props.strings.shareError)
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
        nekunoApp.actions(buttons);
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
            default:
                break;
        }
        
        this.setState({
            embedHtml: html
        });
    };

    isFacebookLink = function (url) {
        return url.match(/^https?:\/\/(www\.)?facebook\.com(\/.*)?$/i);
    };

    preventDefault(e) {
        e.preventDefault();
    }

    render() {
        const {title, description, types, rate, hideLikeButton, fixedHeight, thumbnail, url, matching, strings} = this.props;
        const cardTitle = title ? title.length > 20 ? title.substr(0, 20) +  '...' : title : strings.emptyTitle;
        const subTitle = description ? <div>{description.substr(0, 20)}{description.length > 20 ? '...' : ''}</div> : fixedHeight ? <div>&nbsp;</div> : '';
        const imageClass = fixedHeight ? 'image fixed-max-height-image' : 'image';
        const isImage = types.indexOf('Image') > -1;
        const defaultSrc = 'img/default-content-image.jpg';
        let imgSrc = defaultSrc;
        if (thumbnail) {
            imgSrc = thumbnail;
        } else if (isImage) {
            imgSrc = url;
        }

        // TODO: Facebook type may be returned from brain
        let realTypes = types.slice(0);
        if (this.isFacebookLink(url)) {
            if (realTypes.some(type => type === 'Video')) {
                realTypes.push('FacebookVideo');
                const index = realTypes.findIndex(type => type === 'Video');
                realTypes.splice(index, 1);
            } else {
                realTypes.push('FacebookLink');
            }
        }

        return (
            <div className="card content-card">
                {isImage ?
                    <div className={"card-drop-down-menu"} onClick={this.onDropDown}>
                        <span className="icon-angle-down"></span>
                    </div>
                    :
                    <div className="card-header">
                        <div className={"card-drop-down-menu"} onClick={this.onDropDown}>
                            <span className="icon-angle-down"></span>
                        </div>
                        <div className="card-title" onClick={this.handleClick}>
                            <a href={url} onClick={this.preventDefault}>
                                {cardTitle}
                            </a>
                        </div>
                        <div className="card-sub-title" onClick={this.handleClick}>
                            {subTitle}
                        </div>
                    </div>
                }
                <div className="card-icons" onClick={this.handleClick}>
                    <CardIcons types={realTypes}/>
                </div>
                <div className="card-content" onClick={this.handleClick}>
                    <div className="card-content-inner">
                        {this.state.embedHtml ? this.state.embedHtml :
                            <a href={url} onClick={this.preventDefault}>
                                <div className={imageClass}>
                                    <Image src={imgSrc} defaultSrc={defaultSrc}/>
                                </div>
                            </a>
                        }
                        {!this.state.embedHtml && typeof matching !== 'undefined' ?
                            <div className="matching">
                                <div className="matching-value">{strings.compatibility} {matching ? matching + '%' : '?'}</div>
                                <ProgressBar percentage={matching}/>
                            </div>
                            :
                            null
                        }

                    </div>
                </div>
                {!hideLikeButton ?
                    <div className="card-footer">
                        <div className="like-button icon-wrapper" onClick={rate !== null ? this.onRate : null}>
                            <span className={rate === null ? 'icon-spinner rotation-animation' : rate && rate !== -1 ? 'icon-star yellow' : 'icon-star'}></span>
                        </div>
                        <div className="icon-wrapper" onClick={this.onShare}>
                            <span className="icon-share"></span>
                        </div>
                    </div>
                    : ''
                }
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