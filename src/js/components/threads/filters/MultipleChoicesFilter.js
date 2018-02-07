import PropTypes from 'prop-types';
import React, { Component } from 'react';
import ThreadSelectedFilter from './ThreadSelectedFilter';
import ThreadUnselectedFilter from './ThreadUnselectedFilter';
import TextCheckboxes from '../../ui/TextCheckboxes';
import Framework7Service from '../../../services/Framework7Service';

export default class MultipleChoicesFilter extends Component {
    static propTypes = {
        filterKey: PropTypes.string.isRequired,
        selected: PropTypes.bool.isRequired,
        filter: PropTypes.object.isRequired,
        data: PropTypes.array,
        handleClickRemoveFilter: PropTypes.func.isRequired,
        handleChangeFilter: PropTypes.func.isRequired,
        handleClickFilter: PropTypes.func.isRequired,
        cantRemove: PropTypes.bool
    };

    constructor(props) {
        super(props);

        this.handleClickMultipleChoice = this.handleClickMultipleChoice.bind(this);
    }
    
    handleClickMultipleChoice(choice) {
        let {filterKey, data, filter, strings} = this.props;
        data = data || [];
        const valueIndex = data.findIndex(value => value == choice);
        if (valueIndex > -1) {
            data.splice(valueIndex, 1);
        } else {
            if (filter.max && data.length >= filter.max) {
                Framework7Service.nekunoApp().alert(strings.maxChoices.replace('%max%', filter.max));
                return;
            }
            data.push(choice);
        }
        this.props.handleChangeFilter(filterKey, data);
    }

    render() {
        const {filterKey, selected, filter, data, handleClickRemoveFilter, handleClickFilter, cantRemove} = this.props;
        return(
            selected ?
                <ThreadSelectedFilter key={'selected-filter'} type={'checkbox'} active={data && data.length > 0} handleClickRemoveFilter={handleClickRemoveFilter} cantRemove={cantRemove}>
                    <TextCheckboxes labels={Object.keys(filter.choices).map(key => { return({key: key, text: filter.choices[key]}) })}
                                    onClickHandler={this.handleClickMultipleChoice} values={data || []} className={'multiple-choice-filter'}
                                    title={filter.label} />
                </ThreadSelectedFilter>
                    :
                <ThreadUnselectedFilter key={filterKey} filterKey={filterKey} filter={filter} data={data || []} handleClickFilter={handleClickFilter} handleClickRemoveFilter={handleClickRemoveFilter} cantRemove={cantRemove}/>
        );
    }
}

MultipleChoicesFilter.defaultProps = {
    strings: {
        maxChoices: 'Select up to %max% items'
    }
};