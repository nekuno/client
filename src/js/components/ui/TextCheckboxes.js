import PropTypes from 'prop-types';
import React, { Component } from 'react';
import Chip from './Chip/Chip.js';

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
		const {values, labels, title} = this.props;
        const showSelect = labels.length > 40;
		return (
            showSelect ?
				<div className="list-block text-checkboxes">
					<div className="checkbox-title">{title}</div>
					<select onChange={this.onClickOptionHandler.bind(this)}>
                        <option key={'none'} value={''}>{}</option>
                        {labels.map(label => !values.some(value => value == label.key) ?
							<option key={label.key} value={label.key}>{label.text}</option> : null
						)}
					</select>
                    {labels.map(label => values.some(value => value == label.key) ?
						<Chip key={label.key} text={label.text} onClickHandler={this.onClickHandler.bind(this, label.key)}/> : null
                    )}
				</div>
                :
				<div className="text-checkboxes">
					{this.props.title ? <div className="text-checkboxes-title">{this.props.title}</div> : null}
					{this.props.labels.map(label => <Chip key={label.key} text={label.text} onClickHandler={this.onClickHandler.bind(this, label.key)} selected={this.props.values.some(value => value == label.key)} />)}
				</div>
		);
	}

	onClickHandler(key) {
		this.props.onClickHandler(key);
	}

    onClickOptionHandler(event) {
		const {labels} = this.props;
		const value = event.target.value;

		if (labels.some(label => value == label.key)) {
            this.props.onClickHandler(event.target.value);
		}
	}
}
