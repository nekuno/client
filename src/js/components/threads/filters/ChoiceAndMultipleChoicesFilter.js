import PropTypes from 'prop-types';
import React, { Component } from 'react';
import ThreadSelectedFilter from './ThreadSelectedFilter';
import ThreadUnselectedFilter from './ThreadUnselectedFilter';
import TextRadios from '../../ui/TextRadios';
import TextCheckboxes from '../../ui/TextCheckboxes';

export default class ChoiceAndMultipleChoicesFilter extends Component {
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

        this.handleClickChoice = this.handleClickChoice.bind(this);
        this.handleClickDetail = this.handleClickDetail.bind(this);
        
        this.state = {
            selectedChoice: props.data && props.data.choice ? props.data.choice : null
        };
    }

    handleClickChoice(choice) {
        let {filterKey, data} = this.props;
        data = data || {};
        data.choice = choice;
        data.details = [];
        this.setState({selectedChoice: choice});

        this.props.handleChangeFilter(filterKey, data);
    }

    handleClickDetail(detail) {
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
                        <TextRadios labels={Object.keys(filter.choices).map(key => { return({key: key, text: filter.choices[key]}) })}
                                        onClickHandler={this.handleClickChoice} value={data.choice || null} className={'double-multiple-choice-choice'}
                                        title={filter.label} />
                        <div className="table-row"></div>
                        {selectedChoice ?
                            <TextCheckboxes labels={data.choice ? Object.keys(filter.doubleChoices[data.choice]).map(doubleChoice => { return({key: doubleChoice, text: filter.doubleChoices[data.choice][doubleChoice]}); }) : []}
                                        onClickHandler={this.handleClickDetail} values={data.details || []} className={'double-multiple-choice-detail'}/>
                            : ''}
                    </div>
                </ThreadSelectedFilter>
                    :
                <ThreadUnselectedFilter key={filterKey} filterKey={filterKey} filter={filter} data={data} handleClickFilter={handleClickFilter} handleClickRemoveFilter={handleClickRemoveFilter}/>
        );
    }
}