import React, { PropTypes, Component } from 'react';
import { Link } from 'react-router';
import moment from 'moment';
import ChatUserStatusStore from '../../stores/ChatUserStatusStore';
import connectToStores from '../../utils/connectToStores';
import ReactEmoji from 'react-emoji';

function getState(props) {

    const online = ChatUserStatusStore.isOnline(props.user.id) || false;

    return {
        online
    };
}

@connectToStores([ChatUserStatusStore], getState)
export default class LastMessage extends Component {

    static propTypes = {
        user   : PropTypes.object.isRequired,
        message: PropTypes.object.isRequired,
        // Injected by @connectToStores:
        online : PropTypes.bool.isRequired
    };

    render() {

        let message = this.props.message;
        let text = ReactEmoji.emojify(message.text);
        let readed = message.readed;
        let createdAt = message.createdAt;
        let imageSrc = message.user.id === message.user_from.id ? message.user_to.photo.thumbnail.medium : message.user_from.photo.thumbnail.medium;
        let user = this.props.user;
        let online = this.props.online;
        let mine = message.user.id === message.user_from.id;
        let style = readed || mine ? {} : {fontWeight: 'bold', color: '#000'};

        return (
            <div className="notification">
                <Link to={`/conversations/${user.id}`}>
                    <div className="notification-picture">
                        <img src={imageSrc}/>
                    </div>
                    <div className="notification-text">
                        <div className="notification-title">
                            <span className="notification-title-text">{user.username}</span>
                            {online ? <span className="status-online icon-circle"></span> : ''}
                        </div>
                        <div className="notification-excerpt" style={style}>
                            {text}
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