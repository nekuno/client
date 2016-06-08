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
        this.onClickHandler = this.onClickHandler.bind(this);
    }

    onRate() {
        const {loggedUserId, contentId} = this.props;
        if (!this.props.rate) {
            UserActionCreators.likeContent(loggedUserId, contentId);
        } else {
            UserActionCreators.deleteLikeContent(loggedUserId, contentId);
        }
    }

    onClickHandler() {
        if (typeof this.props.onClickHandler !== 'undefined') {
            this.props.onClickHandler();
        } else {
            window.cordova ? document.location = this.props.url : window.open(this.props.url);
        }
    }

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
                    <div className="card-header" onClick={this.onClickHandler}>
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
                <div className="card-icons" onClick={this.onClickHandler}>
                    <CardIcons types={types}/>
                </div>
                <div className="card-content" onClick={this.onClickHandler}>
                    <div className="card-content-inner">
                        <a>
                            <div className={imageClass}>
                                <Image src={imgSrc} defaultSrc={defaultSrc}/>
                            </div>
                        </a>
                        {typeof matching !== 'undefined' ?
                            <div className="matching">
                                <div className="matching-value">{strings.compatibilidy} {matching}%</div>
                                <ProgressBar percentage={matching}/>
                            </div>
                            :
                            ''
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