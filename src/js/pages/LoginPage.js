import React, { PropTypes, Component } from 'react';
const ReactLink = require('react/lib/ReactLink');
const ReactStateSetters = require('react/lib/ReactStateSetters');
import { Link } from 'react-router';
import RegularTopNavbar from '../components/ui/RegularTopNavbar';
import TextInput from '../components/ui/TextInput';
import PasswordInput from '../components/ui/PasswordInput';
import FullWidthButton from '../components/ui/FullWidthButton';
import translate from '../i18n/Translate';
import connectToStores from '../utils/connectToStores';
import LoginActionCreators from '../actions/LoginActionCreators';
import LoginStore from '../stores/LoginStore';

function getState(props) {

    const error = LoginStore.error;

    return {
        error
    };
}

@translate('LoginPage')
@connectToStores([LoginStore], getState)
export default class LoginPage extends Component {

    static propTypes = {
        // Injected by @translate:
        strings: PropTypes.object,
        // Injected by @connectToStores:
        error  : PropTypes.object
    };

    constructor() {
        super();
        this.login = this.login.bind(this);
        this._onKeyDown = this._onKeyDown.bind(this);
        this.state = {
            username: '',
            password: ''
        };
    }

    login() {
        LoginActionCreators.loginUser(this.state.username, this.state.password);
    }
    
    loginAsGuest = function() {
        LoginActionCreators.loginUser('guest', 'guest');
    };

    _onKeyDown(event) {
        let ENTER_KEY_CODE = 13;
        if(event.keyCode === ENTER_KEY_CODE) {
            event.preventDefault();
            this.login();
        }
    }

    linkState(key) {
        return new ReactLink(this.state[key], ReactStateSetters.createStateKeySetter(this, key));
    }

    render() {
        const {
            error,
            strings
        } = this.props;
        return (
            <div className="view view-main">
                <RegularTopNavbar leftText={strings.cancel} centerText={strings.login}/>
                <div className="page">
                    <div id="page-content" className="login-content">
                        <div className="list-block">
                            <ul>
                                <TextInput placeholder={strings.username} valueLink={this.linkState('username')} onKeyDown={this._onKeyDown}/>
                                <PasswordInput placeholder={strings.password} valueLink={this.linkState('password')} onKeyDown={this._onKeyDown}/>
                            </ul>
                        </div>
                        <div className="recover-password">
                            <a href="https://nekuno.com/resetting/request" target="_blank">{strings.recoverPassword}</a>
                        </div>
                        <FullWidthButton type="submit" onClick={this.login}>{strings.login}</FullWidthButton>
                        <div style={{color: '#FFF'}}>
                            <p>{ error ? error.error : ''}</p>
                        </div>
                        <div className="register-text">
                            <span>{strings.hasInvitation}</span> <Link to="/register">{strings.register}</Link>
                        </div>
                        <div className="register-text">
                            <span>{strings.wantGuest}</span> <Link to="/" onClick={this.loginAsGuest}>{strings.asGuest}</Link>
                        </div>
                        <br />
                        <br />
                        <br />
                    </div>
                </div>
            </div>
        );
    }
}

LoginPage.defaultProps = {
    strings: {
        login          : 'Login',
        cancel         : 'Cancel',
        username       : 'User or email',
        password       : 'Password',
        recoverPassword: 'Forgotten your password?',
        hasInvitation  : 'Do you have an invitation?',
        register       : 'Register',
        wantGuest      : 'Do you want to try it first?',
        asGuest        : 'Enter as guest'
    }
};