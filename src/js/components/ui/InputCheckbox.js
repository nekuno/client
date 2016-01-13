import React, { PropTypes, Component } from 'react';

export default class InputCheckbox extends Component {
	static propTypes = {
		value: PropTypes.number.isRequired,
		name: PropTypes.string.isRequired,
		text: PropTypes.string.isRequired,
		checked: PropTypes.bool.isRequired,
		onClickHandler: PropTypes.func
	};

	render() {
		return (
			<label className="label-checkbox item-content">
				<div className="item-inner">
					<div className="item-title">{this.props.text}</div>
				</div>
				<input type="checkbox" name={this.props.name} value={this.props.value} defaultChecked={this.props.checked} onClick={this.props.onClickHandler} />
				<div className="item-media">
					<i className="icon icon-form-checkbox"></i>
				</div>
			</label>
		);
	}
}
