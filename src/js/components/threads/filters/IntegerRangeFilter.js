import React, { PropTypes, Component } from 'react';
import ThreadSelectedFilter from './ThreadSelectedFilter';
import ThreadUnselectedFilter from './ThreadUnselectedFilter';
import TextInput from '../../ui/TextInput';
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
        handleClickFilter      : PropTypes.func.isRequired,
        // Injected by @translate:
        strings                : PropTypes.object
    };

    constructor(props) {
        super(props);

        this.handleChangeIntegerInput = this.handleChangeIntegerInput.bind(this);
        this.handleChangeMinIntegerInput = this.handleChangeMinIntegerInput.bind(this);
        this.handleChangeMaxIntegerInput = this.handleChangeMaxIntegerInput.bind(this);
    }

    getSelectedFilter() {
        return this.refs.selectedFilter ? this.refs.selectedFilter.getSelectedFilter() : {};
    }

    selectedFilterContains(target) {
        return this.refs.selectedFilter && this.refs.selectedFilter.selectedFilterContains(target);
    }

    handleChangeMinIntegerInput() {
        this.handleChangeIntegerInput('min');
    }

    handleChangeMaxIntegerInput() {
        this.handleChangeIntegerInput('max');
    }

    handleChangeIntegerInput(minOrMax) {
        clearTimeout(this['integerTimeout_' + minOrMax]);
        let {filterKey, filter, data, strings} = this.props;
        data = data || {};
        const value = this.refs[filterKey + '_' + minOrMax] ? parseInt(this.refs[filterKey + '_' + minOrMax].getValue()) : 0;
        if (typeof value === 'number' && (value % 1) === 0 || value === '') {
            const minValue = Math.max(filter.min, parseInt(data.min) || 0);
            const maxValue = Math.max(filter.max, parseInt(data.max) || 0);
            if (typeof value === 'number' && value < minValue) {
                this['integerTimeout_' + minOrMax] = setTimeout(() => {
                    nekunoApp.alert(strings.minValue + minValue);
                }, 1000);
            } else if (typeof value === 'number' && value > maxValue) {
                this['integerTimeout_' + minOrMax] = setTimeout(() => {
                    nekunoApp.alert(strings.maxValue + maxValue);
                }, 1000);
            } else {
                data[minOrMax] = value;
                this.props.handleChangeFilter(filterKey, data);
            }
        } else {
            this['integerTimeout_' + minOrMax] = setTimeout(() => {
                nekunoApp.alert(strings.value);
            }, 1000);
        }
    }

    render() {
        const {filterKey, selected, filter, data, handleClickRemoveFilter, handleClickFilter, strings} = this.props;
        return (
            selected ?
                <ThreadSelectedFilter key={'selected-filter'} ref={'selectedFilter'} type={'integer'} plusIcon={true} handleClickRemoveFilter={handleClickRemoveFilter}>
                    <div className="list-block">
                        <div className="integer-title">{filter.label}</div>
                        <ul>
                            <TextInput ref={filterKey + '_min'} placeholder={strings.placeholderMin} onChange={this.handleChangeMinIntegerInput} defaultValue={data ? data.min : null}/>
                            <TextInput ref={filterKey + '_max'} placeholder={strings.placeholderMax} onChange={this.handleChangeMaxIntegerInput} defaultValue={data ? data.max : null}/>
                        </ul>
                    </div>
                </ThreadSelectedFilter>
                :
                <ThreadUnselectedFilter key={filterKey} filterKey={filterKey} filter={filter} data={data} handleClickFilter={handleClickFilter}/>
        );
    }
}

IntegerRangeFilter.defaultProps = {
    strings: {
        minValue      : 'The minimum value of this value is ',
        maxValue      : 'The maximum value of this value is ',
        value         : 'This value must be an integer',
        placeholderMin: 'Min',
        placeholderMax: 'Max'
    }
};