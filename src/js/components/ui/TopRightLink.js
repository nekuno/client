import React, { PropTypes, Component } from 'react';
import shouldPureComponentUpdate from 'react-pure-render/function';

export default class TopRightLink extends Component {
	static propTypes = {
		text: PropTypes.string,
		onClickHandler: PropTypes.func
	};

	shouldComponentUpdate = shouldPureComponentUpdate;

	render() {
		return (
			<div className="col-25 right">
				<a onClick={this.props.onClickHandler}>
					{this.props.text}
				</a>
			</div>
		);
	}
}