import React, { PropTypes, Component } from 'react';
const ReactLink = require('react/lib/ReactLink');
const ReactStateSetters = require('react/lib/ReactStateSetters');
import RegularTopNavbar from '../components/ui/RegularTopNavbar';
import TextInput from '../components/ui/TextInput';
import PasswordInput from '../components/ui/PasswordInput';
import FullWidthButton from '../components/ui/FullWidthButton';
import LoginActionCreators from '../actions/LoginActionCreators';
import connectToStores from '../utils/connectToStores';
import LoginStore from '../stores/LoginStore';

function getState(props) {

    const error = LoginStore.error;
    const requesting = LoginStore.requesting();

    return {
        error,
        requesting
    };
}

@connectToStores([LoginStore], getState)
export default class LoginPage extends Component {

    static propTypes = {
        // Injected by @connectToStores:
        error     : PropTypes.object,
        requesting: PropTypes.bool.isRequired
    };

    constructor() {
        super();
        this.login = this.login.bind(this);
        this._onKeyDown = this._onKeyDown.bind(this);
        this.state = {
            user    : '',
            password: ''
        };
    }

    login() {
        LoginActionCreators.loginUser(this.state.user, this.state.password);
    }

    _onKeyDown(event) {
        let ENTER_KEY_CODE = 13;
        if (event.keyCode === ENTER_KEY_CODE) {
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
            requesting
            } = this.props;
        return (
            <div className="view view-main">
                <RegularTopNavbar leftText={'Cancelar'} centerText={'Iniciar sesión'}/>
                <div className="page">
                    <div id="page-content" className="login-content">
                        <div className="list-block">
                            <ul>
                                <TextInput placeholder={'Usuario o email'} valueLink={this.linkState('user')} onKeyDown={this._onKeyDown}/>
                                <PasswordInput placeholder={'Contraseña'} valueLink={this.linkState('password')} onKeyDown={this._onKeyDown}/>
                            </ul>
                        </div>
                        <FullWidthButton type="submit" onClick={this.login}>Iniciar Sesión</FullWidthButton>
                        <div style={{color: '#FFF'}}>
                            <p>{ requesting ? 'Enviando...' : ''}</p>
                            <p>{ error ? error.error : ''}</p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
