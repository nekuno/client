import React, { PropTypes, Component } from 'react';
import Chip from './Chip';

export default class TextCheckboxes extends Component {
	static propTypes = {
		title: PropTypes.string,
		labels: PropTypes.array.isRequired,
		values: PropTypes.array.isRequired,
		onClickHandler: PropTypes.func.isRequired,
		big: PropTypes.bool
	};

	constructor(props) {
		super(props);

		this.onClickHandler = this.onClickHandler.bind(this);
	}

	render() {
		return (
			<div className="text-checkboxes">
				{this.props.title ? <div className="text-checkboxes-title">{this.props.title}</div> : ''}
				{this.props.labels.map(label => <Chip key={label.key} label={label.text.length > 45 ? label.text.slice(0, 45) + '...' : label.text} onClickHandler={this.onClickHandler.bind(this, label.key)} disabled={!this.props.values.some(value => value == label.key)} />)}
			</div>
		);
	}

	onClickHandler(key) {
		this.props.onClickHandler(key);
	}
}
