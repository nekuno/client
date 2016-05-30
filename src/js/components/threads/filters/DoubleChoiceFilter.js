/** TODO : Not used yet but useful for editing profile **/
import React, { PropTypes, Component } from 'react';
import ThreadSelectedFilter from './ThreadSelectedFilter';
import ThreadUnselectedFilter from './ThreadUnselectedFilter';
import TextRadios from '../../ui/TextRadios';

export default class DoubleChoiceFilter extends Component {
    static propTypes = {
        filterKey: PropTypes.string.isRequired,
        selected: PropTypes.bool.isRequired,
        filter: PropTypes.object.isRequired,
        data: PropTypes.object.isRequired,
        handleClickRemoveFilter: PropTypes.func.isRequired,
        handleChangeFilter: PropTypes.func.isRequired,
        handleClickFilter: PropTypes.func.isRequired
    };
    
    constructor(props) {
        super(props);

        this.handleClickDoubleChoiceDetail = this.handleClickDoubleChoiceDetail.bind(this);
        this.handleClickDoubleChoiceChoice = this.handleClickDoubleChoiceChoice.bind(this);
    }

    handleClickDoubleChoiceChoice(choice) {
        let {filterKey, data} = this.props;
        if (choice !== data.choice) {
            data.choice = choice;
            data.detail = null;
        }
        this.props.handleChangeFilter(filterKey, data);
    }

    handleClickDoubleChoiceDetail(detail) {
        let {filterKey, data} = this.props;
        if (detail !== data.detail) {
            data.detail = detail;
        }
        this.props.handleChangeFilter(filterKey, data);
    }

    render() {
        const {filterKey, selected, filter, data, handleClickRemoveFilter, handleClickFilter} = this.props;
        return(
            selected ?
                <ThreadSelectedFilter key={'selected-filter'} type={'radio'} active={data.choice ? true : false} handleClickRemoveFilter={handleClickRemoveFilter}>
                    <div className="double-choice-filter">
                        <TextRadios labels={Object.keys(filter.choices).map(choice => { return({key: choice, text: filter.choices[choice]}); }) }
                                    onClickHandler={this.handleClickDoubleChoiceChoice} value={data.choice} className={'double-choice-choice'}
                                    title={filter.label} />
                        {data.choice ? <div className="table-row"></div> : ''}
                        {data.choice ?
                            <TextRadios labels={Object.keys(filter.doubleChoices[data.choice]).map(doubleChoice => { return({key: doubleChoice, text: filter.doubleChoices[data.choice][doubleChoice]}); }) }
                                        onClickHandler={this.handleClickDoubleChoiceDetail} value={data.detail} className={'double-choice-detail'}/>
                            : ''}
                    </div>
                </ThreadSelectedFilter>
                    :
                <ThreadUnselectedFilter key={filterKey} filterKey={filterKey} filter={filter} data={data} handleClickFilter={handleClickFilter} />
        );
    }
}