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
    };

    handleChangeInputSlider(slider) {
        this.props.handleChangeInputSlider(slider);
    }

    render() {
        const {children, data} = this.props;

        let rangeProps = {
            marks: {10:'10', 50:'50', 100:'100', 250:'250', 500:'500'},
            min: 10,
            max: 500,
            step: 10,
            defaultValue: data,
            handleStyle: [{background: '#756EE5', color: '#756EE5', borderColor: '#756EE5', boxShadow: 'none'}],
            trackStyle: [{background: '#756EE5', color: '#756EE5', borderColor: '#756EE5'}],
            dotStyle: {background: 'transparent', borderColor: 'transparent'},
            activeDotStyle: {background: 'transparent', borderColor: 'transparent'},
            onAfterChange: this.handleChangeInputSlider.bind(this)
        };

        return (
            <SliderCustom {...rangeProps}/>
        );
    }
}