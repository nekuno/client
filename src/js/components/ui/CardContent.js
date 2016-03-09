import React, { PropTypes, Component } from 'react';
import { Link } from 'react-router';
import { IMAGES_ROOT } from '../../constants/Constants';
import shouldPureComponentUpdate from 'react-pure-render/function';
import * as UserActionCreators from '../../actions/UserActionCreators'
import ProgressBar from './ProgressBar';
import Button from './Button';
import CardIcons from './CardIcons';

/**
 * Set rate like.
 */
function setLikeContent(props) {

	const { loggedUserId, contentId } = props;

	UserActionCreators.likeContent(loggedUserId, contentId);
}

/**
 * Unset rate like.
 */
function unsetLikeContent(props) {
	const { loggedUserId, contentId } = props;

	UserActionCreators.deleteLikeContent(loggedUserId, contentId);
}

export default class CardContent extends Component {
	static propTypes = {
		contentId: PropTypes.number.isRequired,
		title: PropTypes.string,
		description: PropTypes.string,
		types: PropTypes.array.isRequired,
		url: PropTypes.string.isRequired,
		embed_id: PropTypes.string,
		embed_type: PropTypes.string,
		thumbnail: PropTypes.string,
		synonymous: PropTypes.array.isRequired,
		matching: PropTypes.number,
		rate: PropTypes.bool,
		hideLikeButton: PropTypes.bool.isRequired,
		loggedUserId: PropTypes.number.isRequired,
		onClickHandler: PropTypes.func
	};

	constructor(props) {
		super(props);

		this.onRate = this.onRate.bind(this);
		this.onClickHandler = this.onClickHandler.bind(this);
	}

	shouldComponentUpdate = shouldPureComponentUpdate;

	render() {
		let title = this.props.title ? <div>{this.props.title.substr(0, 20)}{this.props.title.length > 20 ? '...' : ''}</div> : 'Link';
		let subTitle = this.props.description ? <div>{this.props.description.substr(0, 20)}{this.props.description.length > 20 ? '...' : ''}</div> : '';
		let likeButtonText = this.props.rate ? 'Quitar Me gusta' : 'Me gusta';
		let likeButton = this.props.hideLikeButton ? '' : <div className="like-button-container"><Button {...this.props} onClick={this.onRate}>{likeButtonText}</Button></div>;
		let imgSrc = 'img/default-content-image.jpg';
		if (this.props.thumbnail) {
			imgSrc = this.props.thumbnail;
		} else if (this.props.types.indexOf('Image') > -1) {
			imgSrc = this.props.url;
		}
		return (
			<div className="card person-card" onClick={this.onClickHandler}>
				<div className="card-header">
					<a href={this.props.url}>
						<div className="card-title">
							{title}
						</div>
					</a>
					<div className="card-sub-title">
						{subTitle}
					</div>
				</div>
				<div className="card-icons">
					<CardIcons types={this.props.types}/>
				</div>
				<div className="card-content">
					<div className="card-content-inner">
						<a href={this.props.url}>
							<div className="image">
								<img src={imgSrc} />
							</div>
						</a>
						{typeof this.props.matching !== 'undefined' ?
							<div className="matching">
								<div className="matching-value">Compatibilidad {this.props.matching}%</div>
								<ProgressBar percentage={this.props.matching} />
							</div>
							:
							''
						}

					</div>
				</div>
				{likeButton ?
					<div className="card-footer">
						{likeButton}
					</div>
						: ''
				}
			</div>
		);
	}

	onRate() {
		if (!this.props.rate){
			setLikeContent(this.props);
		} else {
			unsetLikeContent(this.props);
		}
	}

	onClickHandler() {
		if (typeof this.props.onClickHandler !== 'undefined') {
			this.props.onClickHandler();
		}
	}
}