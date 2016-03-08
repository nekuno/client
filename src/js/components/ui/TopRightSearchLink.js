import React, { PropTypes, Component } from 'react';
import shouldPureComponentUpdate from 'react-pure-render/function';

export default class TopRightSearchLink extends Component {
	static propTypes = {
		onClickHandler: PropTypes.func
	};

	shouldComponentUpdate = shouldPureComponentUpdate;

	render() {
		return (
			<div className="col-25 right" onClick={this.props.onClickHandler}>
				<div className="icon-wrapper">
					<span className="icon-search"></span>
				</div>
			</div>
		);
	}
}
