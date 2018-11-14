import PropTypes from 'prop-types';
import React, { Component } from 'react';
import Input from '../Input/Input.js';
import styles from './InputNumber.scss';

export default class InputNumber extends Component {

    static propTypes = {
        title       : PropTypes.string,
        placeholder : PropTypes.string,
        defaultValue: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
        doNotFocus  : PropTypes.bool,
        doNotScroll : PropTypes.bool,
        onChange    : PropTypes.func,
        maxNum      : PropTypes.number,
        minNum      : PropTypes.number,
        size        : PropTypes.oneOf(['regular', 'small'])
    };

    constructor(props) {
        super(props);

        this.onChange = this.onChange.bind(this);

        this.state = {
            isValid: true
        }
    }

    onChange(value) {
        const {minNum, maxNum} = this.props;
        value = parseInt(value);

        if (value < minNum) {
            this.setState({isValid: false});
        } else if (value > maxNum) {
            this.setState({isValid: false});
        } else if (value) {
            this.setState({isValid: true});
            this.props.onChange(value)
        }
    }

    render() {
        const {isValid} = this.state;
        const textColor = isValid ? '' : 'red';
        return (
            <div className={styles.inputNumber}>
                <div className={styles.title + ' small'}>
                    {this.props.title}
                </div>
                <Input {...this.props} type={'number'} onChange={this.onChange} textColor={textColor}/>
            </div>
        );
    }
}