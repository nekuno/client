import React, { PropTypes, Component } from 'react';
import ThreadSelectedFilter from './ThreadSelectedFilter';
import ThreadUnselectedFilter from './ThreadUnselectedFilter';
import TextRadios from '../../ui/TextRadios';

export default class ChoiceFilter extends Component {
    static propTypes = {
        filterKey: PropTypes.string.isRequired,
        selected: PropTypes.bool.isRequired,
        filter: PropTypes.object.isRequired,
        data: PropTypes.object.isRequired,
        handleClickRemoveFilter: PropTypes.func.isRequired,
        handleChangeFilter: PropTypes.func.isRequired,
        handleClickFilter: PropTypes.func.isRequired
    };

    constructor(props) {
        super(props);

        this.handleClickChoice = this.handleClickChoice.bind(this);
    }
    
    getSelectedFilter() {
        return this.refs.selectedFilter ? this.refs.selectedFilter.getSelectedFilter() : {};
    }

    selectedFilterContains(target) {
        return this.refs.selectedFilter && this.refs.selectedFilter.selectedFilterContains(target);
    }

    handleClickChoice(choice) {
        let {filterKey, data} = this.props;
        if (choice !== data) {
            this.props.handleChangeFilter(filterKey, choice);
        }
    }

    render() {
        const {filterKey, selected, filter, data, handleClickRemoveFilter, handleClickFilter} = this.props;
        return(
            selected ?
                <ThreadSelectedFilter key={'selected-filter'} ref={'selectedFilter'} type={'radio'} active={data ? true : false} handleClickRemoveFilter={handleClickRemoveFilter}>
                    <TextRadios labels={filter.choices.map(choice => { return({key: choice.value, text: choice.label}); }) }
                                onClickHandler={this.handleClickChoice} value={data} className={'choice-filter'}
                                title={filter.label} />
                </ThreadSelectedFilter>
            :
                <ThreadUnselectedFilter key={filterKey} filterKey={filterKey} filter={filter} data={data} handleClickFilter={handleClickFilter} />
        );
    }
}