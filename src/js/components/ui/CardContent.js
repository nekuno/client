import React, { PropTypes, Component } from 'react';
import { Link } from 'react-router';
import { IMAGES_ROOT } from '../../constants/Constants';
import * as UserActionCreators from '../../actions/UserActionCreators'
import ProgressBar from './ProgressBar';
import Button from './Button';
import CardIcons from './CardIcons';

/**
 * Set rate like.
 */
function setLikeContent(props) {

    const {loggedUserId, contentId} = props;

    UserActionCreators.likeContent(loggedUserId, contentId);
}

/**
 * Unset rate like.
 */
function unsetLikeContent(props) {
    const {loggedUserId, contentId} = props;

    UserActionCreators.deleteLikeContent(loggedUserId, contentId);
}

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
        onClickHandler: PropTypes.func
    };

    constructor(props) {
        super(props);

        this.onRate = this.onRate.bind(this);
        this.onClickHandler = this.onClickHandler.bind(this);
    }

    render() {
        const {title, description, types, rate, hideLikeButton, fixedHeight, thumbnail, url, matching} = this.props;
        const cardTitle = title ? <div>{title.substr(0, 20)}{title.length > 20 ? '...' : ''}</div> : <div>Link</div>;
        const subTitle = description ? <div>{description.substr(0, 20)}{description.length > 20 ? '...' : ''}</div> : fixedHeight ? <div>&nbsp;</div> : '';
        const likeButtonText = rate ? 'Quitar' : 'Me interesa';
        const likeButton = hideLikeButton ? '' : <div className="like-button-container"><Button {...this.props} onClick={this.onRate}>{likeButtonText}</Button></div>;
        const imageClass = fixedHeight ? 'image fixed-height-image' : 'image';
        let imgSrc = 'img/default-content-image.jpg';
        if (thumbnail) {
            imgSrc = thumbnail;
        } else if (types.indexOf('Image') > -1) {
            imgSrc = url;
        }
        return (
            <div className="card person-card">
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
                <div className="card-icons" onClick={this.onClickHandler}>
                    <CardIcons types={types}/>
                </div>
                <div className="card-content" onClick={this.onClickHandler}>
                    <div className="card-content-inner">
                        <a>
                            <div className={imageClass}>
                                <img src={imgSrc}/>
                            </div>
                        </a>
                        {typeof matching !== 'undefined' ?
                            <div className="matching">
                                <div className="matching-value">Compatibilidad {matching}%</div>
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

    onRate() {
        if (!this.props.rate) {
            setLikeContent(this.props);
        } else {
            unsetLikeContent(this.props);
        }
    }

    onClickHandler() {
        if (typeof this.props.onClickHandler !== 'undefined') {
            this.props.onClickHandler();
        } else {
            window.cordova ? document.location = this.props.url : window.open(this.props.url);
        }
    }
}