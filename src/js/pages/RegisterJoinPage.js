import React, { PropTypes, Component } from 'react';
const ReactLink = require('react/lib/ReactLink');
const ReactStateSetters = require('react/lib/ReactStateSetters');
import RegularTopNavbar from '../components/ui/RegularTopNavbar';
import TextInput from '../components/ui/TextInput';
import PasswordInput from '../components/ui/PasswordInput';
import FullWidthButton from '../components/ui/FullWidthButton';
import LoginActionCreators from '../actions/LoginActionCreators';
import connectToStores from '../utils/connectToStores';
import ConnectStore from '../stores/ConnectStore';

function getState() {

    const token = ConnectStore.token;
    const accessToken = ConnectStore.accessToken;
    const resource = ConnectStore.resource;

    return {
        token,
        accessToken,
        resource
    };
}

@connectToStores([ConnectStore], getState)
export default class RegisterJoinPage extends Component {

    static contextTypes = {
        history: PropTypes.object.isRequired
    };

    static propTypes = {
        // Injected by @connectToStores:
        token      : PropTypes.string,
        accessToken: PropTypes.string,
        resource   : PropTypes.string
    };

    constructor() {
        super();
        this.state = {
            user    : '',
            password: ''
        };
    }

    register(e) {
        e.preventDefault();
        const {
            token,
            accessToken,
            resource
            } = this.props;
        console.log(this.state, this.props);
    }

    linkState(key) {
        return new ReactLink(this.state[key], ReactStateSetters.createStateKeySetter(this, key));
    }

    render() {

        const error = false;
        const requesting = false;

        if (!this.props.token) {
            this.context.history.pushState(null, '/register');
        }

        return (
            <div className="view view-main">
                <RegularTopNavbar leftText={'Cancelar'} centerText={'Crear cuenta'}/>
                <div data-page="index" className="page">
                    <div id="page-content" className="login-content">
                        <div className="list-block">
                            <ul>
                                <TextInput placeholder={'Nombre de usuario'} valueLink={this.linkState('user')}/>
                                <PasswordInput placeholder={'Contraseña'} valueLink={this.linkState('password')}/>
                            </ul>
                        </div>
                        <FullWidthButton type="submit" onClick={this.register.bind(this)}>Completar registro</FullWidthButton>
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
