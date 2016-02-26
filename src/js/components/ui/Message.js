import React, { PropTypes, Component } from 'react';
import { IMAGES_ROOT } from '../../constants/Constants';
import moment from 'moment';

export default class Message extends Component {
	static propTypes = {
		text: PropTypes.string.isRequired,
		picture: PropTypes.string,
		datetime: PropTypes.string,
		rightPicture: PropTypes.bool.isRequired
	};

	render() {
		let imgSrc = this.props.picture ? `${IMAGES_ROOT}media/cache/resolve/user_avatar_60x60/user/images/${this.props.picture}` : `${IMAGES_ROOT}media/cache/user_avatar_60x60/bundles/qnoowweb/images/user-no-img.jpg`;

		return (
			<div>
				{this.props.rightPicture ?
					<div className="notification">
						<div className="notification-text-right">
							<div className="notification-excerpt">
								{this.props.text}
							</div>
							<div className="notification-time">
								<span className="icon-clock"></span>&nbsp;
								<span className="notification-time-text">{moment(this.props.datetime).fromNow()}</span>
							</div>
						</div>
						<div className="notification-picture-right">
							<img src={imgSrc} />
						</div>
					</div>
					:
					<div className="notification">
						<div className="notification-picture">
							<img src={imgSrc} />
						</div>
						<div className="notification-text">
							<div className="notification-excerpt">
								{this.props.text}
							</div>
							<div className="notification-time">
								<span className="icon-clock"></span>&nbsp;
								<span className="notification-time-text">{moment(this.props.datetime).fromNow()}</span>
							</div>
						</div>
					</div>
				}
				<hr />
			</div>
		);
	}
}