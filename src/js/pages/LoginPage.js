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
        this.state = {
            user    : '',
            password: ''
        };
    }

    login(e) {
        e.preventDefault();
        LoginActionCreators.loginUser(this.state.user, this.state.password);
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
                <div data-page="index" className="page">
                    <div id="page-content" className="login-content">
                        <div className="list-block">
                            <ul>
                                <TextInput placeholder={'Usuario o email'} valueLink={this.linkState('user')}/>
                                <PasswordInput placeholder={'Contraseña'} valueLink={this.linkState('password')}/>
                            </ul>
                        </div>
                        <FullWidthButton type="submit" onClick={this.login.bind(this)}>Iniciar Sesión</FullWidthButton>
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
