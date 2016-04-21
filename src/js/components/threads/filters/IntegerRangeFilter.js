import React, { PropTypes, Component } from 'react';
import ThreadSelectedFilter from './ThreadSelectedFilter';
import ThreadUnselectedFilter from './ThreadUnselectedFilter';
import TextInput from '../../ui/TextInput';

export default class IntegerRangeFilter extends Component {
    static propTypes = {
        selected: PropTypes.bool.isRequired,
        filter: PropTypes.object.isRequired,
        handleClickRemoveFilter: PropTypes.func.isRequired,
        handleChangeIntegerInput: PropTypes.func.isRequired,
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
        clearTimeout(this.integerTimeout);
        const {filter} = this.props;
        const value = this.refs[filter.key + '_' + minOrMax] ? parseInt(this.refs[filter.key + '_' + minOrMax].getValue()) : 0;
        if (typeof value === 'number' && (value % 1) === 0 || value === '') {
            const minValue = Math.max(filter.min, parseInt(filter.value_min) || 0);
            const maxValue = Math.max(filter.max, parseInt(filter.value_max) || 0);
            if (typeof value === 'number' && value < minValue) {
                this.integerTimeout = setTimeout(() => {
                    nekunoApp.alert('El valor mínimo de este valor es ' + minValue);
                }, 1000);
            } else if (typeof value === 'number' && value > maxValue) {
                this.integerTimeout = setTimeout(() => {
                    nekunoApp.alert('El valor máximo de este valor es ' + maxValue);
                }, 1000);
            } else {
                this.props.handleChangeIntegerInput(value, minOrMax);
            }
        } else {
            this.integerTimeout = setTimeout(() => {
                nekunoApp.alert('Este valor debe ser un entero');
            }, 1000);
        }
    }

    updateFilterInteger(filter, value, minOrMax) {
        filter['value_' + minOrMax] = value;
        
        return filter;
    }
    
    render() {
        const {selected, filter, handleClickRemoveFilter, handleClickFilter} = this.props;
        return(
            selected ?
                <ThreadSelectedFilter key={'selected-filter'} ref={'selectedFilter'} type={'integer'} plusIcon={true} handleClickRemoveFilter={handleClickRemoveFilter}>
                    <div className="list-block">
                        <div className="integer-title">{filter.label}</div>
                        <ul>
                            <TextInput ref={filter.key + '_min'} placeholder={'Mínimo'} onChange={this.handleChangeMinIntegerInput} defaultValue={filter.value_min}/>
                            <TextInput ref={filter.key + '_max'} placeholder={'Maximo'} onChange={this.handleChangeMaxIntegerInput} defaultValue={filter.value_max}/>
                        </ul>
                    </div>
                </ThreadSelectedFilter>
                    :
                <ThreadUnselectedFilter key={filter.key} filter={filter} handleClickFilter={handleClickFilter} />
        );
    }
}