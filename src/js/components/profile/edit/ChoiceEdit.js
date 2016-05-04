/** TODO : Not used yet but useful for editing profile **/
import React, { PropTypes, Component } from 'react';
import SelectedEdit from './SelectedEdit';
import UnselectedEdit from './UnselectedEdit';
import TextRadios from '../../ui/TextRadios';

export default class ChoiceEdit extends Component {
    static propTypes = {
        filterKey: PropTypes.string.isRequired,
        selected: PropTypes.bool.isRequired,
        metadata: PropTypes.object.isRequired,
        data: PropTypes.string.isRequired,
        handleClickRemoveFilter: PropTypes.func.isRequired,
        handleChangeFilter: PropTypes.func.isRequired,
        handleClickFilter: PropTypes.func.isRequired
    };

    constructor(props) {
        super(props);

        this.handleClickChoice = this.handleClickChoice.bind(this);
    }

    getSelectedFilter() {
        return this.refs.selectedFilter ? this.refs.selectedFilter.getSelectedFilter() : {};
    }

    selectedFilterContains(target) {
        return this.refs.selectedFilter && this.refs.selectedFilter.selectedFilterContains(target);
    }

    handleClickChoice(choice) {
        let {filterKey, data} = this.props;
        if (choice !== data) {
            this.props.handleChangeFilter(filterKey, choice);
        }
    }

    render() {
        const {filterKey, selected, metadata, data, handleClickRemoveFilter, handleClickFilter} = this.props;
        return(
            selected ?
                <SelectedEdit key={'selected-filter'} ref={'selectedFilter'} type={'radio'} active={data ? true : false} handleClickRemoveFilter={handleClickRemoveFilter}>
                    <TextRadios labels={Object.keys(metadata.choices).map(key => { return({key: key, text: metadata.choices[key]}); }) }
                                onClickHandler={this.handleClickChoice} value={data} className={'choice-filter'}
                                title={metadata.label} />
                </SelectedEdit>
                :
                <UnselectedEdit key={filterKey} filterKey={filterKey} filter={metadata} data={data} handleClickFilter={handleClickFilter} />
        );
    }
}