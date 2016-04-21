import React, { PropTypes, Component } from 'react';
import ThreadSelectedFilter from './ThreadSelectedFilter';
import ThreadUnselectedFilter from './ThreadUnselectedFilter';
import TextRadios from '../../ui/TextRadios';

export default class ChoiceFilter extends Component {
    static propTypes = {
        selected: PropTypes.bool.isRequired,
        filter: PropTypes.object.isRequired,
        handleClickRemoveFilter: PropTypes.func.isRequired,
        handleClickChoice: PropTypes.func.isRequired,
        handleClickFilter: PropTypes.func.isRequired
    };

    getSelectedFilter() {
        return this.refs.selectedFilter ? this.refs.selectedFilter.getSelectedFilter() : {};
    }

    selectedFilterContains(target) {
        return this.refs.selectedFilter && this.refs.selectedFilter.selectedFilterContains(target);
    }

    render() {
        const {selected, filter, handleClickRemoveFilter, handleClickChoice, handleClickFilter} = this.props;
        return(
            selected ?
                <ThreadSelectedFilter key={'selected-filter'} ref={'selectedFilter'} type={'radio'} active={filter.choice ? true : false} handleClickRemoveFilter={handleClickRemoveFilter}>
                    <TextRadios labels={filter.choices.map(choice => { return({key: choice.value, text: choice.label}); }) }
                                onClickHandler={handleClickChoice} value={filter.choice} className={'choice-filter'}
                                title={filter.label} />
                </ThreadSelectedFilter>
            : 
                <ThreadUnselectedFilter key={filter.key} filter={filter} handleClickFilter={handleClickFilter} />
        );
    }
}