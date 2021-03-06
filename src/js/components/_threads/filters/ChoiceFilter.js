import PropTypes from 'prop-types';
import React, { Component } from 'react';
import ThreadSelectedFilter from './ThreadSelectedFilter';
import ThreadUnselectedFilter from './ThreadUnselectedFilter';
import TextRadios from '../../ui/TextRadios';

export default class ChoiceFilter extends Component {
    static propTypes = {
        filterKey: PropTypes.string.isRequired,
        selected: PropTypes.bool.isRequired,
        filter: PropTypes.object.isRequired,
        data: PropTypes.string.isRequired,
        handleClickRemoveFilter: PropTypes.func.isRequired,
        handleChangeFilter: PropTypes.func.isRequired,
        handleClickFilter: PropTypes.func.isRequired,
        cantRemove: PropTypes.bool
    };

    constructor(props) {
        super(props);

        this.handleClickChoice = this.handleClickChoice.bind(this);
    }

    handleClickChoice(choice) {
        let {filterKey, data} = this.props;
        if (choice !== data) {
            this.props.handleChangeFilter(filterKey, choice);
        }
    }

    render() {
        const {filterKey, selected, filter, data, handleClickRemoveFilter, handleClickFilter, cantRemove} = this.props;
        return(
            selected ?
                <ThreadSelectedFilter key={'selected-filter'} type={'radio'} active={!!data} handleClickRemoveFilter={handleClickRemoveFilter} cantRemove={cantRemove}>
                    <TextRadios labels={filter.choices.map(choice => { return({key: choice.value, text: choice.label}); }) }
                                onClickHandler={this.handleClickChoice} value={data} className={'choice-filter'}
                                title={filter.label} />
                </ThreadSelectedFilter>
            :
                <ThreadUnselectedFilter key={filterKey} filterKey={filterKey} filter={filter} data={data} handleClickFilter={handleClickFilter} handleClickRemoveFilter={handleClickRemoveFilter} cantRemove={cantRemove}/>
        );
    }
}