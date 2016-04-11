import React, { PropTypes, Component } from 'react';
import Chip from './Chip';
import InputRadio from './InputRadio';

export default class TextRadios extends Component {
	static propTypes = {
		title: PropTypes.string,
		labels: PropTypes.array.isRequired,
		value: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
		onClickHandler: PropTypes.func.isRequired,
		className: PropTypes.string
	};

	constructor(props) {
		super(props);
	}

	render() {
		let labelsLength = this.props.labels.length;
		let labelsTextLength = 0;
		this.props.labels.forEach(label => labelsTextLength += label.text.length);
		let showCheckboxesList = labelsLength > 3 || labelsTextLength > 35;
		return (
			showCheckboxesList ?
				<div className="list-block">
					<div className="checkbox-title">{this.props.title}</div>
					<ul className="checkbox-list">
						{this.props.labels.map(label =>
							<li key={label.key}>
								<InputRadio value={label.key} name={label.key} text={label.text} checked={this.props.value === label.key} defaultChecked={false} onClickHandler={this.onClickHandler.bind(this, label.key)} reverse={true}/>
							</li>
						)}
					</ul>
				</div>
				:
				<div className={this.props.className ? "text-radios " + this.props.className : "text-radios"}>
					<div className="text-radios-title">{this.props.title}</div>
					<div className={labelsLength ? 'text-radios-container' : ' unique-chip text-radios-container'}>
						{this.props.labels.map(label =>
							<Chip key={label.key} chipClass={'chip-' + labelsLength} label={label.text}
								  onClickHandler={this.onClickHandler.bind(this, label.key)} disabled={this.props.value !== label.key} />
						)}
					</div>
				</div>
		);
	}

	onClickHandler(key) {
		this.props.onClickHandler(key);
	}
}
