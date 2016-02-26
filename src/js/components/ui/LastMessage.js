import React, { PropTypes, Component } from 'react';
import { Link } from 'react-router';
import { IMAGES_ROOT } from '../../constants/Constants';
import moment from 'moment';

export default class LastMessage extends Component {
	static propTypes = {
		userId: PropTypes.number.isRequired,
		username: PropTypes.string.isRequired,
		text: PropTypes.string.isRequired,
		canSendMessage: PropTypes.bool.isRequired,
		picture: PropTypes.string,
		datetime: PropTypes.string,
		loggedUserId: PropTypes.number.isRequired,
		online: PropTypes.bool.isRequired
	};

	render() {
		let imgSrc = this.props.picture ? `${IMAGES_ROOT}media/cache/resolve/user_avatar_60x60/user/images/${this.props.picture}` : `${IMAGES_ROOT}media/cache/user_avatar_60x60/bundles/qnoowweb/images/user-no-img.jpg`;

		return (
			<div className="notification">
				<Link to={`/messages/${this.props.userId}`}>
					<div className="notification-picture">
						<img src={imgSrc} />
					</div>
					<div className="notification-text">
						<div className="notification-title">
							<span className="notification-title-text">{this.props.username}</span>
							{this.props.online ? <span className="status-online icon-circle"></span> : ''}
						</div>
						<div className="notification-excerpt" style={{ fontWeight: this.props.online ? 'bold' : 'normal', color: this.props.online ? '#000' : '' }}>
							{this.props.text}
						</div>
						<div className="notification-time">
							<span className="icon-clock"></span>&nbsp;
							<span className="notification-time-text" style={{ fontWeight: this.props.online ? 'bold' : 'normal' }}>{moment(this.props.datetime).fromNow()}</span>
						</div>
					</div>
				</Link>
			</div>
		);
	}
}