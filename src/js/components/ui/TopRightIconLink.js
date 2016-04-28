import React, { PropTypes, Component } from 'react';
import shouldPureComponentUpdate from 'react-pure-render/function';

export default class TopRightIconLink extends Component {
	static propTypes = {
		icon: PropTypes.string,
		onClickHandler: PropTypes.func
	};

	shouldComponentUpdate = shouldPureComponentUpdate;

	render() {
		const {icon, onClickHandler} = this.props;
		return (
			<div className="col-30 right" onClick={onClickHandler}>
				<div className="icon-wrapper">
					<span className={'icon-' + icon}></span>
				</div>
			</div>
		);
	}
}
