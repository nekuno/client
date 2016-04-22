import React, { PropTypes, Component } from 'react';
import ThreadSelectedFilter from './ThreadSelectedFilter';
import ThreadUnselectedFilter from './ThreadUnselectedFilter';
import TextRadios from '../../ui/TextRadios';

export default class DoubleChoiceFilter extends Component {
    static propTypes = {
        selected: PropTypes.bool.isRequired,
        filter: PropTypes.object.isRequired,
        handleClickRemoveFilter: PropTypes.func.isRequired,
        handleChangeFilter: PropTypes.func.isRequired,
        handleClickFilter: PropTypes.func.isRequired
    };
    
    constructor(props) {
        super(props);

        this.handleClickDoubleChoiceDetail = this.handleClickDoubleChoiceDetail.bind(this);
        this.handleClickDoubleChoiceChoice = this.handleClickDoubleChoiceChoice.bind(this);
    }

    getSelectedFilter() {
        return this.refs.selectedFilter ? this.refs.selectedFilter.getSelectedFilter() : {};
    }

    selectedFilterContains(target) {
        return this.refs.selectedFilter && this.refs.selectedFilter.selectedFilterContains(target);
    }

    handleClickDoubleChoiceChoice(choice) {
        let {filter} = this.props;
        if (choice !== filter.choice) {
            filter.choice = choice;
            filter.detail = null;
        }
        this.props.handleChangeFilter(filter);
    }

    handleClickDoubleChoiceDetail(detail) {
        let {filter} = this.props;
        if (detail !== filter.detail) {
            filter.detail = detail;
        }
        this.props.handleChangeFilter(filter);
    }

    render() {
        const {selected, filter, handleClickRemoveFilter, handleClickFilter} = this.props;
        return(
            selected ?
                <ThreadSelectedFilter key={'selected-filter'} ref={'selectedFilter'} type={'radio'} active={filter.choice ? true : false} handleClickRemoveFilter={handleClickRemoveFilter}>
                    <div className="double-choice-filter">
                        <TextRadios labels={Object.keys(filter.choices).map(choice => { return({key: choice, text: filter.choices[choice]}); }) }
                                    onClickHandler={this.handleClickDoubleChoiceChoice} value={filter.choice} className={'double-choice-choice'}
                                    title={filter.label} />
                        {filter.choice ? <div className="table-row"></div> : ''}
                        {filter.choice ?
                            <TextRadios labels={Object.keys(filter.doubleChoices[filter.choice]).map(doubleChoice => { return({key: doubleChoice, text: filter.doubleChoices[filter.choice][doubleChoice]}); }) }
                                        onClickHandler={this.handleClickDoubleChoiceDetail} value={filter.detail} className={'double-choice-detail'}/>
                            : ''}
                    </div>
                </ThreadSelectedFilter>
                    :
                <ThreadUnselectedFilter key={filter.key} filter={filter} handleClickFilter={handleClickFilter} />
        );
    }
}