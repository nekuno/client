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
        data                   : PropTypes.number,
        handleClickRemoveFilter: PropTypes.func.isRequired,
        handleChangeFilter     : PropTypes.func.isRequired,
        handleClickFilter      : PropTypes.func.isRequired,
        // Injected by @translate:
        strings                : PropTypes.object
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
        const {filterKey, filter, strings} = this.props;
        const value = this.refs[filterKey] ? parseInt(this.refs[filterKey].getValue()) : 0;
        if (typeof value === 'number' && (value % 1) === 0 || value === '') {
            const minValue = filter.min || 0;
            const maxValue = filter.max || 0;
            if (typeof value === 'number' && value < minValue) {
                this.integerTimeout = setTimeout(() => {
                    nekunoApp.alert(strings.minValue + minValue);
                }, 1000);
            } else if (typeof value === 'number' && value > maxValue) {
                this.integerTimeout = setTimeout(() => {
                    nekunoApp.alert(strings.maxValue + maxValue);
                }, 1000);
            } else {
                this.props.handleChangeFilter(filterKey, value);
            }
        } else {
            this.integerTimeout = setTimeout(() => {
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
                            <TextInput ref={filterKey} placeholder={strings.placeholder} onChange={this.handleChangeIntegerInput} defaultValue={data}/>
                        </ul>
                    </div>
                </ThreadSelectedFilter>
                :
                <ThreadUnselectedFilter key={filterKey} filterKey={filterKey} filter={filter} data={data} handleClickFilter={handleClickFilter}/>
        );
    }
}

IntegerFilter.defaultProps = {
    strings: {
        minValue   : 'The minimum value of this value is ',
        maxValue   : 'The maximum value of this value is ',
        value      : 'This value must be an integer',
        placeholder: 'Type a number'
    }
};