import React, { PropTypes, Component } from 'react';
import ThreadSelectedFilter from './ThreadSelectedFilter';
import ThreadUnselectedFilter from './ThreadUnselectedFilter';
import TextInput from '../../ui/TextInput';

export default class IntegerRangeFilter extends Component {
    static propTypes = {
        filterKey: PropTypes.string.isRequired,
        selected: PropTypes.bool.isRequired,
        filter: PropTypes.object.isRequired,
        data: PropTypes.object,
        handleClickRemoveFilter: PropTypes.func.isRequired,
        handleChangeFilter: PropTypes.func.isRequired,
        handleClickFilter: PropTypes.func.isRequired
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
        let {filterKey, filter, data} = this.props;
        data = data || {};
        const value = this.refs[filterKey + '_' + minOrMax] ? parseInt(this.refs[filterKey + '_' + minOrMax].getValue()) : 0;
        if (typeof value === 'number' && (value % 1) === 0 || value === '') {
            const minValue = Math.max(filter.min, parseInt(data.min) || 0);
            const maxValue = Math.max(filter.max, parseInt(data.max) || 0);
            if (typeof value === 'number' && value < minValue) {
                this['integerTimeout_' + minOrMax] = setTimeout(() => {
                    nekunoApp.alert('El valor mínimo de este valor es ' + minValue);
                }, 1000);
            } else if (typeof value === 'number' && value > maxValue) {
                this['integerTimeout_' + minOrMax] = setTimeout(() => {
                    nekunoApp.alert('El valor máximo de este valor es ' + maxValue);
                }, 1000);
            } else {
                filter[minOrMax] = value;
                this.props.handleChangeFilter(filterKey, filter);
            }
        } else {
            this['integerTimeout_' + minOrMax] = setTimeout(() => {
                nekunoApp.alert('Este valor debe ser un entero');
            }, 1000);
        }
    }
    
    render() {
        const {filterKey, selected, filter, data, handleClickRemoveFilter, handleClickFilter} = this.props;
        return(
            selected ?
                <ThreadSelectedFilter key={'selected-filter'} ref={'selectedFilter'} type={'integer'} plusIcon={true} handleClickRemoveFilter={handleClickRemoveFilter}>
                    <div className="list-block">
                        <div className="integer-title">{filter.label}</div>
                        <ul>
                            <TextInput ref={filterKey + '_min'} placeholder={'Mínimo'} onChange={this.handleChangeMinIntegerInput} defaultValue={data ? data.min : null}/>
                            <TextInput ref={filterKey + '_max'} placeholder={'Maximo'} onChange={this.handleChangeMaxIntegerInput} defaultValue={data ? data.max : null}/>
                        </ul>
                    </div>
                </ThreadSelectedFilter>
                    :
                <ThreadUnselectedFilter key={filterKey} filterKey={filterKey} filter={filter} data={data} handleClickFilter={handleClickFilter} />
        );
    }
}