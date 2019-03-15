import PropTypes from 'prop-types';
import React, { Component } from 'react';
import InputNumber from '../../ui/InputNumber/InputNumber.js';
import translate from '../../../i18n/Translate';

@translate('IntegerFilter')
export default class IntegerFilter extends Component {

    static propTypes = {
        filterKey              : PropTypes.string.isRequired,
        filter                 : PropTypes.object.isRequired,
        data                   : PropTypes.oneOfType([PropTypes.object, PropTypes.number]),
        handleChangeFilter     : PropTypes.func.isRequired,
        // Injected by @translate:
        strings                : PropTypes.object
    };

    constructor(props) {
        super(props);

        this.handleChangeIntegerInput = this.handleChangeIntegerInput.bind(this);

        this.state = {
            value: props.data && typeof props.data == 'number' ? props.data : '',
        }
    }

    handleChangeIntegerInput(value) {
        const {filterKey} = this.props;

        this.setState({
            value: value,
        });

        this.props.handleChangeFilter(filterKey, value);
    }

    render() {
        const {filterKey, filter, data, strings} = this.props;
        return (
            <InputNumber ref={filterKey}
                         placeholder={strings.placeholder}
                         onChange={this.handleChangeIntegerInput}
                         defaultValue={typeof data == 'number' ? data : null}
                         doNotFocus={true}
                         title={filter.label}
                         size={'small'}
                         minNum={filter.min}
                         maxNum={filter.max}
            />
        );
    }
}

IntegerFilter.defaultProps = {
    strings: {
        placeholder: 'Type a number'
    }
};