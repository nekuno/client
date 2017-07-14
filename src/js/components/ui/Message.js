import PropTypes from 'prop-types';
import React, { Component } from 'react';
import moment from 'moment';
import Emojify from 'react-emojione';
import Image from './Image';
import ChatActionCreators from '../../actions/ChatActionCreators';

export default class Message extends Component {

    static propTypes = {
        message : PropTypes.object.isRequired,
        userLink: PropTypes.string.isRequired
    };

    static contextTypes = {
        router: PropTypes.object.isRequired
    };

    constructor(props) {
        super(props);

        this.requestMessages = this.requestMessages.bind(this);
    }

    requestMessages() {
        let {message} = this.props;
        let mine = message.user.id === message.user_from.id;
        const userId = mine ?  message.user_to.id :  message.user_from.id;
        ChatActionCreators.getMessages(userId, 0);
    }

    render() {

        let {message, userLink} = this.props;
        let text = message.text;
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
                            <div className="notification-excerpt break-words">
                                <Emojify><span>{text}</span></Emojify>
                            </div>
                            <div className="notification-time" title={createdAt.toLocaleString()}>
                                <span className="icon-clock"></span>&nbsp;
                                <span className="notification-time-text">{moment(createdAt).fromNow()}</span>
                            </div>
                        </div>
                        <div className="notification-picture-right">
                            <Image src={imageSrc} onError={this.requestMessages}/>
                        </div>
                    </div>
                    :
                    <div className="notification">
                        <div className="notification-picture" onClick={() => this.context.router.push(userLink)}>
                            <Image src={imageSrc} onError={this.requestMessages}/>
                        </div>
                        <div className="notification-text">
                            <div className="notification-excerpt" style={style}>
                                <Emojify><span>{text}</span></Emojify>
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