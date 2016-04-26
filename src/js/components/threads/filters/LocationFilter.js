import React, { PropTypes, Component } from 'react';
import ThreadSelectedFilter from './ThreadSelectedFilter';
import ThreadUnselectedFilter from './ThreadUnselectedFilter';
import LocationInput from '../../ui/LocationInput';
import TextRadios from '../../ui/TextRadios';

export default class LocationFilter extends Component {
    static propTypes = {
        filterKey: PropTypes.string.isRequired,
        selected: PropTypes.bool.isRequired,
        filter: PropTypes.object.isRequired,
        data: PropTypes.object,
        handleClickRemoveFilter: PropTypes.func.isRequired,
        handleChangeFilter: PropTypes.func.isRequired,
        handleClickFilter: PropTypes.func.isRequired
    };

    constructor(props) {
        super(props);

        this.handleClickLocationSuggestion = this.handleClickLocationSuggestion.bind(this);
        this.handleClickChoice = this.handleClickChoice.bind(this);
    }

    handleClickLocationSuggestion(suggest) {
        let {filterKey} = this.props;
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
        let data = {
            location: {
                latitude: suggest.location.lat,
                longitude: suggest.location.lng,
                address: suggest.gmaps.formatted_address,
                locality: locality || country,
                country: country
            },
            distance: null
        };
        this.props.handleChangeFilter(filterKey, data);
    }

    handleClickChoice(choice) {
        let {filterKey, data} = this.props;
        data.distance = parseInt(choice);
        this.props.handleChangeFilter(filterKey, data);
    }

    getSelectedFilter() {
        return this.refs.selectedFilter ? this.refs.selectedFilter.getSelectedFilter() : {};
    }

    selectedFilterContains(target) {
        return this.refs.selectedFilter && this.refs.selectedFilter.selectedFilterContains(target);
    }

    getDistanceLabels = function() {
        return [
            {key: 10, text: '10 Km'},
            {key: 25, text: '25 Km'},
            {key: 50, text: '50 Km'},
            {key: 100, text: '100 Km'},
            {key: 250, text: '250 Km'},
            {key: 500, text: '500 Km'}
        ]
    };
    
    render() {
        const {filterKey, selected, filter, data, handleClickRemoveFilter, handleClickFilter} = this.props;
        return(
            selected ?
                <ThreadSelectedFilter key={'selected-filter'} ref={'selectedFilter'} type={'location-tag'} addedClass={'tag-filter'} plusIcon={true} handleClickRemoveFilter={handleClickRemoveFilter}>
                    <div className="location-filter-wrapper">
                        <div className="list-block">
                            <div className="location-title">Ubicación</div>
                            <LocationInput placeholder={'Escribe una ubicación'} onSuggestSelect={this.handleClickLocationSuggestion}/>
                        </div>
                        {data && data.location ? <div className="table-row"></div> : ''}
                        {data && data.location ?
                            <TextRadios labels={this.getDistanceLabels()}
                                        onClickHandler={this.handleClickChoice} value={data.distance} className={'tags-and-choice-choice-radios'}
                                        title={'Distancia mínima'} />
                            : ''}
                    </div>
                </ThreadSelectedFilter>
                    :
                <ThreadUnselectedFilter key={filterKey} filterKey={filterKey} filter={filter} data={data} handleClickFilter={handleClickFilter} />
        );
    }
}