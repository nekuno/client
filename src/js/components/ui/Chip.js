import React, { PropTypes, Component } from 'react';
import shouldPureComponentUpdate from 'react-pure-render/function';

export default class Chip extends Component {
	static propTypes = {
		label: PropTypes.string.isRequired
	};

	shouldComponentUpdate = shouldPureComponentUpdate;

	render() {
		return (
			<div className="chip">
				<div className="chip-label">
					{this.props.label}
				</div>
			</div>
		);
	}
}
