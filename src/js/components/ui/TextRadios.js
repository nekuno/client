import PropTypes from 'prop-types';
import React, { Component } from 'react';
import Chip from './Chip';
import InputRadio from './InputRadio';

export default class TextRadios extends Component {
	static propTypes = {
		title		  : PropTypes.string,
		labels	      : PropTypes.array.isRequired,
		value	      : PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
		onClickHandler: PropTypes.func.isRequired,
		forceTwoLines : PropTypes.bool,
        className     : PropTypes.string,
        disabled      : PropTypes.bool,
    };

	constructor(props) {
		super(props);
	}

	getRadiosClassname(props) {
        const {className, disabled} = props;

        let finalClassName = 'text-radios';
        if (className) {
            finalClassName += ' ' + className;
        }
        if (disabled) {
            finalClassName += ' text-radios-disabled';
        }

        return finalClassName
    }

	render() {
		const {title, labels, value, forceTwoLines, className} = this.props;
		let labelsLength = labels.length;
		let labelsTextLength = 0;
		labels.forEach(label => labelsTextLength += label.text.length);
		const showSelect = labelsLength > 40;
		let showCheckboxesList = !showSelect && !forceTwoLines && (labelsLength > 3 || labelsTextLength > 35);
		const radiosClassName = this.getRadiosClassname(this.props);
		return (
            showSelect ?
				<div className={className ? "list-block text-radios " + className : "list-block text-radios"}>
					<div className="checkbox-title">{title}</div>
					<select value={value} onChange={this.onClickOptionHandler.bind(this)}>
						{!labels.some(label => label.key === value) ? <option key={'none'} value={value}>{}</option> : null}
						{labels.map(label => <option key={label.key} value={label.key}>{label.text}</option>)}
					</select>
				</div>
				:
				showCheckboxesList ?
					<div className={className ? "list-block " + className : "list-block"}>
						<div className="checkbox-title">{title}</div>
						<ul className="checkbox-list">
							{labels.map(label =>
								<li key={label.key}>
									<InputRadio value={label.key} text={label.text} checked={value === label.key} onClickHandler={this.onClickHandler.bind(this, label.key)} reverse={true}/>
								</li>
							)}
						</ul>
					</div>
					:
					<div id="joyride-3-answer-importance" className={radiosClassName}>
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
	    if (this.props.disabled){
	        return;
        }

		this.props.onClickHandler(key);
	}


    onClickOptionHandler(event) {
        if (this.props.disabled){
            return;
        }

        this.props.onClickHandler(event.target.value);
    }
}

TextRadios.defaultProps = {
    disabled: false,
};
