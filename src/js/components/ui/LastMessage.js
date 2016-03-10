import React, { PropTypes, Component } from 'react';
import { Link } from 'react-router';
import { IMAGES_ROOT } from '../../constants/Constants';
import moment from 'moment';

export default class LastMessage extends Component {
    static propTypes = {
        user   : PropTypes.object.isRequired,
        message: PropTypes.object.isRequired
    };

    render() {

        let message = this.props.message;
        let text = message.text;
        let createdAt = message.createdAt;
        let image = message.user.id === message.user_from.id ? IMAGES_ROOT + message.user_to.image.small : IMAGES_ROOT + message.user_from.image.small;
        let user = this.props.user;
        let online = true;

        return (
            <div className="notification">
                <Link to={`/conversations/${user.id}`}>
                    <div className="notification-picture">
                        <img src={image}/>
                    </div>
                    <div className="notification-text">
                        <div className="notification-title">
                            <span className="notification-title-text">{user.username}</span>
                            {online ? <span className="status-online icon-circle"></span> : ''}
                        </div>
                        <div className="notification-excerpt" style={{ fontWeight: online ? 'bold' : 'normal', color: online ? '#000' : '' }}>
                            {text}
                        </div>
                        <div className="notification-time" title={createdAt.toLocaleString()}>
                            <span className="icon-clock"></span>&nbsp;
                            <span className="notification-time-text" style={{ fontWeight: online ? 'bold' : 'normal' }}>{moment(createdAt).fromNow()}</span>
                        </div>
                    </div>
                </Link>
            </div>
        );
    }
}