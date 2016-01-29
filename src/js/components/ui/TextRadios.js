import React, { PropTypes, Component } from 'react';
import Chip from './Chip';

export default class TextRadios extends Component {
	static propTypes = {
		title: PropTypes.string,
		labels: PropTypes.array.isRequired,
		value: PropTypes.string.isRequired,
		onClickHandler: PropTypes.func.isRequired
	};

	constructor(props) {
		super(props);

		this.onClickHandler = this.onClickHandler.bind(this);
	}

	render() {
		let labelsLength = this.props.labels.length;
		return (
			<div className="text-radios">
				<div className="text-radios-title">{this.props.title}</div>
				<div className={labelsLength ? 'text-radios-container' : ' unique-chip text-radios-container'}>
					{this.props.labels.map(label =>
						<Chip key={label.key} label={label.text} onClickHandler={this.onClickHandler.bind(this, label.key)} disabled={this.props.value !== label.key} />
					)}
				</div>
			</div>
		);
	}

	onClickHandler(key) {
		this.props.onClickHandler(key);
	}
}
