import React, { PropTypes, Component } from 'react';
import ThreadSelectedFilter from './ThreadSelectedFilter';
import TextInput from '../../ui/TextInput';

export default class IntegerSelectedFilter extends Component {
    static propTypes = {
        handleClickRemoveFilter: PropTypes.func.isRequired,
        label: PropTypes.string.isRequired,
        filterKey: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
        valueMin: PropTypes.number,
        valueMax: PropTypes.number,
        min: PropTypes.number.isRequired,
        max: PropTypes.number.isRequired,
        handleChangeIntegerInput: PropTypes.func.isRequired
    };

    constructor(props) {
        super(props);

        this.handleChangeIntegerInput = this.handleChangeIntegerInput.bind(this);
        this.handleChangeMinIntegerInput = this.handleChangeMinIntegerInput.bind(this);
        this.handleChangeMaxIntegerInput = this.handleChangeMaxIntegerInput.bind(this);
    }

    getSelectedFilter() {
        return this.refs.selectedFilter.getSelectedFilter();
    }

    selectedFilterContains(target) {
        return this.refs.selectedFilter.selectedFilterContains(target);
    }

    handleChangeMinIntegerInput() {
        this.handleChangeIntegerInput('min');
    }

    handleChangeMaxIntegerInput() {
        this.handleChangeIntegerInput('max');
    }

    handleChangeIntegerInput(minOrMax) {
        clearTimeout(this.integerTimeout);
        this.integerTimeout = setTimeout(() => {
            const value = parseInt(this.refs[this.props.filterKey + '_' + minOrMax].getValue());
            if (typeof value === 'number' && (value % 1) === 0 || value === '') {
                const minValue = Math.max(this.props.min, parseInt(this.props.valueMin) || 0);
                const maxValue = Math.max(this.props.max, parseInt(this.props.valueMax) || 0);
                if (typeof value === 'number' && value < minValue) {
                    nekunoApp.alert('El valor mínimo de este valor es ' + minValue);
                } else if (typeof value === 'number' && value > maxValue) {
                    nekunoApp.alert('El valor máximo de este valor es ' + maxValue);
                } else {
                    this.props.handleChangeIntegerInput(value, minOrMax);
                }
            } else {
                nekunoApp.alert('Este valor debe ser un entero');
            }
        }, 500);
    }

    render() {
        const {handleClickRemoveFilter, label, filterKey, valueMin, valueMax} = this.props;
        return(
            <ThreadSelectedFilter key={'selected-filter'} ref={'selectedFilter'} type={'integer'} plusIcon={true} handleClickRemoveFilter={handleClickRemoveFilter}>
                <div className="list-block">
                    <div className="integer-title">{label}</div>
                    <ul>
                        <TextInput ref={filterKey + '_min'} placeholder={'Mínimo'} onChange={this.handleChangeMinIntegerInput} defaultValue={valueMin}/>
                        <TextInput ref={filterKey + '_max'} placeholder={'Maximo'} onChange={this.handleChangeMaxIntegerInput} defaultValue={valueMax}/>
                    </ul>
                </div>
            </ThreadSelectedFilter>
        );
    }
}