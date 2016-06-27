import React, { PropTypes, Component } from 'react';
import ProgressBar from './ProgressBar';
import Button from './Button';
import CardIcons from './CardIcons';
import Image from './Image';
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
        rate          : PropTypes.bool,
        hideLikeButton: PropTypes.bool.isRequired,
        fixedHeight   : PropTypes.bool,
        loggedUserId  : PropTypes.number.isRequired,
        onClickHandler: PropTypes.func,
        // Injected by @translate:
        strings       : PropTypes.object
    };

    constructor(props) {
        super(props);

        this.onRate = this.onRate.bind(this);
        this.handleClick = this.handleClick.bind(this);

        this.state = {
            embedHtml: null
        }
    }

    onRate() {
        const {loggedUserId, contentId} = this.props;
        if (!this.props.rate) {
            UserActionCreators.likeContent(loggedUserId, contentId);
        } else {
            UserActionCreators.deleteLikeContent(loggedUserId, contentId);
        }
    }

    handleClick() {
        const {url, types, embed_type, embed_id, onClickHandler} = this.props;
        if (typeof onClickHandler !== 'undefined') {
            onClickHandler();
        } else {
            const isVideo = types.indexOf('Video') > -1;
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
                html = <iframe class="discover-video" src={'https://www.youtube.com/embed/' + embed_id + '?autoplay=1'} frameBorder="0" allowFullScreen width="255"></iframe>;
                break;
            default:
                break;
        }
        
        this.setState({
            embedHtml: html
        });
    };

    render() {
        const {title, description, types, rate, hideLikeButton, fixedHeight, thumbnail, url, matching, strings} = this.props;
        const cardTitle = title ? <div>{title.substr(0, 20)}{title.length > 20 ? '...' : ''}</div> : <div> {strings.emptyTitle} </div>;
        const subTitle = description ? <div>{description.substr(0, 20)}{description.length > 20 ? '...' : ''}</div> : fixedHeight ? <div>&nbsp;</div> : '';
        const likeButtonText = rate ? strings.unlike : strings.like;
        const likeButton = hideLikeButton ? '' : <div className="like-button-container"><Button {...this.props} onClick={this.onRate}>{likeButtonText}</Button></div>;
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
            <div className="card person-card">
                {isImage ? '' :
                    <div className="card-header" onClick={this.handleClick}>
                        <a>
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
                            <a>
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
                {likeButton ?
                    <div className="card-footer">
                        {likeButton}
                    </div>
                    : ''
                }
            </div>
        );
    }

}

CardContent.defaultProps = {
    strings: {
        like         : 'Like',
        unlike       : 'Remove',
        compatibility: 'Compatibility',
        emptyTitle   : 'Title'
    }
};