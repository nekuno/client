import React, { PropTypes, Component } from 'react';
import LocationInput from '../../ui/LocationInput';
import translate from '../../../i18n/Translate';

@translate('LocationField')
export default class LocationField extends Component {
    static propTypes = {
        birthday       : PropTypes.string,
        onSaveHandler  : PropTypes.func,
        // Injected by @translate:
        strings        : PropTypes.object
    };

    constructor(props) {
        super(props);
        this.onSuggestSelect = this.onSuggestSelect.bind(this);
    }

    onSuggestSelect(location) {
        this.props.onSaveHandler('location', location);

    }

    render() {
        const {location, strings} = this.props;
        return (
            <div>
                <div className="answer-question">
                    <div className="title answer-question-title">
                        {strings.title}
                    </div>
                    <div className="list-block">
                        <LocationInput defaultValue={location} placeholder={strings.location} onSuggestSelect={this.onSuggestSelect} autoFocus={false}/>
                    </div>
                </div>
                <br />
                <br />
            </div>
        );
    }
}

LocationField.defaultProps = {
    strings: {
        location           : 'Location',
        title              : 'Select your location',
        save               : 'Save'
    }
};
