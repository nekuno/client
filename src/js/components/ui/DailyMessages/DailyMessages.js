import PropTypes from 'prop-types';
import React, { Component } from 'react';
import Message from '../Message/Message';
import moment from 'moment';
import styles from './DailyMessages.scss';


export default class DailyMessages extends Component {

    static propTypes = {
        messages: PropTypes.array.isRequired,
        userLink: PropTypes.string.isRequired,
        canContact: PropTypes.bool
    };


    render() {
        const {userLink, canContact} = this.props;
        let dates = [];
        let messagesByDate = [];

        this.props.messages.forEach((message) => {
            let date = moment(message.createdAt).format('YYYYMMDD');
            if (dates.indexOf(date) === -1) {
                dates.push(date);
                messagesByDate.push(<div key={date} className={styles.dailyMessageTitle}>{moment(date).format('dddd, D MMMM YYYY')}</div>);
                messagesByDate.push(<Message key={message.id} message={message} userLink={userLink}/>);
            } else {
                messagesByDate.push(<Message key={message.id} message={message} userLink={userLink}/>);
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
