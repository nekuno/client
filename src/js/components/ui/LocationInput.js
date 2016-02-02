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
            <li>
                <div className="item-content">
                    <div className="item-inner">
                        <div className="item-input">
                            <Geosuggest {...this.props}/>
                        </div>
                    </div>
                </div>
            </li>
        );
    }
}