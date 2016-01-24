import React, { PropTypes, Component } from 'react';
const ReactLink = require('react/lib/ReactLink');
const ReactStateSetters = require('react/lib/ReactStateSetters');
import RegularTopNavbar from '../components/ui/RegularTopNavbar';
import TextInput from '../components/ui/TextInput';
import FullWidthButton from '../components/ui/FullWidthButton';
import LoginActionCreators from '../actions/LoginActionCreators';
import connectToStores from '../utils/connectToStores';
import InvitationStore from '../stores/InvitationStore';

function getState(props) {

    const error = InvitationStore.error;
    const requesting = InvitationStore.requesting();

    return {
        error,
        requesting
    };
}

@connectToStores([InvitationStore], getState)
export default class RegisterPage extends Component {

    static propTypes = {
        // Injected by @connectToStores:
        error     : PropTypes.object,
        requesting: PropTypes.bool.isRequired
    };

    constructor(props) {
        super(props);
        this.handleOnChange = this.handleOnChange.bind(this);
        this.state = {
            url: ''
        };
    }

    handleOnChange(e) {
        e.preventDefault();
        var token = e.target.value;
        token.replace('https://nekuno.com/invitation/', '');
        if (token) {
            console.log('Validating token...', token);
            LoginActionCreators.validate(token);
        }
    }

    render() {
        const {
            error,
            requesting
            } = this.props;
        return (
            <div className="view view-main">
                <RegularTopNavbar leftText={'Cancelar'} centerText={'Crear cuenta'}/>
                <div data-page="index" className="page">
                    <div id="page-content" className="register-content">
                        <div className="register-title">
                            <h1>Nekuno sólo permite el registro por invitación.</h1>
                            <h4>Por favor, copia la URL que habrás recibido en tu invitación y pégala en el siguiente campo para poder crear tu cuenta en Nekuno.</h4>
                        </div>
                        <div className="list-block">
                            <ul>
                                <TextInput onChange={this.handleOnChange} placeholder={'Pega aquí la URL de la invitación'}/>
                            </ul>
                        </div>
                        <div style={{color: '#FFF'}}>
                            <p>{ requesting ? 'Comprobando...' : ''}</p>
                            <p>{ error ? error.error : ''}</p>
                        </div>
                        <div className="register-title">
                            <p>Al registrarte, estás aceptando las <a href="https://nekuno.com/static/legal">Condiciones Legales</a> y la <a href="https://nekuno.com/static/privacy">Política de Privacidad</a> de Nekuno.</p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
