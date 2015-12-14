import React, { PropTypes, Component } from 'react';
import shouldPureComponentUpdate from 'react-pure-render/function';

export default class TopRightLink extends Component {
	static propTypes = {
		text: PropTypes.string
	};

	shouldComponentUpdate = shouldPureComponentUpdate;

	render() {
		return (
			<div className="col-25 right">
				<a href="#">
					{this.props.text}
				</a>
			</div>
		);
	}
}