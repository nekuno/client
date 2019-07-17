import PropTypes from 'prop-types';
import React, { Component } from 'react';
import shouldPureComponentUpdate from 'react-pure-render/function';

export default class ProgressBar extends Component {
	static propTypes = {
		percentage: PropTypes.number.isRequired
	};

	shouldComponentUpdate = shouldPureComponentUpdate;

	render() {
		return (
			<div className="progress-bar">
				<div className={'progress-bar-' + Math.round(this.props.percentage)}></div>
			</div>
		);
	}
}