import React, { PropTypes, Component } from 'react';
import ThreadSelectedFilter from './ThreadSelectedFilter';
import ThreadUnselectedFilter from './ThreadUnselectedFilter';
import TextInput from '../../ui/TextInput';
import translate from '../../../i18n/Translate';

@translate('IntegerFilter')
export default class IntegerFilter extends Component {

    static propTypes = {
        filterKey              : PropTypes.string.isRequired,
        selected               : PropTypes.bool.isRequired,
        filter                 : PropTypes.object.isRequired,
        data                   : PropTypes.oneOfType([PropTypes.object, PropTypes.number]),
        handleClickRemoveFilter: PropTypes.func.isRequired,
        handleChangeFilter     : PropTypes.func.isRequired,
        handleErrorFilter      : PropTypes.func.isRequired,
        handleClickFilter      : PropTypes.func.isRequired,
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

    componentWillUpdate(nextProps, nextState) {
        const {filterKey, filter, selected, handleChangeFilter, handleErrorFilter, strings} = this.props;
        const {value} = nextState;
        const minValue = filter.min;
        const maxValue = filter.max;
        let error = '';
        if (selected && !nextProps.selected) {
            if (typeof value !== 'number' || isNaN(value)) {
                error += strings.value + '.\n';
            }
            if (value < minValue) {
                error += strings.minValue + minValue + '.\n';
            }
            if (value > maxValue) {
                error += strings.maxValue + maxValue + '.\n';
            }

            if (error) {
                handleErrorFilter(filterKey, error);
            } else {
                handleChangeFilter(filterKey, value);
            }
        }
    }

    handleChangeIntegerInput() {
        const {filterKey} = this.props;
        const value = this.refs[filterKey] ? parseInt(this.refs[filterKey].getValue()) : 0;
        this.setState({
            value: value,
        });
    }

    render() {
        const {filterKey, selected, filter, data, handleClickRemoveFilter, handleClickFilter, strings} = this.props;
        return (
            selected ?
                <ThreadSelectedFilter key={'selected-filter'} type={'integer'} plusIcon={true} handleClickRemoveFilter={handleClickRemoveFilter}>
                    <div className="list-block">
                        <div className="integer-title">{filter.label}</div>
                        <ul>
                            <TextInput ref={filterKey} placeholder={strings.placeholder} onChange={this.handleChangeIntegerInput} defaultValue={typeof data == 'number' ? data : null}/>
                        </ul>
                    </div>
                </ThreadSelectedFilter>
                :
                <ThreadUnselectedFilter key={filterKey} filterKey={filterKey} filter={filter} data={typeof data == 'number' ? data : null} handleClickFilter={handleClickFilter} handleClickRemoveFilter={handleClickRemoveFilter}/>
        );
    }
}

IntegerFilter.defaultProps = {
    strings: {
        minValue   : 'The minimum value is ',
        maxValue   : 'The maximum value is ',
        value      : 'The value must be an integer',
        placeholder: 'Type a number'
    }
};