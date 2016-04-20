import React, { PropTypes, Component } from 'react';
import ThreadSelectedFilter from '../ThreadSelectedFilter';
import LocationInput from '../../ui/LocationInput';

export default class LocationSelectedFilter extends Component {
    static propTypes = {
        handleClickRemoveFilter: PropTypes.func.isRequired,
        handleClickLocationSuggestion: PropTypes.func.isRequired
    };

    constructor(props) {
        super(props);

        this.handleClickLocationSuggestion = this.handleClickLocationSuggestion.bind(this);
    }

    handleClickLocationSuggestion(suggest) {
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
        let location = {
            latitude: suggest.location.lat,
            longitude: suggest.location.lng,
            address: suggest.gmaps.formatted_address,
            locality: locality,
            country: country
        };
        
        this.props.handleClickLocationSuggestion(location);
    }

    getSelectedFilter() {
        return this.refs.selectedFilter.getSelectedFilter();
    }

    selectedFilterContains(target) {
        return this.refs.selectedFilter.selectedFilterContains(target);
    }
    
    render() {
        const {handleClickRemoveFilter} = this.props;
        return(
            <ThreadSelectedFilter key={'selected-filter'} ref={'selectedFilter'} type={'location-tag'} addedClass={'tag-filter'} plusIcon={true} handleClickRemoveFilter={handleClickRemoveFilter}>
                <div className="list-block">
                    <div className="location-title">Ubicación</div>
                    <LocationInput placeholder={'Escribe una ubicación'} onSuggestSelect={this.handleClickLocationSuggestion}/>
                </div>
            </ThreadSelectedFilter>
        );
    }
}