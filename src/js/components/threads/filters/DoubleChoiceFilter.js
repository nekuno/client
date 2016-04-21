import React, { PropTypes, Component } from 'react';
import ThreadSelectedFilter from './ThreadSelectedFilter';
import ThreadUnselectedFilter from './ThreadUnselectedFilter';
import TextRadios from '../../ui/TextRadios';

export default class DoubleChoiceFilter extends Component {
    static propTypes = {
        selected: PropTypes.bool.isRequired,
        filter: PropTypes.object.isRequired,
        handleClickRemoveFilter: PropTypes.func.isRequired,
        handleClickDoubleChoiceChoice: PropTypes.func.isRequired,
        handleClickDoubleChoiceDetail: PropTypes.func.isRequired,
        handleClickFilter: PropTypes.func.isRequired
    };

    getSelectedFilter() {
        return this.refs.selectedFilter ? this.refs.selectedFilter.getSelectedFilter() : {};
    }

    selectedFilterContains(target) {
        return this.refs.selectedFilter && this.refs.selectedFilter.selectedFilterContains(target);
    }

    render() {
        const {selected, filter, handleClickRemoveFilter, handleClickDoubleChoiceChoice, handleClickDoubleChoiceDetail, handleClickFilter} = this.props;
        return(
            selected ?
                <ThreadSelectedFilter key={'selected-filter'} ref={'selectedFilter'} type={'radio'} active={filter.choice ? true : false} handleClickRemoveFilter={handleClickRemoveFilter}>
                    <div className="double-choice-filter">
                        <TextRadios labels={Object.keys(filter.choices).map(choice => { return({key: choice, text: filter.choices[choice]}); }) }
                                    onClickHandler={handleClickDoubleChoiceChoice} value={filter.choice} className={'double-choice-choice'}
                                    title={filter.label} />
                        {filter.choice ?
                            <TextRadios labels={Object.keys(filter.doubleChoices[filter.choice]).map(doubleChoice => { return({key: doubleChoice, text: filter.doubleChoices[filter.choice][doubleChoice]}); }) }
                                        onClickHandler={handleClickDoubleChoiceDetail} value={filter.detail} className={'double-choice-detail'}/>
                            : ''}
                    </div>
                </ThreadSelectedFilter>
                    :
                <ThreadUnselectedFilter key={filter.key} filter={filter} handleClickFilter={handleClickFilter} />
        );
    }
}