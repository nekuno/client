import React, { PropTypes, Component } from 'react';
import Geosuggest from './Geosuggest';

export default class LocationInput extends Component {

    static propTypes = {
        placeholder    : PropTypes.string.isRequired,
        onSuggestSelect: PropTypes.func.isRequired,
        autoFocus      : PropTypes.bool
    };

    static defaultProps = {
        autoFocus: true
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

        return this.props.onSuggestSelect(location);
    }

    render() {
        return (
            <div className="item-content">
                <div className="item-inner location-inner">
                    <div className="item-input" ref="geosuggestWrapper">
                        <Geosuggest {...this.props}
                            autoActivateFirstSuggest={true}
                            initialValue={this.props.defaultValue}
                            placeholder={this.props.placeholder}
                            ref="geosuggest"
                            onSuggestSelect={this.onSuggestSelect}
                            getSuggestLabel={function(suggest) { return suggest.description.length > 35 ? suggest.description.slice(0, 35) + '...' : suggest.description }}
                            onFocus={this.onFocusHandler}
                            skipSuggest={function(suggest) { return suggest.terms.length < 2 }}/>
                    </div>
                </div>
            </div>
        );
    }

    onFocusHandler() {
        /*let geosuggestWrapper = this.refs.geosuggestWrapper;
        window.setTimeout(function() {
            geosuggestWrapper.scrollIntoView();
            document.getElementsByClassName('view')[0].scrollTop -= 100;
        }, 500)*/
    }
}