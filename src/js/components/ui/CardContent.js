import React, { PropTypes, Component } from 'react';
import { ORIGIN_CONTEXT } from '../../constants/Constants';
import ProgressBar from './ProgressBar';
import CardIcons from './CardIcons';
import Image from './Image';
import UserStore from '../../stores/UserStore';
import * as UserActionCreators from '../../actions/UserActionCreators'
import translate from '../../i18n/Translate';

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
        onClickHandler: PropTypes.func,
        otherUserId   : PropTypes.number,
        // Injected by @translate:
        strings       : PropTypes.object
    };

    constructor(props) {
        super(props);

        this.onRate = this.onRate.bind(this);
        this.onShare = this.onShare.bind(this);
        this.handleClick = this.handleClick.bind(this);
        this.onShareSuccess = this.onShareSuccess.bind(this);
        this.onShareError = this.onShareError.bind(this);

        this.state = {
            embedHtml: null
        }
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
        if (window.cordova) {
            // this is the complete list of currently supported params you can pass to the plugin (all optional)
            var options = {
                //message: 'share this', // not supported on some apps (Facebook, Instagram)
                subject: title, // fi. for email
                url: url
                //chooserTitle: 'Pick an app' // Android only, you can override the default share sheet title
            };
            window.plugins.socialsharing.shareWithOptions(options, this.onShareSuccess, this.onShareError);
        } else {
            window.prompt(strings.copyToClipboard, url);
            this.onShareSuccess();
        }
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

    handleClick() {
        const {url, types, embed_type, embed_id, onClickHandler} = this.props;
        if (typeof onClickHandler !== 'undefined' && onClickHandler) {
            onClickHandler();
        } else {
            // TODO: Embed videos from FB too
            const isVideo = types.indexOf('Video') > -1 && embed_type === 'youtube';
            if (isVideo) {
                this.preVisualizeYoutube(embed_type, embed_id);
            } else {
                window.cordova ? document.location = url : window.open(url);
            }
        }
    }

    preVisualizeYoutube = function (embed_type, embed_id) {
        let html = null;
        switch (embed_type) {
            case 'youtube':
                html = <iframe className="discover-video" src={'https://www.youtube.com/embed/' + embed_id + '?autoplay=1'} frameBorder="0" allowFullScreen></iframe>;
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
        const cardTitle = title ? <div>{title.substr(0, 20)}{title.length > 20 ? '...' : ''}</div> : <div> {strings.emptyTitle} </div>;
        const subTitle = description ? <div>{description.substr(0, 20)}{description.length > 20 ? '...' : ''}</div> : fixedHeight ? <div>&nbsp;</div> : '';
        const imageClass = fixedHeight ? 'image fixed-height-image' : 'image';
        const isImage = types.indexOf('Image') > -1;
        const defaultSrc = 'img/default-content-image.jpg';
        let imgSrc = defaultSrc;
        if (thumbnail) {
            imgSrc = thumbnail;
        } else if (isImage) {
            imgSrc = url;
        }
        return (
            <div className="card content-card">
                {isImage ? '' :
                    <div className="card-header" onClick={this.handleClick}>
                        <a href={url} onClick={this.preventDefault}>
                            <div className="card-title">
                                {cardTitle}
                            </div>
                        </a>
                        <div className="card-sub-title">
                            {subTitle}
                        </div>
                    </div>
                }
                <div className="card-icons" onClick={this.handleClick}>
                    <CardIcons types={types}/>
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
        like           : 'Like',
        unlike         : 'Remove',
        compatibility  : 'Compatibility',
        emptyTitle     : 'Title',
        copyToClipboard: 'Copy to clipboard: Ctrl+C, Enter',
        shareError     : 'An error occurred sharing the content',
        saving         : 'Saving...'
    }
};