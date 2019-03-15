import PropTypes from 'prop-types';
import React, { Component } from 'react';
import SelectMultiple from '../../ui/SelectMultiple/SelectMultiple.js';
import Framework7Service from '../../../services/Framework7Service';

export default class MultipleChoicesFilter extends Component {
    static propTypes = {
        filterKey         : PropTypes.string.isRequired,
        filter            : PropTypes.object.isRequired,
        data              : PropTypes.array,
        handleChangeFilter: PropTypes.func.isRequired,
        color             : PropTypes.string,
    };

    constructor(props) {
        super(props);

        this.handleClickMultipleChoice = this.handleClickMultipleChoice.bind(this);
    }

    handleClickMultipleChoice(choice) {
        let {filterKey, data, filter, strings} = this.props;
        data = data || [];
        const valueIndex = data.findIndex(value => value == choice);
        if (valueIndex > -1) {
            data.splice(valueIndex, 1);
        } else {
            if (filter.max && data.length >= filter.max) {
                Framework7Service.nekunoApp().alert(strings.maxChoices.replace('%max%', filter.max));
                return;
            }
            data.push(choice);
        }
        this.props.handleChangeFilter(filterKey, data);
    }

    render() {
        const {filter, data, color} = this.props;
        return (
            <SelectMultiple labels={filter.choices}
                            onClickHandler={this.handleClickMultipleChoice}
                            values={data || []}
                            title={filter.label}
                            color={color}
            />
        );
    }
}

MultipleChoicesFilter.defaultProps = {
    strings: {
        maxChoices: 'SelectMultiple up to %max% items'
    }
};