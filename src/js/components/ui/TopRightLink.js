import PropTypes from 'prop-types';
import React, { Component } from 'react';
import shouldPureComponentUpdate from 'react-pure-render/function';
import Icon from './Icon';

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
						<Icon icon={icon} />
					</div>
					<div onClick={onSecondIconClickHandler} className={iconsWrapperClass}>
						<Icon icon={secondIcon} />
					</div>
				</div>
				:
				<div className="col-30 right" onClick={onClickHandler}>
					{icon ?
							text ?
								<div id="joyride-2-create-yarn" className={iconsWrapperClass + ' icon-wrapper-with-text'}>
									<Icon icon={icon} />&nbsp;<span className="text">{text}</span>
								</div>
								:
									<div className={iconsWrapperClass}>
										<Icon icon={icon} />
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