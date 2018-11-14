import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { createSliderWithTooltip } from 'rc-slider';
import Slider from 'rc-slider';
const Range = createSliderWithTooltip(Slider.Range);
import styles from './InputNumberRange.scss';
import 'rc-slider/assets/index.css';

export default class InputNumberRange extends Component {

    static propTypes = {
        title  : PropTypes.string,
        value  : PropTypes.array,
        minNum: PropTypes.number.isRequired,
        maxNum: PropTypes.number.isRequired,
        onChangeHandler : PropTypes.func.isRequired
    };

    handleChangeRange(range) {
        this.props.onChangeHandler(range);
    }

    render() {
        const {value, minNum, maxNum} = this.props;
        let rangeProps = {
            marks: {[minNum]: minNum, [Math.round((maxNum + minNum) / 2)]: Math.round((maxNum + minNum) / 2), [maxNum]: maxNum},
            min: minNum,
            max: maxNum,
            defaultValue: value,
            handleStyle: [{background: '#756EE5', color: '#756EE5', borderColor: '#756EE5', boxShadow: 'none'}],
            trackStyle: [{background: '#756EE5', color: '#756EE5', borderColor: '#756EE5'}],
            dotStyle: {background: 'transparent', borderColor: 'transparent'},
            activeDotStyle: {background: 'transparent', borderColor: 'transparent'},
            onAfterChange: this.handleChangeRange.bind(this)
        };
        if (!value) {
            rangeProps.value = [minNum, minNum];
        }

        return (
            <div className={styles.inputNumberRange}>
                <div className={styles.title + ' small'}>
                    {this.props.title}
                </div>
                <div className={styles.range}>
                    <Range {...rangeProps}/>
                </div>
            </div>
        );
    }
}