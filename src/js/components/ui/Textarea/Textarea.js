import PropTypes from 'prop-types';
import React, { Component } from 'react';
import styles from './Textarea.scss';

export default class Textarea extends Component {

    static propTypes = {
        placeholder : PropTypes.string,
        defaultValue: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
        onChange    : PropTypes.func
    };

    constructor(props) {
        super(props);

        this.state = {
            empty: !props.defaultValue,
            focused: false
        };

        this.onChange = this.onChange.bind(this);
        this.getValue = this.getValue.bind(this);
    }

    setValue(value) {
        if (this.refs.textarea) {
            this.refs.textarea.value = value;
        }
    }

    getValue() {
        return this.refs.textarea ? this.refs.textarea.value : null;
    }

    onChange() {
        if (this.props.onChange) {
            this.props.onChange(this.getValue());
        }

        this.setState({empty: !this.getValue()});
    }

    render() {
        const {placeholder, defaultValue} = this.props;
        const {empty} = this.state;


        return (
            <div className={styles.inputWrapper}>
                <div className={styles.input}>
                    <textarea ref="textarea" placeholder={placeholder} value={this.state.value} onChange={this.onChange} defaultValue={defaultValue} />
                </div>
            </div>
        );
    }
}