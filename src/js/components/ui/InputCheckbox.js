import React, { PropTypes, Component } from 'react';

export default class InputCheckbox extends Component {
	static propTypes = {
		value: PropTypes.number.isRequired,
		name: PropTypes.string.isRequired,
		text: PropTypes.string.isRequired,
		checked: PropTypes.bool.isRequired,
		onClickHandler: PropTypes.func
	};

	constructor(props) {
		super(props);

		this.onClickHandler = this.onClickHandler.bind(this);

		this.state = {
			checked: props.checked
		}
	}

	render() {
		return (
			<label className="label-checkbox item-content">
				<div className="item-inner">
					<div className="item-title">{this.props.text}</div>
				</div>
				<input type="checkbox" name={this.props.name} value={this.props.value} checked={this.state.checked} defaultChecked={this.props.checked} />
				<div className="item-media" onClick={this.onClickHandler}>
					<i className="icon icon-form-checkbox"></i>

				</div>
			</label>
		);
	}

	onClickHandler() {
		let _self = this;
		let checked = !_self.state.checked;
		let value = _self.props.value;
		setTimeout(function () {
			checked = _self.props.onClickHandler(checked, value);
			_self.setState({'checked': checked});
		}, 50);


	}
}
