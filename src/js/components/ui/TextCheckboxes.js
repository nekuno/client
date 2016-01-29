import React, { PropTypes, Component } from 'react';
import Chip from './Chip';

export default class TextCheckboxes extends Component {
	static propTypes = {
		labels: PropTypes.array.isRequired,
		enabled: PropTypes.oneOfType([PropTypes.bool, PropTypes.string]).isRequired,
		onClickHandler: PropTypes.func.isRequired
	};

	constructor(props) {
		super(props);

		this.onClickHandler = this.onClickHandler.bind(this);
	}

	render() {
		let labelsLength = this.props.labels.length;
		return (
			<div className={labelsLength ? 'text-checkboxes-container' : ' unique-chip text-checkboxes-container'}>
				{this.props.labels.map(label =>
					<Chip key={label.key} label={label.text} onClickHandler={this.onClickHandler.bind(this, label.key)} disabled={this.props.enabled !== label.key} />
				)}
			</div>
		);
	}

	onClickHandler(key) {
		this.props.onClickHandler(key);
	}
}
