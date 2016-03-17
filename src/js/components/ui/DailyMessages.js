import React, { PropTypes, Component } from 'react';
import Message from './Message';
import moment from 'moment';

export default class DailyMessages extends Component {

    static propTypes = {
        messages: PropTypes.array.isRequired
    };

    render() {

        let dates = [];
        let messagesByDate = [];
        this.props.messages.forEach((message) => {
            let date = moment(message.createdAt).format('YYYYMMDD');
            if (dates.indexOf(date) === -1) {
                dates.push(date);
                messagesByDate.push(<div key={date} className="daily-message-title">{moment(date).format('dddd, D MMMM YYYY')}</div>);
                messagesByDate.push(<Message key={message.id} message={message}/>);
            } else {
                messagesByDate.push(<Message key={message.id} message={message}/>);
            }
        });

        return (

            <div>

                { messagesByDate }
                <br />
            </div>
        );
    }
}