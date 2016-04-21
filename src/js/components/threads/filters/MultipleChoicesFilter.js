import React, { PropTypes, Component } from 'react';
import ThreadSelectedFilter from './ThreadSelectedFilter';
import ThreadUnselectedFilter from './ThreadUnselectedFilter';
import TextCheckboxes from '../../ui/TextCheckboxes';

export default class MultipleChoicesFilter extends Component {
    static propTypes = {
        selected: PropTypes.bool.isRequired,
        filter: PropTypes.object.isRequired,
        handleClickRemoveFilter: PropTypes.func.isRequired,
        handleChangeFilter: PropTypes.func.isRequired,
        handleClickFilter: PropTypes.func.isRequired
    };

    constructor(props) {
        super(props);

        this.handleClickMultipleChoice = this.handleClickMultipleChoice.bind(this);
    }
    
    getSelectedFilter() {
        return this.refs.selectedFilter ? this.refs.selectedFilter.getSelectedFilter() : {};
    }

    selectedFilterContains(target) {
        return this.refs.selectedFilter && this.refs.selectedFilter.selectedFilterContains(target);
    }

    handleClickMultipleChoice(choice) {
        let {filter} = this.props;
        filter.values = filter.values || [];
        const valueIndex = filter.values.findIndex(value => value === choice);
        if (valueIndex > -1) {
            filter.values.splice(valueIndex, 1);
        } else {
            filter.values.push(choice);
        }
        this.props.handleChangeFilter(filter);
    }

    render() {
        const {selected, filter, handleClickRemoveFilter, handleClickFilter} = this.props;
        return(
            selected ?
                <ThreadSelectedFilter key={'selected-filter'} ref={'selectedFilter'} type={'checkbox'} active={filter.values && filter.values.length > 0} handleClickRemoveFilter={handleClickRemoveFilter}>
                    <TextCheckboxes labels={Object.keys(filter.choices).map(key => { return({key: key, text: filter.choices[key]}) })}
                                    onClickHandler={this.handleClickMultipleChoice} values={filter.values || []} className={'multiple-choice-filter'}
                                    title={filter.label} />
                </ThreadSelectedFilter>
                    :
                <ThreadUnselectedFilter key={filter.key} filter={filter} handleClickFilter={handleClickFilter} />
        );
    }
}