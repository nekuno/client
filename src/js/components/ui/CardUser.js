import React, { PropTypes, Component } from 'react';
import { Link } from 'react-router';
import ProgressBar from './ProgressBar';
import Button from './Button';
import Image from './Image';
import * as UserActionCreators from '../../actions/UserActionCreators'
import translate from '../../i18n/Translate';

@translate('CardUser')
export default class CardUser extends Component {

    static contextTypes = {
        history: PropTypes.object.isRequired
    };

    static propTypes = {
        userId        : PropTypes.number.isRequired,
        username      : PropTypes.string.isRequired,
        location      : PropTypes.string,
        canSendMessage: PropTypes.bool.isRequired,
        photo         : PropTypes.object,
        matching      : PropTypes.number.isRequired,
        age           : PropTypes.number,
        like          : PropTypes.number,
        hideLikeButton: PropTypes.bool.isRequired,
        loggedUserId  : PropTypes.number.isRequired,
        // Injected by @translate:
        strings       : PropTypes.object
    };

    constructor(props) {
        super(props);

        this.onLikeOrDislike = this.onLikeOrDislike.bind(this);
        this.handleMessage = this.handleMessage.bind(this);
    }

    onLikeOrDislike() {
        const {like, loggedUserId, userId} = this.props;
        if (!like || like === -1) {
            UserActionCreators.likeUser(loggedUserId, userId);
        } else {
            UserActionCreators.deleteLikeUser(loggedUserId, userId);
        }
    }

    handleMessage() {
        this.context.history.pushState(null, `/conversations/${this.props.userId}`);
    }

    render() {
        const {strings, location, canSendMessage, like, hideLikeButton, photo, userId, username, matching, age} = this.props;
        const subTitle = <div><span className="icon-marker"></span>{location.substr(0, 20)}{location.length > 20 ? '...' : ''} - {strings.age}: {age}</div>;
        const messageButton = canSendMessage ? <span className="icon-message" onClick={this.handleMessage}></span> : '';
        const likeButtonText = like === null ? strings.saving : like ? strings.unlike : strings.like;
        const likeButton = hideLikeButton ? '' : <div className="like-button-container"><Button onClick={this.onLikeOrDislike} disabled={like === null ? 'disabled' : null}>{likeButtonText}</Button></div>;
        const defaultSrc = 'img/no-img/big.jpg';
        let imgSrc = photo ? photo.thumbnail.big : defaultSrc;

        return (
            <div className="card person-card">
                <div className="card-header">
                    <Link to={`/profile/${userId}`}>
                        <div className="card-title">
                            {username}
                        </div>
                    </Link>
                    <div className="card-sub-title">
                        {subTitle}
                    </div>
                    {/*<div className="send-message-button icon-wrapper">*/}
                    {/*{messageButton}*/}
                    {/*</div>*/}
                </div>
                <div className="card-content">
                    <div className="card-content-inner">
                        <Link to={`/profile/${userId}`}>
                            <div className="image fixed-height-image">
                                <Image src={imgSrc} defaultSrc={defaultSrc}/>
                            </div>
                        </Link>
                        <div className="matching">
                            <div className="matching-value">{strings.matching} {matching ? matching + '%' : '0%'}</div>
                            <ProgressBar percentage={matching}/>
                        </div>
                    </div>
                </div>
                <div className="card-footer">
                    {likeButton}
                </div>
            </div>
        );
    }

}

CardUser.defaultProps = {
    strings: {
        like    : 'Like',
        unlike  : 'Remove',
        matching: 'Matching',
        saving  : 'Saving...',
        age     : 'Age',
    }
};