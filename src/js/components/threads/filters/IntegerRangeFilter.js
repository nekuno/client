import React, { PropTypes, Component } from 'react';
import ThreadSelectedFilter from './ThreadSelectedFilter';
import ThreadUnselectedFilter from './ThreadUnselectedFilter';
import Input from '../../ui/Input';
import translate from '../../../i18n/Translate';

@translate('IntegerRangeFilter')
export default class IntegerRangeFilter extends Component {

    static propTypes = {
        filterKey              : PropTypes.string.isRequired,
        selected               : PropTypes.bool.isRequired,
        filter                 : PropTypes.object.isRequired,
        data                   : PropTypes.object,
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
            valueMin: props.data && props.data.min ? props.data.min : '',
            valueMax: props.data && props.data.max ? props.data.max : ''
        }
    }

    componentWillUpdate(nextProps, nextState) {
        const {filterKey, filter, selected, handleChangeFilter, handleErrorFilter, strings} = this.props;
        let {data} = this.props;
        const {valueMin, valueMax} = nextState;
        const minValue = filter.min;
        const maxValue = filter.max;
        let error = '';
        if (selected && !nextProps.selected) {

            if (null !== valueMin && isNaN(valueMin)) {
                error += strings.value + '.\n';
            }

            if ((null !== valueMin && valueMin < minValue ) || (null !== valueMax && valueMax < minValue)) {
                error += strings.minValue + minValue + '.\n';
            }

            if ((null !== valueMin && valueMin > maxValue ) || (null !== valueMax && valueMax > maxValue)) {
                error += strings.maxValue + maxValue + '.\n';
            }

            if (!error && null !== valueMax && null !== valueMin && valueMax < valueMin) {
                error += strings.minMaxValue + '.\n';
            }

            if (error) {
                handleErrorFilter(filterKey, error);
            } else {
                data = data || {};
                data.min = valueMin;
                data.max = valueMax;
                handleChangeFilter(filterKey, data);
            }
        }
    }

    handleChangeIntegerInput() {
        const {filterKey} = this.props;
        const valueMin = this.refs[filterKey + '_min'].getValue() ? parseInt(this.refs[filterKey + '_min'].getValue()) : null;
        const valueMax = this.refs[filterKey + '_max'].getValue() ? parseInt(this.refs[filterKey + '_max'].getValue()) : null;
        this.setState({
            valueMin: valueMin,
            valueMax: valueMax
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
                            <Input ref={filterKey + '_min'} placeholder={strings.placeholderMin} type="number" onChange={this.handleChangeIntegerInput} defaultValue={data ? data.min : null}/>
                            <Input ref={filterKey + '_max'} placeholder={strings.placeholderMax} type="number" onChange={this.handleChangeIntegerInput} defaultValue={data ? data.max : null}/>
                        </ul>
                    </div>
                </ThreadSelectedFilter>
                :
                <ThreadUnselectedFilter key={filterKey} filterKey={filterKey} filter={filter} data={data} handleClickFilter={handleClickFilter} handleClickRemoveFilter={handleClickRemoveFilter}/>
        );
    }
}

IntegerRangeFilter.defaultProps = {
    strings: {
        minValue      : 'The minimum value is ',
        maxValue      : 'The maximum value is ',
        minMaxValue   : 'The maximum value must be equal or greater than minimum value',
        value         : 'The value must be an integer',
        placeholderMin: 'Min',
        placeholderMax: 'Max'
    }
};