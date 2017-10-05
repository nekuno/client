import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Link } from 'react-router';
import moment from 'moment';
import Emojify from 'react-emojione';
import Image from './Image';
import ChatActionCreators from '../../actions/ChatActionCreators';

export default class LastMessage extends Component {

    static propTypes = {
        user   : PropTypes.object.isRequired,
        message: PropTypes.object.isRequired,
        online : PropTypes.bool.isRequired
    };

    requestMessages(userId) {
        ChatActionCreators.getMessages(userId, 0);
    }

    render() {
        const {message, user, online} = this.props;
        const readed = message.readed;
        const createdAt = message.createdAt;
        const imageSrc = message.user.id === message.user_from.id ? message.user_to.photo.thumbnail.medium : message.user_from.photo.thumbnail.medium;
        const mine = message.user.id === message.user_from.id;
        const userId = mine ? message.user_to.id : message.user_from.id;
        const slug = mine ? message.user_to.slug : message.user_from.slug;
        const style = readed || mine ? {} : {fontWeight: 'bold', color: '#000'};

        return (
            <div className="notification">
                <Link to={`/conversations/${slug}`}>
                    <div className="notification-picture">
                        <Image src={imageSrc} onError={this.requestMessages.bind(this, userId)}/>
                        {online ? <div className="status-online">Online</div> : ''}
                    </div>
                    <div className="notification-text">
                        <div className="notification-title">
                            <span className="notification-title-text">{user.username}</span>
                        </div>
                        <div className="notification-excerpt truncate" style={style}>
                            <Emojify>{message.text}</Emojify>
                        </div>
                        <div className="notification-time" title={createdAt.toLocaleString()}>
                            <span className="icon-clock"></span>&nbsp;
                            <span className="notification-time-text" style={style}>{moment(createdAt).fromNow()}</span>
                        </div>
                    </div>
                </Link>
            </div>
        );
    }
}