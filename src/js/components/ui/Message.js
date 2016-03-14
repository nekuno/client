import React, { PropTypes, Component } from 'react';
import { IMAGES_ROOT } from '../../constants/Constants';
import moment from 'moment';

export default class Message extends Component {

    static propTypes = {
        message: PropTypes.object.isRequired
    };

    render() {

        let message = this.props.message;
        let text = message.text;
        let readed = message.readed;
        let createdAt = message.createdAt;
        let image = IMAGES_ROOT.slice(0, -1) + message.user_from.image.small;
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
                            <img src={image}/>
                        </div>
                    </div>
                    :
                    <div className="notification">
                        <div className="notification-picture">
                            <img src={image}/>
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
                <hr />
            </div>
        );
    }
}