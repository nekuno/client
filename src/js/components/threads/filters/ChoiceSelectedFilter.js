import React, { PropTypes, Component } from 'react';
import ThreadSelectedFilter from '../ThreadSelectedFilter';
import TextRadios from '../../ui/TextRadios';

export default class ChoiceSelectedFilter extends Component {
    static propTypes = {
        handleClickRemoveFilter: PropTypes.func.isRequired,
        choices: PropTypes.array.isRequired,
        handleClickChoice: PropTypes.func.isRequired,
        choice: PropTypes.string,
        label: PropTypes.string
    };

    getSelectedFilter() {
        return this.refs.selectedFilter.getSelectedFilter();
    }

    selectedFilterContains(target) {
        return this.refs.selectedFilter.selectedFilterContains(target);
    }

    render() {
        const {handleClickRemoveFilter, choices, handleClickChoice, choice, label} = this.props;
        return(
            <ThreadSelectedFilter key={'selected-filter'} ref={'selectedFilter'} type={'radio'} active={choice ? true : false} handleClickRemoveFilter={handleClickRemoveFilter}>
                <TextRadios labels={choices.map(choice => { return({key: choice.value, text: choice.label}); }) }
                            onClickHandler={handleClickChoice} value={choice} className={'choice-filter'}
                            title={label} />
            </ThreadSelectedFilter>
        );
    }
}