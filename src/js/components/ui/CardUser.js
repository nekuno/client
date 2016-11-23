import React, { PropTypes, Component } from 'react';
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
        profile       : PropTypes.object.isRequired,
        handleSelectProfile: PropTypes.func,

        // Injected by @translate:
        strings       : PropTypes.object
    };

    constructor(props) {
        super(props);

        this.onLikeOrDislike = this.onLikeOrDislike.bind(this);
        this.handleMessage = this.handleMessage.bind(this);
        this.handleGoToProfile = this.handleGoToProfile.bind(this);
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

    handleGoToProfile() {
        const {userId, profile} = this.props;
        if (!profile.orientation) {
            nekunoApp.popup('.popup-orientation-required');
            this.props.handleSelectProfile(userId);
        } else {
            this.context.history.pushState(null, `/profile/${userId}`);
        }
    }

    render() {
        const {location, canSendMessage, like, hideLikeButton, photo, userId, username, matching, age, strings} = this.props;
        const subTitle = <div><span className="icon-marker"></span>{location.substr(0, 15)}{location.length > 15 ? '...' : ''} - {strings.age}: {age}</div>;
        const messageButton = canSendMessage ? <span className="icon-message" onClick={this.handleMessage}></span> : '';
        const likeButtonText = like === null ? strings.saving : like ? strings.unlike : strings.like;
        const likeButton = hideLikeButton ? '' : <div className="like-button-container"><Button onClick={this.onLikeOrDislike} disabled={like === null ? 'disabled' : null}>{likeButtonText}</Button></div>;
        const defaultSrc = 'img/no-img/big.jpg';
        let imgSrc = photo ? photo.thumbnail.big : defaultSrc;

        return (
            <div className="card person-card">
                <div className="card-header">
                    <div className="card-title" onClick={this.handleGoToProfile}>
                        {username}
                    </div>
                    <div className="card-sub-title">
                        {subTitle}
                    </div>
                    {/*<div className="send-message-button icon-wrapper">*/}
                    {/*{messageButton}*/}
                    {/*</div>*/}
                </div>
                <div className="card-content">
                    <div className="card-content-inner">
                        <div className="image fixed-height-image" onClick={this.handleGoToProfile}>
                            <Image src={imgSrc} defaultSrc={defaultSrc}/>
                        </div>
                        {like ? <div className="like-icon-container" onClick={this.handleGoToProfile}><span className="icon-star"></span></div> : null}
                        <div className="matching">
                            <ProgressBar percentage={matching}/>
                        </div>
                    </div>
                </div>
                <div className="card-footer">
                    <div className="matching-value">{strings.matching} {matching ? matching + '%' : '0%'}</div>
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