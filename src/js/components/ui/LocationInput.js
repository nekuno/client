import React, { PropTypes, Component } from 'react';
import shouldPureComponentUpdate from 'react-pure-render/function';
import Geosuggest from 'react-geosuggest';

export default class LocationInput extends Component {

    static propTypes = {
        placeholder: PropTypes.string.isRequired,
        onSuggestSelect: PropTypes.func.isRequired
    };

    render() {
        return (
            <div className="item-content">
                <div className="item-inner location-inner">
                    <div className="item-input">
                        <Geosuggest {...this.props}
                            getSuggestLabel={function(suggest) { return suggest.description.length > 35 ? suggest.description.slice(0, 35) + '...' : suggest.description }}/>
                    </div>
                </div>
            </div>
        );
    }
}