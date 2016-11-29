import React, { PropTypes, Component } from 'react';
import ThreadSelectedFilter from './ThreadSelectedFilter';
import ThreadUnselectedFilter from './ThreadUnselectedFilter';
import TextCheckboxes from '../../ui/TextCheckboxes';

export default class DoubleMultipleChoicesFilter extends Component {
    static propTypes = {
        filterKey: PropTypes.string.isRequired,
        selected: PropTypes.bool.isRequired,
        filter: PropTypes.object.isRequired,
        data: PropTypes.array,
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

    handleClickDoubleMultipleChoiceChoice(choice) {
        let {filterKey, data} = this.props;
        data = data || [];
        let choiceValues = data.filter(value => value.choice === choice);
        let otherValues = data.filter(value => value.choice !== choice);
        if (choiceValues.length === 0) {
            const newIndex = data.length;
            data[newIndex] = {choice: choice};
            this.setState({
                selectedChoice: choice
            });
        } else {
            data = otherValues;
            this.setState({
                selectedChoice: ''
            });
        }

        this.props.handleChangeFilter(filterKey, data);
    }

    handleClickDoubleMultipleChoiceDetail(detail) {
        let {filterKey, data} = this.props;
        let {selectedChoice} = this.state;
        let choiceWithNoDetailIndex = data.findIndex(value => value.choice === selectedChoice && !value.detail);
        let detailIndex = data.findIndex(value => value.choice === selectedChoice && value.detail === detail);
        if (detailIndex > -1) {
            data[detailIndex].detail = null;
        } else {
            const index = choiceWithNoDetailIndex > -1 ? choiceWithNoDetailIndex : data.length;
            data[index] = data[index] || {choice: selectedChoice};
            data[index].detail = detail;
        }
        this.props.handleChangeFilter(filterKey, data);
    }

    render() {
        let {filterKey, selected, filter, data, handleClickRemoveFilter, handleClickFilter} = this.props;
        const {selectedChoice} = this.state;
        data = data || [];
        return(
            selected ?
                <ThreadSelectedFilter key={'selected-filter'} type={'radio'} active={data.length > 0} handleClickRemoveFilter={handleClickRemoveFilter}>
                    <div className="double-choice-filter">
                        <TextCheckboxes labels={Object.keys(filter.choices).map(key => { return({key: key, text: filter.choices[key]}) })}
                                        onClickHandler={this.handleClickDoubleMultipleChoiceChoice} values={data.map(value => value.choice)} className={'double-multiple-choice-choice'}
                                        title={filter.label} />
                        <div className="table-row"></div>
                        {selectedChoice ?
                            <TextCheckboxes labels={Object.keys(filter.doubleChoices[selectedChoice]).map(doubleChoice => { return({key: doubleChoice, text: filter.doubleChoices[selectedChoice][doubleChoice]}); }) }
                                        onClickHandler={this.handleClickDoubleMultipleChoiceDetail} values={data.filter(value => value.choice === selectedChoice).map(value => value.detail)} className={'double-multiple-choice-detail'}/>
                            : ''}
                    </div>
                </ThreadSelectedFilter>
                    :
                <ThreadUnselectedFilter key={filterKey} filterKey={filterKey} filter={filter} data={data} handleClickFilter={handleClickFilter} handleClickRemoveFilter={handleClickRemoveFilter}/>
        );
    }
}