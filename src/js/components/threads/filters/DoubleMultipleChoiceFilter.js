import React, { PropTypes, Component } from 'react';
import ThreadSelectedFilter from './ThreadSelectedFilter';
import ThreadUnselectedFilter from './ThreadUnselectedFilter';
import TextCheckboxes from '../../ui/TextCheckboxes';

export default class DoubleMultipleChoiceFilter extends Component {
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
        const valueIndex = filter.values.findIndex(value => value === choice);
        if (valueIndex > -1) {
            filter.values.splice(valueIndex, 1);
        } else {
            filter.values.push(choice);
        }
        filter.details = [];
        this.setState({
            selectedChoice: choice
        });
        this.props.handleChangeFilter(filter);
    }

    handleClickDoubleMultipleChoiceDetail(detail) {
        let {filter} = this.props;
        filter.details = filter.details || [];
        const detailIndex = filter.details.findIndex(value => value === detail);
        if (detailIndex > -1) {
            filter.details.splice(detailIndex, 1);
        } else {
            filter.details.push(detail);
        }
        this.props.handleChangeFilter(filter);
    }

    render() {
        const {selected, filter, handleClickRemoveFilter, handleClickFilter} = this.props;
        const {selectedChoice} = this.state;
        return(
            selected ?
                <ThreadSelectedFilter key={'selected-filter'} ref={'selectedFilter'} type={'radio'} active={filter.values && filter.values.length > 0} handleClickRemoveFilter={handleClickRemoveFilter}>
                    <div className="double-choice-filter">
                        <TextCheckboxes labels={Object.keys(filter.choices).map(key => { return({key: key, text: filter.choices[key]}) })}
                                        onClickHandler={this.handleClickDoubleMultipleChoiceChoice} values={filter.values || []} className={'double-multiple-choice-choice'}
                                        title={filter.label} />
                        <div className="table-row"></div>
                        {selectedChoice ?
                            <TextCheckboxes labels={Object.keys(filter.doubleChoices[selectedChoice]).map(doubleChoice => { return({key: doubleChoice, text: filter.doubleChoices[filter.choice][doubleChoice]}); }) }
                                        onClickHandler={this.handleClickDoubleMultipleChoiceDetail} values={filter.details || []} className={'double-multiple-choice-detail'}/>
                            : ''}
                    </div>
                </ThreadSelectedFilter>
                    :
                <ThreadUnselectedFilter key={filter.key} filter={filter} handleClickFilter={handleClickFilter} />
        );
    }
}