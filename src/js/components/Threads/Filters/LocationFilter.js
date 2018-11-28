import PropTypes from 'prop-types';
import React, { Component } from 'react';
import LocationInput from '../../ui/LocationInput/LocationInput.js';
import Select from '../../ui/Select/Select.js';
import translate from '../../../i18n/Translate';
import selectn from 'selectn';
import InputSlider from "../../ui/InputSlider/InputSlider";

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
        this.handleChangeInputSlider = this.handleChangeInputSlider.bind(this);
    }

    handleClickLocationSuggestion(location) {
        let {filterKey} = this.props;
        let data = {
            location: location,
            distance: 10
        };
        this.props.handleChangeFilter(filterKey, data);
    }

    handleChangeInputSlider(value) {
        const {filterKey, data} = this.props;
        let newData = {
            location: data.location,
            distance: value,
        };
        this.props.handleChangeFilter(filterKey, newData);
    }

    render() {
        const {data, strings} = this.props;

        return (
            <div>
                <LocationInput title={strings.location} defaultValue={selectn('location.address', data)} placeholder={strings.placeholder} onSuggestSelect={this.handleClickLocationSuggestion}/>
                {data && data.location ?
                    <div>
                        <br/>
                        <InputSlider data={data.distance} handleChangeInputSlider={this.handleChangeInputSlider}/>
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