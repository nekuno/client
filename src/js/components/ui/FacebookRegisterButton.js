import React, { PropTypes, Component } from 'react';
import { SOCIAL_NETWORKS } from '../../constants/Constants';
import FullWidthButton from './FullWidthButton';
import translate from '../../i18n/Translate';

@translate('FacebookRegisterButton')
export default class FacebookRegisterButton extends Component {

    static propTypes = {
        onClickHandler   : PropTypes.func,
        // Injected by @translate:
        strings        : PropTypes.object
    };

    handleClick(scope) {
        this.props.onClickHandler('facebook', scope);
    }

    render() {
        const {strings} = this.props;
        const facebookNetwork = SOCIAL_NETWORKS.find(socialNetwork => socialNetwork.resourceOwner == 'facebook');
        return (
            <div id="facebook-register-button">
                <FullWidthButton onClick={this.handleClick.bind(this, facebookNetwork.scope)}>
                    <span className={'icon-facebook'}></span>&nbsp;&nbsp;
                    <span>{strings.signUp}</span>
                </FullWidthButton>
            </div>
        );
    }
}

FacebookRegisterButton.defaultProps = {
    strings: {
        signUp: 'Sign up with Facebook'
    }
};