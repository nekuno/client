import PropTypes from 'prop-types';
import React, { Component } from 'react';
import LocationInput from '../../ui/LocationInput/LocationInput.js';
import Select from '../../ui/Select/Select.js';
import translate from '../../../i18n/Translate';
import selectn from 'selectn';

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
        const {data, strings} = this.props;

        return (
            <div>
                <LocationInput title={strings.location} defaultValue={selectn('location.address', data)} placeholder={strings.placeholder} onSuggestSelect={this.handleClickLocationSuggestion}/>
                {data && data.location ?
                    <div>
                        <br/>
                        <Select options={this.getDistanceLabels()}
                                onClickHandler={this.handleClickChoice}
                                defaultOption={data.distance}
                                title={strings.minDistance}/>
                    </div>
                    : null}
            </div>
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