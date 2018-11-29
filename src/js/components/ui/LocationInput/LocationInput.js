import PropTypes from 'prop-types';
import React, { Component } from 'react';
import Geosuggest from 'react-geosuggest';
import styles from './LocationInput.scss';
import Input from "../Input/Input";
import {action} from "@storybook/addon-actions";

export default class LocationInput extends Component {

    static propTypes = {
        title          : PropTypes.string,
        defaultValue   : PropTypes.string,
        placeholder    : PropTypes.string.isRequired,
        onSuggestSelect: PropTypes.func.isRequired,
        autoFocus      : PropTypes.bool,
        clearOnSelect  : PropTypes.bool
    };

    constructor() {
        super();

        this.onFocusHandler = this.onFocusHandler.bind(this);
        this.onSuggestSelect = this.onSuggestSelect.bind(this);
    }

    componentDidMount() {
        if (this.props.autoFocus) {
            this.refs.geosuggest.focus();
        }
    }

    onSuggestSelect(suggest) {
        let locality = '', country = '';
        if (suggest) {
            suggest.gmaps.address_components.forEach(function(component) {
                component.types.forEach(function(type) {
                    if (!locality && (type === 'locality' || type === 'administrative_area_level_4')) {
                        locality = component.long_name;
                    }
                    if (!country && type === 'country') {
                        country = component.long_name;
                    }
                });
            });

            let location = {
                latitude : parseFloat(suggest.location.lat),
                longitude: parseFloat(suggest.location.lng),
                address  : suggest.label,
                locality : locality,
                country  : country
            };

            if (this.props.clearOnSelect) {
                this.refs['geosuggest'].clear();
            }

            return this.props.onSuggestSelect(location);
        }
    }

    onFocusHandler() {
        let geosuggestWrapper = this.refs.geosuggestWrapper;
        if (geosuggestWrapper) {
            window.setTimeout(function () {
                geosuggestWrapper.scrollIntoView();
                document.getElementsByClassName('view')[0].scrollTop -= 100;
            }, 500);
        }
    }

    render() {
        const {title, defaultValue, placeholder} = this.props;

        const inputStyles = { 'input': {'test': 'test', 'anothertest': 'anothertest'}, 'suggests': {}, 'suggestItem': {} };

        return (
            <div className={styles.locationInputWrapper}>
                <div className={styles.title}>{title}</div>
                <div className={styles.locationInput} ref="geosuggestWrapper">
                    <Geosuggest {...this.props}
                                autoActivateFirstSuggest={true}
                                initialValue={defaultValue}
                                placeholder={placeholder}
                                inputClassName={'additional-class'}
                                ref="geosuggest"
                                onSuggestSelect={this.onSuggestSelect}
                                getSuggestLabel={function(suggest) { return suggest.description.length > 35 ? suggest.description.slice(0, 35) + '...' : suggest.description }}
                                onFocus={this.onFocusHandler}
                                skipSuggest={function(suggest) { return suggest.terms.length < 2 || !suggest.types.some(type => type === 'locality' || type === 'administrative_area_level_4') }}
                                required
                    />
                </div>
            </div>
        );
    }
}