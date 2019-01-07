import PropTypes from 'prop-types';
import React, { Component } from 'react';
import styles from './CardContent.scss';
import CardIcons from '../CardIcons';
import Image from '../Image';
import LinkImageService from '../../../services/LinkImageService';

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
        imgSrc = LinkImageService.getThumbnail(imgSrc, 'medium');

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
                    <div className={styles.footer}>
                        <div className={styles.typeIcon}>

                        </div>
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