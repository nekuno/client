import React, { PropTypes, Component } from 'react';
import SelectedEdit from './SelectedEdit';
import UnselectedEdit from './UnselectedEdit';
import TextInput from '../../ui/TextInput';

export default class IntegerFilter extends Component {
    static propTypes = {
        filterKey: PropTypes.string.isRequired,
        selected: PropTypes.bool.isRequired,
        metadata: PropTypes.object.isRequired,
        data: PropTypes.number,
        handleClickRemoveFilter: PropTypes.func.isRequired,
        handleChangeFilter: PropTypes.func.isRequired,
        handleClickFilter: PropTypes.func.isRequired
    };

    constructor(props) {
        super(props);

        this.handleChangeIntegerInput = this.handleChangeIntegerInput.bind(this);
    }

    getSelectedFilter() {
        return this.refs.selectedFilter ? this.refs.selectedFilter.getSelectedFilter() : {};
    }

    selectedFilterContains(target) {
        return this.refs.selectedFilter && this.refs.selectedFilter.selectedFilterContains(target);
    }

    handleChangeIntegerInput() {
        clearTimeout(this.integerTimeout);
        const {filterKey, metadata} = this.props;
        const value = this.refs[filterKey] ? parseInt(this.refs[filterKey].getValue()) : 0;
        if (typeof value === 'number' && (value % 1) === 0 || value === '') {
            const minValue = metadata.min || 0;
            const maxValue = metadata.max || 0;
            if (typeof value === 'number' && value < minValue) {
                this.integerTimeout = setTimeout(() => {
                    nekunoApp.alert('El valor mínimo de este valor es ' + minValue);
                }, 1000);
            } else if (typeof value === 'number' && value > maxValue) {
                this.integerTimeout = setTimeout(() => {
                    nekunoApp.alert('El valor máximo de este valor es ' + maxValue);
                }, 1000);
            } else {
                this.props.handleChangeFilter(filterKey, value);
            }
        } else {
            this.integerTimeout = setTimeout(() => {
                nekunoApp.alert('Este valor debe ser un entero');
            }, 1000);
        }
    }
    
    render() {
        const {filterKey, selected, metadata, data, handleClickRemoveFilter, handleClickFilter} = this.props;
        return(
            selected ?
                <SelectedEdit key={'selected-filter'} ref={'selectedFilter'} type={'integer'} plusIcon={true} handleClickRemoveFilter={handleClickRemoveFilter}>
                    <div className="list-block">
                        <div className="integer-title">{metadata.label}</div>
                        <ul>
                            <TextInput ref={filterKey} placeholder={'Escribe un número'} onChange={this.handleChangeIntegerInput} defaultValue={data}/>
                        </ul>
                    </div>
                </SelectedEdit>
                    :
                <UnselectedEdit key={filterKey} filterKey={filterKey} filter={metadata} data={data} handleClickFilter={handleClickFilter} />
        );
    }
}