import PropTypes from 'prop-types';
import React, { Component } from 'react';
import InputNumberRange from '../../ui/InputNumberRange/InputNumberRange.js';

export default class IntegerRangeFilter extends Component {

    static propTypes = {
        filterKey              : PropTypes.string.isRequired,
        filter                 : PropTypes.object.isRequired,
        data                   : PropTypes.object,
        handleChangeFilter     : PropTypes.func.isRequired,
        color                  : PropTypes.string,
    };

    constructor(props) {
        super(props);

        this.handleChangeIntegerInput = this.handleChangeIntegerInput.bind(this);
    }

    handleChangeIntegerInput(values) {
        const {filterKey} = this.props;
        const valueMin = values[0];
        const valueMax = values[1];

        this.props.handleChangeFilter(filterKey, {min: valueMin, max: valueMax});
    }

    render() {
        const {filter, data, color} = this.props;
        const value = data && data.min && data.max ? [data.min, data.max] : null;

        return (
            <InputNumberRange minNum={filter.min} maxNum={filter.max} value={value} title={filter.label} color={color} onChangeHandler={this.handleChangeIntegerInput}/>
        );
    }
}
