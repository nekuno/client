/** TODO : Not used yet but useful for editing profile **/
import React, { PropTypes, Component } from 'react';
import SelectedEdit from './SelectedEdit';
import UnselectedEdit from './UnselectedEdit';
import TextRadios from '../../ui/TextRadios';

export default class DoubleChoiceEdit extends Component {
    static propTypes = {
        filterKey: PropTypes.string.isRequired,
        selected: PropTypes.bool.isRequired,
        metadata: PropTypes.object.isRequired,
        data: PropTypes.object.isRequired,
        handleClickRemoveFilter: PropTypes.func.isRequired,
        handleChangeFilter: PropTypes.func.isRequired,
        handleChangeFilterDetail: PropTypes.func.isRequired,
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
        this.props.handleChangeFilterDetail(filterKey, data);
    }

    render() {
        const {filterKey, selected, metadata, data, handleClickRemoveFilter, handleClickFilter} = this.props;
        return(
            selected ?
                <SelectedEdit key={'selected-filter'} ref={'selectedFilter'} type={'radio'} active={data.choice ? true : false} handleClickRemoveFilter={handleClickRemoveFilter}>
                    <div className="double-choice-filter">
                        <TextRadios labels={Object.keys(metadata.choices).map(choice => { return({key: choice, text: metadata.choices[choice]}); }) }
                                    onClickHandler={this.handleClickDoubleChoiceChoice} value={data.choice} className={'double-choice-choice'}
                                    title={metadata.label} />
                        {data.choice ? <div className="table-row"></div> : ''}
                        {data.choice ?
                            <TextRadios labels={Object.keys(metadata.doubleChoices[data.choice]).map(doubleChoice => { return({key: doubleChoice, text: metadata.doubleChoices[data.choice][doubleChoice]}); }) }
                                        onClickHandler={this.handleClickDoubleChoiceDetail} value={data.detail} className={'double-choice-detail'}/>
                            : ''}
                    </div>
                </SelectedEdit>
                    :
                <UnselectedEdit key={filterKey} filterKey={filterKey} filter={metadata} data={data} handleClickFilter={handleClickFilter} />
        );
    }
}