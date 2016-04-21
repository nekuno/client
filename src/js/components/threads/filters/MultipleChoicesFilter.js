import React, { PropTypes, Component } from 'react';
import ThreadSelectedFilter from './ThreadSelectedFilter';
import ThreadUnselectedFilter from './ThreadUnselectedFilter';
import TextCheckboxes from '../../ui/TextCheckboxes';

export default class MultipleChoicesFilter extends Component {
    static propTypes = {
        selected: PropTypes.bool.isRequired,
        filter: PropTypes.object.isRequired,
        handleClickRemoveFilter: PropTypes.func.isRequired,
        handleClickMultipleChoice: PropTypes.func.isRequired,
        handleClickFilter: PropTypes.func.isRequired
    };

    getSelectedFilter() {
        return this.refs.selectedFilter ? this.refs.selectedFilter.getSelectedFilter() : {};
    }

    selectedFilterContains(target) {
        return this.refs.selectedFilter && this.refs.selectedFilter.selectedFilterContains(target);
    }

    updateFilterChoice(filter, choice) {
        filter.values = filter.values || [];
        const valueIndex = filter.values.findIndex(value => value === choice);
        if (valueIndex > -1) {
            filter.values.splice(valueIndex, 1);
        } else {
            filter.values.push(choice);
        }

        return filter;
    }

    render() {
        const {selected, filter, handleClickRemoveFilter, handleClickMultipleChoice, handleClickFilter} = this.props;
        return(
            selected ?
                <ThreadSelectedFilter key={'selected-filter'} ref={'selectedFilter'} type={'checkbox'} active={filter.values && filter.values.length > 0} handleClickRemoveFilter={handleClickRemoveFilter}>
                    <TextCheckboxes labels={Object.keys(filter.choices).map(key => { return({key: key, text: filter.choices[key]}) })}
                                    onClickHandler={handleClickMultipleChoice} values={filter.values || []} className={'multiple-choice-filter'}
                                    title={filter.label} />
                </ThreadSelectedFilter>
                    :
                <ThreadUnselectedFilter key={filter.key} filter={filter} handleClickFilter={handleClickFilter} />
        );
    }
}