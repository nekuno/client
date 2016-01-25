import React, { PropTypes, Component } from 'react';

export default class InputRadio extends Component {
	static propTypes = {
		value: PropTypes.number.isRequired,
		name: PropTypes.string.isRequired,
		text: PropTypes.string.isRequired,
		checked: PropTypes.bool.isRequired,
		onClickHandler: PropTypes.func.isRequired
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
				<input type="radio" name={this.props.name} value={this.props.value} checked={this.state.checked} defaultChecked={this.props.checked} />
				<div className="item-media" onClick={this.onClickHandler}>
					<i className="icon icon-form-checkbox"></i>
				</div>
			</label>
		);
	}

	onClickHandler() {
		this.setState({'checked': true});
		this.props.onClickHandler(this.props.value);
	}
}
