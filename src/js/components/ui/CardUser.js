import PropTypes from 'prop-types';
import React, { Component } from 'react';
import ProgressBar from './ProgressBar';
import Button from './Button';
import Image from './Image';
import CardUserTopLinks from '../recommendations/CardUserTopLinks';
import * as UserActionCreators from '../../actions/UserActionCreators'
import translate from '../../i18n/Translate';

@translate('CardUser')
export default class CardUser extends Component {

    static contextTypes = {
        router: PropTypes.object.isRequired
    };

    static propTypes = {
        userId                : PropTypes.number.isRequired,
        username              : PropTypes.string.isRequired,
        slug                  : PropTypes.string.isRequired,
        location              : PropTypes.string,
        canSendMessage        : PropTypes.bool.isRequired,
        photo                 : PropTypes.object,
        matching              : PropTypes.number.isRequired,
        similarity            : PropTypes.number,
        age                   : PropTypes.number,
        like                  : PropTypes.number,
        hideLikeButton        : PropTypes.bool.isRequired,
        loggedUserId          : PropTypes.number.isRequired,
        profile               : PropTypes.object.isRequired,
        handleSelectProfile   : PropTypes.func,
        online                : PropTypes.bool,
        topLinks              : PropTypes.array,
        sharedLinks           : PropTypes.number,
        orientationMustBeAsked: PropTypes.bool,

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
        this.context.router.push(`/conversations/${this.props.slug}`);
    }

    handleGoToProfile() {
        const {profile, orientationMustBeAsked, slug} = this.props;
        if (orientationMustBeAsked) {
            nekunoApp.popup('.popup-orientation-required');
            this.props.handleSelectProfile(slug);
        } else {
            this.context.router.push(`/p/${slug}`);
        }
    }

    render() {
        const {location, canSendMessage, like, hideLikeButton, photo, userId, username, matching, similarity, age, online, topLinks, sharedLinks, strings} = this.props;
        const subTitle = <div><span className="icon-marker"></span>{location.substr(0, 15)}{location.length > 15 ? '...' : ''} - {strings.age}: {age}</div>;
        const messageButton = canSendMessage ? <span className="icon-message" onClick={this.handleMessage}></span> : '';
        const likeButtonText = like === null ? strings.saving : like ? strings.unlike : strings.like;
        const likeButton = hideLikeButton ? '' : <div className="like-button-container"><Button onClick={this.onLikeOrDislike} disabled={like === null ? 'disabled' : null}>{likeButtonText}</Button></div>;
        const defaultSrc = 'img/no-img/big.jpg';
        let imgSrc = photo ? photo.thumbnail.big : defaultSrc;

        return (
            <div className="card person-card" onClick={this.handleGoToProfile}>
                <div className="card-header">
                    <div className="card-content">
                        <div className="card-content-inner">
                            {like ?
                                <div className="like-icon-container"><span className="icon-star"></span></div>
                                : null
                            }
                            <div className="image fixed-max-height-image">
                                <Image src={imgSrc} defaultSrc={defaultSrc}/>
                            </div>
                        </div>
                    </div>
                </div>
                <CardUserTopLinks topLinks={topLinks} sharedLinks={sharedLinks} onClick={this.handleGoToProfile}/>
                {/*<div className="card-header">

                    <div className="card-sub-title">
                        {subTitle}
                    </div>
                    {online ? <div className="online-status">Online</div> : null}
                    <div className="send-message-button icon-wrapper">
                    {messageButton}
                    </div>
                </div>*/}
                <div className={"card-footer"}>
                    <div>
                        <div className="card-title">
                            {username}
                        </div>
                        <div className="matching-value">
                            <div className="matching-string">{strings.matching}</div><div className="matching-percentage">{matching ? matching + '%' : '0%'}</div>
                        </div>
                        <div className="matching-progress">
                            <ProgressBar percentage={matching}/>
                        </div>
                        <div className="matching-value">
                            <div className="matching-string">{strings.similarity}</div><div className="matching-percentage">{similarity ? similarity + '%' : '0%'}</div>
                        </div>
                        <div className="similarity-progress">
                            <ProgressBar percentage={similarity}/>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

}

CardUser.defaultProps = {
    strings: {
        like      : 'Like',
        unlike    : 'Remove',
        matching  : 'Matching',
        similarity: 'Similarity',
        saving    : 'Saving...',
        age       : 'Age',
    }
};