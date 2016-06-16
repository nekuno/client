import React, { PropTypes, Component } from 'react';
import shouldPureComponentUpdate from 'react-pure-render/function';

export default class TopRightIconLink extends Component {
	static propTypes = {
		icon			 : PropTypes.string.isRequired,
		iconWithoutCircle: PropTypes.string,
		onClickHandler	 : PropTypes.func
	};

	shouldComponentUpdate = shouldPureComponentUpdate;

	render() {
		const {icon, iconWithoutCircle, onClickHandler} = this.props;
		const iconWrapperClass = iconWithoutCircle ? 'icon-wrapper no-circle' : 'icon-wrapper';
		return (
			<div className="col-30 right" onClick={onClickHandler}>
				<div className={iconWrapperClass}>
					<span className={'icon-' + icon}></span>
				</div>
			</div>
		);
	}
}
