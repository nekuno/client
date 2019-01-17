import PropTypes from 'prop-types';
import React, { Component } from 'react';
import moment from 'moment';
import Emojify from 'react-emojione';
import Image from '../Image';
import ChatActionCreators from '../../../actions/ChatActionCreators';
import styles from './Message.scss';


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
                    <div className={styles.notification}>
                        <div className={styles.notificationTextRight}>
                            {/*<div className={styles.notificationExcerpt + ' ' + styles.breakWords}>*/}
                            <div className={styles.notificationExcerptPadding}>

                            </div>
                            <div className={styles.notificationExcerpt}>
                                <Emojify><span>{text}</span></Emojify>
                            </div>
                        </div>
                        {/*<div className="notification-time" title={createdAt.toLocaleString()}>*/}
                            {/*<span className="icon-clock"></span>&nbsp;*/}
                            {/*<span className="notification-time-text">{moment(createdAt).fromNow()}</span>*/}
                        {/*</div>*/}
                    </div>
                    :
                    <div className={styles.notification}>
                        <div className={styles.notificationText}>
                            <div className={styles.notificationExcerpt} style={style}>
                                <Emojify><span>{text}</span></Emojify>
                            </div>
                            <div className={styles.notificationExcerptPadding}>

                            </div>
                        </div>
                        {/*<div className="notification-time" title={createdAt.toLocaleString()}>*/}
                            {/*<span className="icon-clock"></span>&nbsp;*/}
                            {/*<span className="notification-time-text">{moment(createdAt).fromNow()}</span>*/}
                        {/*</div>*/}
                    </div>
                }
            </div>
        );
    }
}