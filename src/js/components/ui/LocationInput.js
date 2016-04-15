import React, { PropTypes, Component } from 'react';
import Geosuggest from 'react-geosuggest';

export default class LocationInput extends Component {

    static propTypes = {
        placeholder: PropTypes.string.isRequired,
        onSuggestSelect: PropTypes.func.isRequired
    };

    constructor() {
        super();

        this.onFocusHandler = this.onFocusHandler.bind(this);
    }

    componentDidMount() {
        this.refs.geosuggest.focus();
    }

    render() {
        return (
            <div className="item-content">
                <div className="item-inner location-inner">
                    <div className="item-input" ref="geosuggestWrapper">
                        <Geosuggest {...this.props} ref="geosuggest"
                            getSuggestLabel={function(suggest) { return suggest.description.length > 35 ? suggest.description.slice(0, 35) + '...' : suggest.description }}
                            onFocus={this.onFocusHandler} />
                    </div>
                </div>
            </div>
        );
    }

    onFocusHandler() {
        let geosuggestWrapper = this.refs.geosuggestWrapper;
        window.setTimeout(function () {
            geosuggestWrapper.scrollIntoView();
            document.getElementsByClassName('view')[0].scrollTop -= 100;
        }, 500)
    }
}