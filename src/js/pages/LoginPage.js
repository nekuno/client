import PropTypes from 'prop-types';
import React, { Component } from 'react';
import TopNavBar from '../components/ui/TopNavBar';
import SocialBox from '../components/ui/SocialBox';
import translate from '../i18n/Translate';
import LoginActionCreators from '../actions/LoginActionCreators';
import LoginStore from '../stores/LoginStore';
import SocialNetworkService from '../services/SocialNetworkService';
import Framework7Service from '../services/Framework7Service';

@translate('LoginPage')
export default class LoginPage extends Component {

    static propTypes = {
        // Injected by @translate:
        strings: PropTypes.object
    };

    static contextTypes = {
        router: PropTypes.object.isRequired
    };

    constructor() {
        super();

        this.goHome = this.goHome.bind(this);
        this.goToRegisterPage = this.goToRegisterPage.bind(this);
        this.loginByResourceOwner = this.loginByResourceOwner.bind(this);

    }

    loginByResourceOwner(resource, scope) {
        SocialNetworkService.login(resource, scope).then(
            () => {
                LoginActionCreators.loginUserByResourceOwner(
                    resource,
                    SocialNetworkService.getAccessToken(resource),
                    SocialNetworkService.getRefreshToken(resource)
                ).then(
                    () => {
                        return null; // User is logged in
                    },
                    (error) => {
                        Framework7Service.nekunoApp().alert(error.error);
                    });
            },
            (status) => {
                Framework7Service.nekunoApp().alert(resource + ' login failed: ' + status.error.message)
            });
    }

    loginAsGuest = function() {
        LoginActionCreators.loginUser('guest', 'guest');
    };

    goToRegisterPage = function() {
        this.context.router.push('/register');
    };

    goHome() {
        this.context.router.push('/');
    }

    render() {
        const {strings} = this.props;
        return (
            <div className="views">
                {LoginStore.justLoggedOut ?
                    <TopNavBar leftIcon="left-arrow" centerText={strings.login} onLeftLinkClickHandler={this.goHome}/>
                    :
                    <TopNavBar leftIcon="left-arrow" centerText={strings.login}/>
                }
                <div className="view view-main">
                    <div className="page">
                        <div id="page-content" className="login-content">
                            <p className="center">{strings.loginResource}</p>
                            <SocialBox onClickHandler={this.loginByResourceOwner}/>
                            <br />
                            <div className="register-text-block">
                                <div onClick={this.goToRegisterPage} className="register-text">
                                    <span>{strings.hasInvitation}</span> <a href="javascript:void(0)">{strings.register}</a>
                                </div>
                                {/*Uncomment to enable login as guest
                                 <div onClick={this.loginAsGuest} className="register-text">
                                 <span>{strings.wantGuest}</span> <a href="javascript:void(0)">{strings.asGuest}</a>
                                 </div>*/}
                            </div>
                            <br />
                            <br />
                            <br />
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

LoginPage.defaultProps = {
    strings: {
        login        : 'Login',
        cancel       : 'Cancel',
        loginResource: 'Login with a social network',
        hasInvitation: 'Do you have an invitation?',
        register     : 'Register',
        wantGuest    : 'Do you want to try it?',
        asGuest      : 'Enter as guest'
    }
};