import PropTypes from 'prop-types';
import React, { Component } from 'react';
import translate from '../i18n/Translate';
import LoginActionCreators from '../actions/LoginActionCreators';

@translate('GuestBanner')
export default class GuestBanner extends Component {
    static propTypes = {
        // Injected by @translate:
        strings     : PropTypes.object
    };

    constructor(props) {
        super(props);

        this.logout = this.logout.bind(this);
    }

    logout() {
        LoginActionCreators.logoutUser('/register');
    }

    render() {
        const { strings } = this.props;
        return (
            <div onClick={this.logout} className="guest-banner">
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