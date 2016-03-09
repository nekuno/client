import React, { PropTypes, Component } from 'react';
import Message from './Message';
import moment from 'moment';

export default class DailyMessages extends Component {

    static propTypes = {
        messages: PropTypes.array.isRequired,
        date    : PropTypes.string
    };

    render() {
        return (
            <div>
                <div className="daily-message-title">
                    {moment(this.props.date).format('dddd, MMMM Do YYYY')}
                </div>
                {
                    this.props.messages.map((message) => {
                        return <Message key={message.id} message={message} />;
                    })
                }
                <br />
                <br />
            </div>
        );
    }
}