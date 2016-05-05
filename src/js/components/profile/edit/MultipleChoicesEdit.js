import React, { PropTypes, Component } from 'react';
import SelectedEdit from './SelectedEdit';
import UnselectedEdit from './UnselectedEdit';
import TextCheckboxes from '../../ui/TextCheckboxes';

export default class MultipleChoicesEdit extends Component {
    static propTypes = {
        filterKey: PropTypes.string.isRequired,
        selected: PropTypes.bool.isRequired,
        metadata: PropTypes.object.isRequired,
        data: PropTypes.array,
        handleClickRemoveFilter: PropTypes.func.isRequired,
        handleChangeFilter: PropTypes.func.isRequired,
        handleClickFilter: PropTypes.func.isRequired
    };

    constructor(props) {
        super(props);

        this.handleClickMultipleChoice = this.handleClickMultipleChoice.bind(this);
    }
    
    getSelectedFilter() {
        return this.refs.selectedFilter ? this.refs.selectedFilter.getSelectedFilter() : {};
    }

    selectedFilterContains(target) {
        return this.refs.selectedFilter && this.refs.selectedFilter.selectedFilterContains(target);
    }

    handleClickMultipleChoice(choice) {
        let {filterKey, data} = this.props;
        data = data || [];
        const valueIndex = data.findIndex(value => value == choice);
        if (valueIndex > -1) {
            data.splice(valueIndex, 1);
        } else {
            data.push(choice);
        }
        this.props.handleChangeFilter(filterKey, data);
    }

    render() {
        const {filterKey, selected, metadata, data, handleClickRemoveFilter, handleClickFilter} = this.props;
        return(
            selected ?
                <SelectedEdit key={'selected-filter'} ref={'selectedFilter'} type={'checkbox'} active={data && data.length > 0} handleClickRemoveFilter={handleClickRemoveFilter}>
                    <TextCheckboxes labels={Object.keys(metadata.choices).map(key => { return({key: key, text: metadata.choices[key]}) })}
                                    onClickHandler={this.handleClickMultipleChoice} values={data || []} className={'multiple-choice-filter'}
                                    title={metadata.label} />
                </SelectedEdit>
                    :
                <UnselectedEdit key={filterKey} filterKey={filterKey} filter={metadata} data={data || []} handleClickFilter={handleClickFilter} />
        );
    }
}