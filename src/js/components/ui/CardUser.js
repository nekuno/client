import React, { PropTypes, Component } from 'react';
import { Link } from 'react-router';
import { IMAGES_ROOT } from '../../constants/Constants';
import * as UserActionCreators from '../../actions/UserActionCreators'
import ProgressBar from './ProgressBar';
import Button from './Button';

/**
 * Set user like.
 */
function setLikeUser(props) {
    const { loggedUserId, userId } = props;

    UserActionCreators.likeUser(loggedUserId, userId);
}

/**
 * Unset user like.
 */
function unsetLikeUser(props) {
    const { loggedUserId, userId } = props;

    UserActionCreators.deleteLikeUser(loggedUserId, userId);
}

export default class CardUser extends Component {

    static contextTypes = {
        history: PropTypes.object.isRequired
    };

    static propTypes = {
        userId        : PropTypes.number.isRequired,
        username      : PropTypes.string.isRequired,
        location      : PropTypes.string,
        canSendMessage: PropTypes.bool.isRequired,
        picture       : PropTypes.string,
        matching      : PropTypes.number.isRequired,
        liked         : PropTypes.bool.isRequired,
        hideLikeButton: PropTypes.bool.isRequired,
        loggedUserId  : PropTypes.number.isRequired
    };

    constructor(props) {
        super(props);

        this.onLikeOrDislike = this.onLikeOrDislike.bind(this);
        this.handleMessage = this.handleMessage.bind(this);
    }

    onLikeOrDislike() {
        if (!this.props.liked) {
            setLikeUser(this.props);
        } else {
            unsetLikeUser(this.props);
        }
    }

    handleMessage() {
        this.context.history.pushState(null, `/conversations/${this.props.userId}`);
    }

    render() {
        let subTitle = this.props.location ? <div><span className="icon-marker"></span>{this.props.location}</div> : <div>&nbsp;</div>;
        let messageButton = this.props.canSendMessage ? <span className="icon-message" onClick={this.handleMessage}></span> : '';
        let likeButtonText = this.props.liked ? 'Quitar Me gusta' : 'Me gusta';
        let likeButton = this.props.hideLikeButton ? '' : <div className="like-button-container"><Button {...this.props} onClick={this.onLikeOrDislike}>{likeButtonText}</Button></div>;
        let imgSrc = this.props.picture ? `${IMAGES_ROOT}media/cache/resolve/user_avatar_180x180/user/images/${this.props.picture}` : `${IMAGES_ROOT}media/cache/user_avatar_180x180/bundles/qnoowweb/images/user-no-img.jpg`;

        return (
            <div className="card person-card">
                <div className="card-header">
                    <Link to={`/profile/${this.props.userId}`}>
                        <div className="card-title">
                            {this.props.username}
                        </div>
                    </Link>
                    <div className="card-sub-title">
                        {subTitle}
                    </div>
                    <div className="send-message-button icon-wrapper">
                        {messageButton}
                    </div>
                </div>
                <div className="card-content">
                    <div className="card-content-inner">
                        <Link to={`/profile/${this.props.userId}`}>
                            <div className="image">
                                <img src={imgSrc}/>
                            </div>
                        </Link>
                        <div className="matching">
                            <div className="matching-value">Similaridad {this.props.matching}%</div>
                            <ProgressBar percentage={this.props.matching}/>
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