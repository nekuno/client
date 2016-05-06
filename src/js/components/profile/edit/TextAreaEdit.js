import React, { PropTypes, Component } from 'react';
import SelectedEdit from './SelectedEdit';
import UnselectedEdit from './UnselectedEdit';
import TextInput from '../../ui/TextInput';
import TextRadios from '../../ui/TextRadios';

export default class TextAreaEdit extends Component {
    static propTypes = {
        filterKey: PropTypes.string.isRequired,
        selected: PropTypes.bool.isRequired,
        metadata: PropTypes.object.isRequired,
        data: PropTypes.string,
        handleClickRemoveFilter: PropTypes.func.isRequired,
        handleChangeFilter: PropTypes.func.isRequired,
        handleClickFilter: PropTypes.func.isRequired
    };

    constructor(props) {
        super(props);

        this.onChangeValue = this.onChangeValue.bind(this);
    }

    getSelectedFilter() {
        return this.refs.selectedFilter ? this.refs.selectedFilter.getSelectedFilter() : {};
    }

    selectedFilterContains(target) {
        return this.refs.selectedFilter && this.refs.selectedFilter.selectedFilterContains(target);
    }

    onChangeValue() {
        if (this.refs.hasOwnProperty(this.props.filterKey)){
            const value = this.refs[this.props.filterKey].getValue();
            this.props.handleChangeFilter(this.props.filterKey, value);
        }
    }

    render() {
        const {filterKey, selected, metadata, data, handleClickRemoveFilter, handleClickFilter} = this.props;
        return(
            selected ?
                <SelectedEdit key={'selected-filter'} ref={'selectedFilter'} type={'location-tag'} addedClass={'tag-filter'} plusIcon={true} handleClickRemoveFilter={handleClickRemoveFilter}>
                    <div className="location-filter-wrapper">
                        <div className="list-block">
                            <TextInput placeholder={metadata.label} ref={filterKey} label={metadata.label} initialValue={data} onChange={this.onChangeValue}/>
                        </div>
                    </div>
                </SelectedEdit>
                    :
                <UnselectedEdit key={filterKey} filterKey={filterKey} filter={metadata} data={data} handleClickFilter={handleClickFilter} />
        );
    }
}