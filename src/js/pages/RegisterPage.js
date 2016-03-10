import React, { PropTypes, Component } from 'react';
const ReactLink = require('react/lib/ReactLink');
const ReactStateSetters = require('react/lib/ReactStateSetters');
import RegularTopNavbar from '../components/ui/RegularTopNavbar';
import TextInput from '../components/ui/TextInput';
import FullWidthButton from '../components/ui/FullWidthButton';
import LoginActionCreators from '../actions/LoginActionCreators';
import ConnectActionCreators from '../actions/ConnectActionCreators';
import connectToStores from '../utils/connectToStores';
import InvitationStore from '../stores/InvitationStore';
import { FACEBOOK_SCOPE } from '../constants/Constants';

function getState(props) {

    const error = InvitationStore.error;
    const token = InvitationStore.token;
    const requesting = InvitationStore.requesting();

    return {
        error,
        token,
        requesting
    };
}

@connectToStores([InvitationStore], getState)
export default class RegisterPage extends Component {

    static contextTypes = {
        history: PropTypes.object.isRequired
    };

    static propTypes = {
        // Injected by @connectToStores:
        error     : PropTypes.object,
        requesting: PropTypes.bool.isRequired
    };

    constructor(props) {
        super(props);
        this.handleOnChange = this.handleOnChange.bind(this);
        this.handleFacebook = this.handleFacebook.bind(this);
        this.state = {
            url: ''
        };
    }

    handleOnChange(e) {
        e.preventDefault();
        clearTimeout(this.tokenTimeout);
        var token = e.target.value;
        this.tokenTimeout = setTimeout(() => {
            token = token.replace(/(http[s]?:\/\/)?(www\.)?(pre\.)?(local\.)?(nekuno.com\/)?(invitation\/)?(inv)?/ig, '');
            if (token) {
                ConnectActionCreators.validateInvitation(token);
            }
        }, 500);
    }

    handleFacebook(e) {
        e.preventDefault();
        var history = this.context.history;
        var token = this.props.token;
        openFB.login(function(response) {
            if (response.status === 'connected') {
                var accessToken = response.authResponse.accessToken;
                console.log('accessToken:', accessToken);
                openFB.api({
                    path   : '/me',
                    params : {fields: 'id'},
                    success: (status) => {
                        console.log('userId: ', status.id);
                        ConnectActionCreators.connect(token, accessToken, 'facebook', status.id);
                        history.pushState(null, '/join');
                    },
                    error  : (status) => {
                        nekunoApp.alert('Facebook login failed: ' + status.message);
                    }
                });
            } else {
                nekunoApp.alert('Facebook login failed: ' + response.status);
            }

        }, {scope: FACEBOOK_SCOPE});
    }

    render() {
        const {
            error,
            token,
            requesting
            } = this.props;

        if (token) {
            nekunoApp.alert('Invitación correcta! Conecta ahora una red para registrarte en Nekuno');
        }

        return (
            <div className="view view-main">
                <RegularTopNavbar leftText={'Cancelar'} centerText={'Crear cuenta'}/>
                <div className="page">
                    <div id="page-content" className="register-content">
                        <div className="register-title bold">
                            <div className="title">Nekuno</div>
                            <div className="title">sólo permite el registro por invitación.</div>
                        </div>
                        <div className="register-sub-title">Por favor, copia la URL que habrás recibido en tu invitación y pégala en el siguiente campo para poder crear tu cuenta en Nekuno.</div>

                        <div className="list-block">
                            <ul>
                                <TextInput onChange={this.handleOnChange} placeholder={'Pega aquí la URL de la invitación'}/>
                            </ul>
                        </div>
                        <div style={{color: '#FFF'}}>
                            <p>{ requesting ? 'Comprobando...' : ''}</p>
                            <p>{ error ? error.error : ''}</p>
                        </div>
                        { token ?
                            <div className="social-box">
                                <div><a onClick={this.handleFacebook}><span className="icon-facebook"></span></a></div>
                                {/*
                                 <div><a><span className="icon-twitter"></span></a></div>
                                 <div><a><span className="icon-google-plus"></span></a></div>
                                 <div><a><span className="icon-spotify"></span></a></div>
                                 */}
                            </div>
                            : '' }
                        <div className="register-title">
                            <p>Al registrarte, estás aceptando las <a href="https://nekuno.com/static/legal">Condiciones Legales</a> y la <a href="https://nekuno.com/static/privacy">Política de Privacidad</a> de Nekuno.</p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
