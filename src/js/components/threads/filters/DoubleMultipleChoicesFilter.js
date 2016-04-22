import React, { PropTypes, Component } from 'react';
import ThreadSelectedFilter from './ThreadSelectedFilter';
import ThreadUnselectedFilter from './ThreadUnselectedFilter';
import TextCheckboxes from '../../ui/TextCheckboxes';

export default class DoubleMultipleChoicesFilter extends Component {
    static propTypes = {
        selected: PropTypes.bool.isRequired,
        filter: PropTypes.object.isRequired,
        handleClickRemoveFilter: PropTypes.func.isRequired,
        handleChangeFilter: PropTypes.func.isRequired,
        handleClickFilter: PropTypes.func.isRequired
    };
    
    constructor(props) {
        super(props);

        this.handleClickDoubleMultipleChoiceChoice = this.handleClickDoubleMultipleChoiceChoice.bind(this);
        this.handleClickDoubleMultipleChoiceDetail = this.handleClickDoubleMultipleChoiceDetail.bind(this);
        
        this.state = {
            selectedChoice: ''
        };
    }

    getSelectedFilter() {
        return this.refs.selectedFilter ? this.refs.selectedFilter.getSelectedFilter() : {};
    }

    selectedFilterContains(target) {
        return this.refs.selectedFilter && this.refs.selectedFilter.selectedFilterContains(target);
    }

    handleClickDoubleMultipleChoiceChoice(choice) {
        let {filter} = this.props;
        filter.values = filter.values || [];
        let choiceValues = filter.values.filter(value => value.choice === choice);
        let otherValues = filter.values.filter(value => value.choice !== choice);
        if (choiceValues.length === 0) {
            const newIndex = filter.values.length;
            filter.values[newIndex] = {choice: choice};
            this.setState({
                selectedChoice: choice
            });
        } else {
            filter.values = otherValues;
            this.setState({
                selectedChoice: ''
            });
        }

        this.props.handleChangeFilter(filter);
    }

    handleClickDoubleMultipleChoiceDetail(detail) {
        let {filter} = this.props;
        let {selectedChoice} = this.state;
        let choiceWithNoDetailIndex = filter.values.findIndex(value => value.choice === selectedChoice && !value.detail);
        let detailIndex = filter.values.findIndex(value => value.choice === selectedChoice && value.detail === detail);
        if (detailIndex > -1) {
            filter.values[detailIndex].detail = null;
        } else {
            const index = choiceWithNoDetailIndex > -1 ? choiceWithNoDetailIndex : filter.values.length;
            filter.values[index] = filter.values[index] || {choice: selectedChoice};
            filter.values[index].detail = detail;
        }
        this.props.handleChangeFilter(filter);
    }

    render() {
        const {selected, filter, handleClickRemoveFilter, handleClickFilter} = this.props;
        const {selectedChoice} = this.state;
        filter.values = filter.values || [];
        return(
            selected ?
                <ThreadSelectedFilter key={'selected-filter'} ref={'selectedFilter'} type={'radio'} active={filter.values && filter.values.length > 0} handleClickRemoveFilter={handleClickRemoveFilter}>
                    <div className="double-choice-filter">
                        <TextCheckboxes labels={Object.keys(filter.choices).map(key => { return({key: key, text: filter.choices[key]}) })}
                                        onClickHandler={this.handleClickDoubleMultipleChoiceChoice} values={filter.values.map(value => value.choice)} className={'double-multiple-choice-choice'}
                                        title={filter.label} />
                        <div className="table-row"></div>
                        {selectedChoice ?
                            <TextCheckboxes labels={Object.keys(filter.doubleChoices[selectedChoice]).map(doubleChoice => { return({key: doubleChoice, text: filter.doubleChoices[selectedChoice][doubleChoice]}); }) }
                                        onClickHandler={this.handleClickDoubleMultipleChoiceDetail} values={filter.values.filter(value => value.choice === selectedChoice).map(value => value.detail)} className={'double-multiple-choice-detail'}/>
                            : ''}
                    </div>
                </ThreadSelectedFilter>
                    :
                <ThreadUnselectedFilter key={filter.key} filter={filter} handleClickFilter={handleClickFilter} />
        );
    }
}