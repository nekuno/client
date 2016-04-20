import React, { PropTypes, Component } from 'react';
import ThreadSelectedFilter from './ThreadSelectedFilter';
import TextCheckboxes from '../../ui/TextCheckboxes';

export default class MultipleChoicesSelectedFilter extends Component {
    static propTypes = {
        handleClickRemoveFilter: PropTypes.func.isRequired,
        choices: PropTypes.object.isRequired,
        handleClickMultipleChoice: PropTypes.func.isRequired,
        values: PropTypes.array,
        label: PropTypes.string
    };

    getSelectedFilter() {
        return this.refs.selectedFilter.getSelectedFilter();
    }

    selectedFilterContains(target) {
        return this.refs.selectedFilter.selectedFilterContains(target);
    }

    render() {
        const {handleClickRemoveFilter, choices, handleClickMultipleChoice, values, label} = this.props;
        return(
            <ThreadSelectedFilter key={'selected-filter'} ref={'selectedFilter'} type={'checkbox'} active={values && values.length > 0} handleClickRemoveFilter={handleClickRemoveFilter}>
                <TextCheckboxes labels={Object.keys(choices).map(key => { return({key: key, text: choices[key]}) })}
                                onClickHandler={handleClickMultipleChoice} values={values || []} className={'multiple-choice-filter'}
                                title={label} />
            </ThreadSelectedFilter>
        );
    }
}