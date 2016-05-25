import React, { PropTypes, Component } from 'react';
import translate from '../i18n/Translate';

@translate('GuestBanner')
export default class GuestBanner extends Component {
    static propTypes = {
        // Injected by @translate:
        strings     : PropTypes.object
    };

    render() {
        const { strings } = this.props;
        return (
            <div className="guest-banner">
                {strings.text}
            </div>
        );
    }
}
GuestBanner.defaultProps = {
    strings: {
        text     : 'You are in guest mode. Click here to register and get Nekuno to work for you'
    }
};