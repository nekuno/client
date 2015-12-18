import React, { PropTypes, Component } from 'react';
import shouldPureComponentUpdate from 'react-pure-render/function';
import Button from './Button';

export default class CardUser extends Component {
	static propTypes = {
		username: PropTypes.string.isRequired,
		location: PropTypes.string.isRequired,
		canSendMessage: PropTypes.bool.isRequired,
		image: PropTypes.string.isRequired,
		matching: PropTypes.number.isRequired,
		liked: PropTypes.bool.isRequired,
		hideLikeButton: PropTypes.bool.isRequired
	};

	shouldComponentUpdate = shouldPureComponentUpdate;

	render() {
		let subTitle = this.props.location ? <span><span className="icon-location"></span>{this.props.location}</span> : '';
		let messageButton = this.props.canSendMessage ? <span className="icon-message"></span> : '';
		let likeButtonText = this.props.liked ? 'Quitar Me gusta' : 'Me gusta';
		let likeButton = this.props.hideLikeButton ? '' : <div className="like-button-container"><Button text={likeButtonText} /></div>;
		return (
			<div className="card person-card">
				<div className="card-header">
					<div className="title">
						{this.props.username}
					</div>
					<div className="sub-title">
						{subTitle}
					</div>
					<div className="send-message-button">
						{messageButton}
					</div>
				</div>
				<div className="card-content">
					<div className="card-content-inner">
						<div className="image">
							<img src={this.props.image} />
						</div>
						<div className="matching">
							<div className="matching-value">{this.props.matching}%</div>
							<div className="matching-bar">
								<div className="matching-percent" style={{width: this.props.matching + '%'}}></div>
							</div>
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