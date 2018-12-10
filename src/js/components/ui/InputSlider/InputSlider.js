import PropTypes from 'prop-types';
import React, { Component } from 'react';
import styles from './InputSlider.scss';
import { createSliderWithTooltip } from 'rc-slider';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';
const SliderCustom = createSliderWithTooltip(Slider);

export default class InputSlider extends Component {

    static propTypes = {
        handleChangeInputSlider : PropTypes.func.isRequired,
        data                    : PropTypes.number,
        color                   : PropTypes.string,
    };

    handleChangeInputSlider(slider) {
        this.props.handleChangeInputSlider(slider);
    }

    render() {
        const {children, data, color} = this.props;

        let rangeProps = {
            marks: {10:'10', 50:'50', 100:'100', 250:'250', 500:'500'},
            min: 10,
            max: 500,
            step: 10,
            defaultValue: data,
            handleStyle: [{background: color, color: color, borderColor: color, boxShadow: 'none'}],
            trackStyle: [{background: color, color: color, borderColor: color}],
            railStyle: {background: color, borderColor: color},
            dotStyle: {background: color, borderColor: color},
            activeDotStyle: {background: color, borderColor: color},
            onAfterChange: this.handleChangeInputSlider.bind(this)
        };

        return (
            <div className={styles.inputSlider}>
                <SliderCustom {...rangeProps}/>
            </div>
        );
    }
}