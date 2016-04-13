import React, { PropTypes, Component } from 'react';
import shouldPureComponentUpdate from 'react-pure-render/function';

export default class TopLeftMenuLink extends Component {
	static propTypes = {};

	shouldComponentUpdate = shouldPureComponentUpdate;

	render() {
		return (
			<div className="col-30 left">
				<a className="open-panel">
					<span className="icon-menu"></span>
				</a>
			</div>
		);
	}
}
