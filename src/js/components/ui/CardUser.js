import React, { PropTypes, Component } from 'react';
import { IMAGES_ROOT } from '../../constants/Constants';
import shouldPureComponentUpdate from 'react-pure-render/function';
import ProgressBar from './ProgressBar';
import Button from './Button';

export default class CardUser extends Component {
	static propTypes = {
		username: PropTypes.string.isRequired,
		location: PropTypes.string.isRequired,
		canSendMessage: PropTypes.bool.isRequired,
		picture: PropTypes.string.isRequired,
		matching: PropTypes.number.isRequired,
		liked: PropTypes.bool.isRequired,
		hideLikeButton: PropTypes.bool.isRequired
	};

	shouldComponentUpdate = shouldPureComponentUpdate;

	render() {
		let subTitle = this.props.location ? <div><span className="icon-marker"></span>{this.props.location}</div> : '';
		let messageButton = this.props.canSendMessage ? <span className="icon-message"></span> : '';
		let likeButtonText = this.props.liked ? 'Quitar Me gusta' : 'Me gusta';
		let likeButton = this.props.hideLikeButton ? '' : <div className="like-button-container"><Button {...this.props}>{likeButtonText}</Button></div>;
		let imgSrc = this.props.picture ? `${IMAGES_ROOT}/media/cache/user_avatar_180x180/user/images/${this.props.picture}` : `${IMAGES_ROOT}/media/cache/user_avatar_180x180/bundles/qnoowweb/images/user-no-img.jpg`;

		return (
			<div className="card person-card">
				<div className="card-header">
					<div className="title">
						{this.props.username}
					</div>
					<div className="sub-title">
						{subTitle}
					</div>
					<div className="send-message-button icon-wrapper">
						{messageButton}
					</div>
				</div>
				<div className="card-content">
					<div className="card-content-inner">
						<div className="image">
							<img src={imgSrc} />
						</div>
						<div className="matching">
							<div className="matching-value">Similaridad {this.props.matching}%</div>
							<ProgressBar percentage={this.props.matching} />
						</div>
					</div>
				</div>
				<div className="card-footer">
					{likeButton}
				</div>
			</div>
		);
	}
}