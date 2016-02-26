import React, { PropTypes, Component } from 'react';
import Message from './Message';
import moment from 'moment';

export default class DailyMessages extends Component {
	static propTypes = {
		messages: PropTypes.array.isRequired,
		ownPicture: PropTypes.string.isRequired,
		otherPicture: PropTypes.string.isRequired,
		date: PropTypes.string.isRequired
	};

	render() {
		return (
			<div>
				<div className="daily-message-title">
					{moment(this.props.date).format('dddd, MMMM Do YYYY')}
				</div>
				{this.props.messages.map((message, index) => {
					return (
						message.isOwnMessage ?
							<Message key={index} {...message} picture={this.props.ownPicture} rightPicture={true}/>
							:
							<Message key={index} {...message} picture={this.props.otherPicture} rightPicture={false}/>
					);
				})}
				<br />
				<br />
			</div>
		);
	}
}