import PropTypes from 'prop-types';
import React, { Component } from 'react';
import InputRadio from './InputRadio';

export default class TextRadiosWithImages extends Component {
    static propTypes = {
        title         : PropTypes.string,
        labels        : PropTypes.array.isRequired,
        value         : PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
        onClickHandler: PropTypes.func.isRequired,
        className     : PropTypes.string,
        disabled      : PropTypes.bool,
    };

    constructor(props) {
        super(props);
    }

    render() {
        const {title, labels, value, className} = this.props;
        return (
            <div className={className ? "list-block " + className : "list-block"}>
                <div className="checkbox-title">{title}</div>
                <ul className="checkbox-list">
                    {labels.map(label =>
                        <li key={label.key}>
                            <InputRadio value={label.key} text={label.text} checked={value === label.key} onClickHandler={this.onClickHandler.bind(this, label.key)} reverse={true} image={label.image}/>
                        </li>
                    )}
                </ul>
            </div>

        );
    }

    onClickHandler(key) {
        if (this.props.disabled) {
            return;
        }

        this.props.onClickHandler(key);
    }

    onClickOptionHandler(event) {
        if (this.props.disabled) {
            return;
        }

        this.props.onClickHandler(event.target.value);
    }
}

TextRadiosWithImages.defaultProps = {
    disabled: false,
};
