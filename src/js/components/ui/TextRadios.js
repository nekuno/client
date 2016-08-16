import React, { PropTypes, Component } from 'react';
import Chip from './Chip';
import InputRadio from './InputRadio';

export default class TextRadios extends Component {
	static propTypes = {
		title		  : PropTypes.string,
		labels	      : PropTypes.array.isRequired,
		value	      : PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
		onClickHandler: PropTypes.func.isRequired,
		forceTwoLines : PropTypes.bool,
		className	  : PropTypes.string
	};

	constructor(props) {
		super(props);
	}

	render() {
		const {title, labels, value, forceTwoLines, className} = this.props;
		let labelsLength = labels.length;
		let labelsTextLength = 0;
		labels.forEach(label => labelsTextLength += label.text.length);
		let showCheckboxesList = !forceTwoLines && (labelsLength > 3 || labelsTextLength > 35);
		return (
			showCheckboxesList ?
				<div className={className ? "list-block " + className : "list-block"}>
					<div className="checkbox-title">{title}</div>
					<ul className="checkbox-list">
						{labels.map(label =>
							<li key={label.key}>
								<InputRadio value={label.key} name={label.key} text={label.text} checked={value === label.key} onClickHandler={this.onClickHandler.bind(this, label.key)} reverse={true}/>
							</li>
						)}
					</ul>
				</div>
				:
				<div className={className ? "text-radios " + className : "text-radios"}>
					<div className="text-radios-title">{title}</div>
					<div className={labelsLength ? 'text-radios-container' : ' unique-chip text-radios-container'}>
						{labels.map(label =>
							<Chip key={label.key}
								  chipClass={forceTwoLines ? 'chip-two-lines ' + 'chip-' + labelsLength : 'chip-' + labelsLength}
								  label={label.text}
								  onClickHandler={this.onClickHandler.bind(this, label.key)}
								  disabled={value !== label.key}/>
						)}
					</div>
				</div>
		);
	}

	onClickHandler(key) {
		this.props.onClickHandler(key);
	}
}
