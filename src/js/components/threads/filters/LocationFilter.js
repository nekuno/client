import React, { PropTypes, Component } from 'react';
import ThreadSelectedFilter from './ThreadSelectedFilter';
import ThreadUnselectedFilter from './ThreadUnselectedFilter';
import LocationInput from '../../ui/LocationInput';
import TextRadios from '../../ui/TextRadios';
import translate from '../../../i18n/Translate';

@translate('LocationFilter')
export default class LocationFilter extends Component {

    static propTypes = {
        filterKey              : PropTypes.string.isRequired,
        selected               : PropTypes.bool.isRequired,
        filter                 : PropTypes.object.isRequired,
        data                   : PropTypes.object,
        handleClickRemoveFilter: PropTypes.func.isRequired,
        handleChangeFilter     : PropTypes.func.isRequired,
        handleClickFilter      : PropTypes.func.isRequired,
        // Injected by @translate:
        strings                : PropTypes.object
    };

    constructor(props) {
        super(props);

        this.handleClickLocationSuggestion = this.handleClickLocationSuggestion.bind(this);
        this.handleClickChoice = this.handleClickChoice.bind(this);
    }

    handleClickLocationSuggestion(location) {
        let {filterKey} = this.props;
        let data = {
            location: location,
            distance: 50
        };
        this.props.handleChangeFilter(filterKey, data);
    }

    handleClickChoice(choice) {
        let {filterKey, data} = this.props;
        data.distance = parseInt(choice);
        this.props.handleChangeFilter(filterKey, data);
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
        const {filterKey, selected, filter, data, handleClickRemoveFilter, handleClickFilter, strings} = this.props;
        return (
            selected ?
                <ThreadSelectedFilter key={'selected-filter'} type={'location-tag'} addedClass={'tag-filter'} plusIcon={true} handleClickRemoveFilter={handleClickRemoveFilter}>
                    <div className="location-filter-wrapper">
                        <div className="list-block">
                            <div className="location-title">{strings.location}</div>
                            <LocationInput placeholder={strings.placeholder} onSuggestSelect={this.handleClickLocationSuggestion}/>
                        </div>
                        {data && data.location ? <div className="table-row"></div> : ''}
                        {data && data.location ?
                            <TextRadios labels={this.getDistanceLabels()}
                                        onClickHandler={this.handleClickChoice} value={data.distance} className={'tags-and-choice-choice-radios'}
                                        title={strings.minDistance}/>
                            : ''}
                    </div>
                </ThreadSelectedFilter>
                :
                <ThreadUnselectedFilter key={filterKey} filterKey={filterKey} filter={filter} data={data} handleClickFilter={handleClickFilter}/>
        );
    }
}

LocationFilter.defaultProps = {
    strings: {
        location   : 'Location',
        placeholder: 'Type a location',
        minDistance: 'Minimal distance'
    }
};