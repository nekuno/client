import React, { PropTypes, Component } from 'react';
import moment from 'moment';
import ReactEmoji from 'react-emoji';

export default class Message extends Component {

    static propTypes = {
        message: PropTypes.object.isRequired
    };

    static contextTypes = {
        history: PropTypes.object.isRequired
    };

    render() {

        let message = this.props.message;
        let text = ReactEmoji.emojify(message.text);
        let readed = message.readed;
        let createdAt = message.createdAt;
        let imageSrc = message.user_from.photo.thumbnail.medium;
        let mine = message.user.id === message.user_from.id;
        let style = readed ? {} : {fontWeight: 'bold', color: '#000'};

        return (
            <div>
                {mine ?
                    <div className="notification">
                        <div className="notification-text-right">
                            <div className="notification-excerpt">
                                {text}
                            </div>
                            <div className="notification-time" title={createdAt.toLocaleString()}>
                                <span className="icon-clock"></span>&nbsp;
                                <span className="notification-time-text">{moment(createdAt).fromNow()}</span>
                            </div>
                        </div>
                        <div className="notification-picture-right">
                            <img src={imageSrc}/>
                        </div>
                    </div>
                    :
                    <div className="notification">
                        <div className="notification-picture" onClick={() => this.context.history.pushState(null, `profile/${message.user_from.id}`)}>
                            <img src={imageSrc}/>
                        </div>
                        <div className="notification-text">
                            <div className="notification-excerpt" style={style}>
                                {text}
                            </div>
                            <div className="notification-time" title={createdAt.toLocaleString()}>
                                <span className="icon-clock"></span>&nbsp;
                                <span className="notification-time-text">{moment(createdAt).fromNow()}</span>
                            </div>
                        </div>
                    </div>
                }
            </div>
        );
    }
}