import React, { PropTypes, Component } from 'react';
import ThreadSelectedFilter from './ThreadSelectedFilter';
import ThreadUnselectedFilter from './ThreadUnselectedFilter';
import LocationInput from '../../ui/LocationInput';

export default class LocationFilter extends Component {
    static propTypes = {
        selected: PropTypes.bool.isRequired,
        filter: PropTypes.object.isRequired,
        handleClickRemoveFilter: PropTypes.func.isRequired,
        handleChangeFilter: PropTypes.func.isRequired,
        handleClickFilter: PropTypes.func.isRequired
    };

    constructor(props) {
        super(props);

        this.handleClickLocationSuggestion = this.handleClickLocationSuggestion.bind(this);
    }

    handleClickLocationSuggestion(suggest) {
        let {filter} = this.props;
        let locality = '', country = '';
        suggest.gmaps.address_components.forEach(function(component) {
            component.types.forEach(function(type) {
                if (!locality && type === 'locality') {
                    locality = component.long_name;
                }
                if (!country && type === 'country') {
                    country = component.long_name;
                }
            });
        });
        filter.value = {
            latitude: suggest.location.lat,
            longitude: suggest.location.lng,
            address: suggest.gmaps.formatted_address,
            locality: locality,
            country: country
        };

        this.props.handleChangeFilter(filter);
    }

    getSelectedFilter() {
        return this.refs.selectedFilter ? this.refs.selectedFilter.getSelectedFilter() : {};
    }

    selectedFilterContains(target) {
        return this.refs.selectedFilter && this.refs.selectedFilter.selectedFilterContains(target);
    }
    
    render() {
        const {selected, filter, handleClickRemoveFilter, handleClickFilter} = this.props;
        return(
            selected ?
                <ThreadSelectedFilter key={'selected-filter'} ref={'selectedFilter'} type={'location-tag'} addedClass={'tag-filter'} plusIcon={true} handleClickRemoveFilter={handleClickRemoveFilter}>
                    <div className="list-block">
                        <div className="location-title">Ubicación</div>
                        <LocationInput placeholder={'Escribe una ubicación'} onSuggestSelect={this.handleClickLocationSuggestion}/>
                    </div>
                </ThreadSelectedFilter>
                    :
                <ThreadUnselectedFilter key={filter.key} filter={filter} handleClickFilter={handleClickFilter} />
        );
    }
}