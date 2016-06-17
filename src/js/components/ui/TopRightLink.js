import React, { PropTypes, Component } from 'react';
import shouldPureComponentUpdate from 'react-pure-render/function';

export default class TopRightLink extends Component {
	static propTypes = {
		icon		      		: PropTypes.string,
		secondIcon		  		: PropTypes.string,
		text			  		: PropTypes.string,
		iconsWithoutCircle		: PropTypes.bool,
		onClickHandler	  		: PropTypes.func,
		onSecondIconClickHandler: PropTypes.func
	};

	shouldComponentUpdate = shouldPureComponentUpdate;

	render() {
		const {icon, secondIcon, text, iconsWithoutCircle, onClickHandler, onSecondIconClickHandler} = this.props;
		const iconsWrapperClass = iconsWithoutCircle ? 'icon-wrapper no-circle' : 'icon-wrapper';
		return (
			icon && secondIcon ?
				<div className="col-30 right">
					<div onClick={onClickHandler} className={iconsWrapperClass}>
						<span className={'icon-' + icon}></span>
					</div>
					<div onClick={onSecondIconClickHandler} className={iconsWrapperClass}>
						<span className={'icon-' + secondIcon}></span>
					</div>
				</div>
				:
				<div className="col-30 right" onClick={onClickHandler}>
					{icon ?
						<div className={iconsWrapperClass}>
							<span className={'icon-' + icon}></span>
						</div>
						:
						<a className="navbar-link-text">
							{text}
						</a>
					}
				</div>
		);
	}
}