import React, { PropTypes, Component } from 'react';
import shouldPureComponentUpdate from 'react-pure-render/function';

export default class Chip extends Component {
	static propTypes = {
		label: PropTypes.string.isRequired,
		disabled: PropTypes.bool,
		onClickHandler: PropTypes.func
	};

	render() {
		return (
			<div className={this.props.disabled ? "disabled-chip chip" : "chip"} onClick={this.props.onClickHandler}>
				<div className="chip-label">
					{this.props.label}
				</div>
			</div>
		);
	}
}
