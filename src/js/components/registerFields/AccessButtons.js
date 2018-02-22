import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { SOCIAL_NETWORKS_NAMES, FACEBOOK_SCOPE } from '../../constants/Constants';
import Button from '../ui/Button';
import translate from '../../i18n/Translate';

@translate('AccessButtons')
export default class AccessButtons extends Component {

    static propTypes = {
        onLoginClick   : PropTypes.func,
        onRegisterClick: PropTypes.func,
        disabled       : PropTypes.bool,
        hasNetworkInfo : PropTypes.bool,
    };


    handleRegisterClick() {
        this.props.onRegisterClick();
    }

    handleLoginClick() {
        this.props.onLoginClick(SOCIAL_NETWORKS_NAMES.FACEBOOK, FACEBOOK_SCOPE);
    }

    render() {
        const {disabled, strings, hasNetworkInfo} = this.props;
        const registerText = disabled ? <span className="icon-spinner rotation-animation"/> : <span>{strings.registerText}</span>;
        const loginText = disabled ? <span className="icon-spinner rotation-animation"/> :
            hasNetworkInfo? strings.registerNow : <span>{strings.loginText}</span>;

        return (
            <div className="access-buttons">
                <div className="register-access-button">
                    <Button onClick={this.handleRegisterClick.bind(this)} disabled={disabled}>
                        {registerText}
                    </Button>
                </div>
                <div className="login-access-button">
                    <Button onClick={this.handleLoginClick.bind(this)} disabled={disabled || hasNetworkInfo}>
                        {loginText}
                    </Button>
                </div>
            </div>
        );
    }
}

AccessButtons.defaultProps = {
    onClickHandler: () => {
    },
    disabled      : false,
    strings: {
        registerText: "Sign up now",
        loginText   : "I'm already registered",
        registerNow : "You can sign up now",
    }
};
