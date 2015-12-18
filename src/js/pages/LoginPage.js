import React, { PropTypes, Component } from 'react';
import LinkedStateMixin from 'react-addons-linked-state-mixin';
import ReactMixin from 'react-mixin';
import RegularTopNavbar from '../components/ui/RegularTopNavbar';
import TextInput from '../components/ui/TextInput';
import PasswordInput from '../components/ui/PasswordInput';
import FullWidthButton from '../components/ui/FullWidthButton';
import LoginActionCreators from '../actions/LoginActionCreators';

export default class LoginPage extends Component {

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

    render() {
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
                    </div>
                </div>
            </div>
        );
    }
}

ReactMixin(LoginPage.prototype, LinkedStateMixin);