import React, { PropTypes, Component } from 'react';
import SelectedEdit from './SelectedEdit';
import UnselectedEdit from './UnselectedEdit';
import LocationInput from '../../ui/LocationInput';
import TextRadios from '../../ui/TextRadios';

export default class LocationEdit extends Component {
    static propTypes = {
        filterKey: PropTypes.string.isRequired,
        selected: PropTypes.bool.isRequired,
        metadata: PropTypes.object.isRequired,
        data: PropTypes.object,
        handleClickRemoveFilter: PropTypes.func.isRequired,
        handleChangeFilter: PropTypes.func.isRequired,
        handleClickFilter: PropTypes.func.isRequired
    };

    constructor(props) {
        super(props);

        this.handleClickLocationSuggestion = this.handleClickLocationSuggestion.bind(this);
    }

    handleClickLocationSuggestion(location) {
        let {filterKey} = this.props;
        let data = location;
        this.props.handleChangeFilter(filterKey, data);
    }

    getSelectedFilter() {
        return this.refs.selectedFilter ? this.refs.selectedFilter.getSelectedFilter() : {};
    }

    selectedFilterContains(target) {
        return this.refs.selectedFilter && this.refs.selectedFilter.selectedFilterContains(target);
    }

    render() {
        const {filterKey, selected, metadata, data, handleClickRemoveFilter, handleClickFilter} = this.props;
        return(
            selected ?
                <SelectedEdit key={'selected-filter'} ref={'selectedFilter'} type={'location-tag'} addedClass={'tag-filter'} plusIcon={true} handleClickRemoveFilter={handleClickRemoveFilter}>
                    <div className="location-filter-wrapper">
                        <div className="list-block">
                            <div className="location-title">Ubicación</div>
                            <LocationInput placeholder={data.address ? data.address : data.location ? data.location : 'Escribe una ubicación'} onSuggestSelect={this.handleClickLocationSuggestion}/>
                        </div>
                    </div>
                </SelectedEdit>
                    :
                <UnselectedEdit key={filterKey} filterKey={filterKey} filter={metadata} data={data} handleClickFilter={handleClickFilter} />
        );
    }
}