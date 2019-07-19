import PropTypes from "prop-types";
import React, { Component } from "react";
import shouldPureComponentUpdate from "react-pure-render/function";
import Icon from './Icon';
import AuthenticatedComponent from '../AuthenticatedComponent';
import RouterActionCreators from '../../actions/RouterActionCreators';

function parsePicture(user) {
    return user && user.photo ? user.photo.thumbnail.small : 'img/no-img/small.jpg';
}

@AuthenticatedComponent
export default class TopNavBar extends Component {
	static contextTypes = {
		router: PropTypes.object.isRequired
	};
	static propTypes = {
		leftMenuIcon: PropTypes.bool,
		leftIcon: PropTypes.string,
		centerText: PropTypes.string,
		rightIcon: PropTypes.string,
		onLeftLinkClickHandler: PropTypes.func,
		onRightLinkClickHandler: PropTypes.func,
		wrapIcons: PropTypes.bool,
		background: PropTypes.string,
		color: PropTypes.string,
		// Injected by @AuthenticatedComponent
        user: PropTypes.object.isRequired,
	};

	goBack() {
		RouterActionCreators.previousRoute(this.context.router.getCurrentLocation().pathname);
	}

	shouldComponentUpdate = shouldPureComponentUpdate;

	render() {
		const {
			user,
			leftMenuIcon,
			centerText,
			onLeftLinkClickHandler,
			onRightLinkClickHandler,
			background,
			color,
			wrapIcons,
		} = this.props;
		let navBarClass = "navbar-no-f7";
		if (wrapIcons) navBarClass += ' wrap-icons';
		
		const style = {};
		if (background) {
			style.background = background;
			style.boxShadow = 'none';
		}
		if (color) style.color = color;
		
		// FIXME
		let { leftIcon, rightIcon } = this.props;
		if (leftIcon === 'left-arrow') leftIcon = 'mdi-arrow-left';
		if (leftIcon === 'arrow-left') leftIcon = 'mdi-arrow-left';
		if (leftIcon === 'x') leftIcon = 'mdi-close';
		if (rightIcon === 'x') rightIcon = 'mdi-close';
		if (leftIcon === 'check') leftIcon = 'mdi-check';
		if (rightIcon === 'check') rightIcon = 'mdi-check';

		return (
			<div className={navBarClass} style={style}>
				{leftMenuIcon ? (
					<a className="left open-panel" id="joyride-3-menu">
						<img src={parsePicture(user)} className="profile-image" />
					</a>
				) : leftIcon ? (
					<a className="left" onClick={onLeftLinkClickHandler || this.goBack.bind(this)}>
						<span className="navbar-icon">
							<Icon icon={leftIcon} />
						</span>
					</a>
				) : <span className="left-gap"></span> }
				
				<span className="center">
					{ centerText ? <span className="text">{centerText}</span> : '' }
				</span>
				
				{ rightIcon ? (
					<a className="right" onClick={onRightLinkClickHandler || this.goBack.bind(this)}>
						<span className="navbar-icon">
							<Icon icon={rightIcon} />
						</span>
					</a>
				) : <span className="right"></span> }
			</div>
		);
	}
}
