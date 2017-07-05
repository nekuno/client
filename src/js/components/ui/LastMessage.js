import React, { PropTypes, Component } from 'react';
import { Link } from 'react-router';
import moment from 'moment';
import ChatUserStatusStore from '../../stores/ChatUserStatusStore';
import connectToStores from '../../utils/connectToStores';
import ReactEmoji from 'react-emoji';
import Image from './Image';
import ChatActionCreators from '../../actions/ChatActionCreators';

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

    requestMessages(userId) {
        ChatActionCreators.getMessages(userId, 0);
    }

    render() {
        const {message, user, online} = this.props;
        let text = ReactEmoji.emojify(message.text);
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