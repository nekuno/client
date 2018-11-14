import PropTypes from 'prop-types';
import React, { Component } from 'react';
import ThreadSelectedFilter from './ThreadSelectedFilter';
import ThreadUnselectedFilter from './ThreadUnselectedFilter';
import TextCheckboxes from '../../ui/TextCheckboxes';

export default class DoubleMultipleChoicesFilter extends Component {
    static propTypes = {
        filterKey: PropTypes.string.isRequired,
        selected: PropTypes.bool.isRequired,
        filter: PropTypes.object.isRequired,
        data: PropTypes.object,
        handleClickRemoveFilter: PropTypes.func.isRequired,
        handleChangeFilter: PropTypes.func.isRequired,
        handleClickFilter: PropTypes.func.isRequired
    };
    
    constructor(props) {
        super(props);

        this.handleClickDoubleMultipleChoiceChoice = this.handleClickDoubleMultipleChoiceChoice.bind(this);
        this.handleClickDoubleMultipleChoiceDetail = this.handleClickDoubleMultipleChoiceDetail.bind(this);
        
        this.state = {
            selectedChoice: props.data && props.data.choices && props.data.choices.length > 0
        };
    }

    handleClickDoubleMultipleChoiceChoice(choice) {
        let {filterKey, data} = this.props;
        data = data || {};
        data.choices = data.choices || [];

        const choiceIndex = data.choices.findIndex(value => value === choice);
        if (choiceIndex !== -1) {
            data.choices.splice(choiceIndex, 1);
        } else {
            data.choices.push(choice);
        }
        if (data.choices.length > 0) {
            this.setState({selectedChoice: true})
        } else {
            data.details = [];
            this.setState({selectedChoice: false})
        }

        this.props.handleChangeFilter(filterKey, data);
    }

    handleClickDoubleMultipleChoiceDetail(detail) {
        let {filterKey, data} = this.props;
        data = data || {};
        data.details = data.details || [];

        const detailIndex = data.details.findIndex(value => value === detail);
        if (detailIndex !== -1) {
            data.details.splice(detailIndex, 1);
        } else {
            data.details.push(detail);
        }

        this.props.handleChangeFilter(filterKey, data);
    }

    render() {
        let {filterKey, selected, filter, data, handleClickRemoveFilter, handleClickFilter} = this.props;
        const {selectedChoice} = this.state;
        data = data || {};
        return(
            selected ?
                <ThreadSelectedFilter key={'selected-filter'} type={'radio'} active={data.length > 0} handleClickRemoveFilter={handleClickRemoveFilter}>
                    <div className="double-choice-filter">
                        <TextCheckboxes labels={filter.choices.map(choice => { return({key: choice.id, text: choice.text}) })}
                                        onClickHandler={this.handleClickDoubleMultipleChoiceChoice} values={data.choices || []} className={'double-multiple-choice-choice'}
                                        title={filter.label} />
                        <div className="table-row"></div>
                        {selectedChoice ?
                            <TextCheckboxes labels={Object.keys(filter.doubleChoices[data.choices[0]]).map(doubleChoice => { return({key: doubleChoice, text: filter.doubleChoices[data.choices[0]][doubleChoice]}); }) }
                                        onClickHandler={this.handleClickDoubleMultipleChoiceDetail} values={data.details || []} className={'double-multiple-choice-detail'}/>
                            : ''}
                    </div>
                </ThreadSelectedFilter>
                    :
                <ThreadUnselectedFilter key={filterKey} filterKey={filterKey} filter={filter} data={data} handleClickFilter={handleClickFilter} handleClickRemoveFilter={handleClickRemoveFilter}/>
        );
    }
}