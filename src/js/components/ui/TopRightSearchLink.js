import React, { PropTypes, Component } from 'react';
import shouldPureComponentUpdate from 'react-pure-render/function';

export default class TopRightSearchLink extends Component {
	static propTypes = {
		onClickHandler: PropTypes.func
	};

	shouldComponentUpdate = shouldPureComponentUpdate;

	render() {
		const {onClickHandler} = this.props;
		return (
			<div className="col-30 right" onClick={onClickHandler}>
				<div className="icon-wrapper">
					<span className="icon-search"></span>
				</div>
			</div>
		);
	}
}
