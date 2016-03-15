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
import { FACEBOOK_SCOPE, GOOGLE_SCOPE, SPOTIFY_SCOPE } from '../constants/Constants';

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
        error: PropTypes.object,
        requesting: PropTypes.bool.isRequired
    };

    constructor(props) {
        super(props);
        this.handleOnChange = this.handleOnChange.bind(this);
        this.handleFacebook = this.handleFacebook.bind(this);
        this.handleGoogle = this.handleGoogle.bind(this);
        this.handleSpotify = this.handleSpotify.bind(this);
        this.handleSocialNetwork = this.handleSocialNetwork.bind(this);
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
        return this.handleSocialNetwork('facebook', FACEBOOK_SCOPE);
    }

    handleSpotify(e) {
        e.preventDefault();
        return this.handleSocialNetwork('spotify', SPOTIFY_SCOPE);
    }

    handleGoogle(e) {
        e.preventDefault();
        return this.handleSocialNetwork('google', GOOGLE_SCOPE);
    }

    handleSocialNetwork(network, scope) {
        console.log(network);
        var history = this.context.history;
        var token = this.props.token;
        hello(network).login({scope: scope}).then(function (response) {
            var accessToken = response.authResponse.access_token;
            console.log('accessToken:', accessToken);
            hello(network).api('me').then(function (status) {
                    console.log('userId: ', status.id);
                    ConnectActionCreators.connect(token, accessToken, network, status.id);
                    history.pushState(null, '/join');
                },
                function (status) {
                    nekunoApp.alert(network + ' login failed: ' + status.error.message);
                }
            )
        }, function (response) {
            nekunoApp.alert(network + ' login failed: ' + response.error.message);
        });
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
                        <div className="register-sub-title">Por favor, copia la URL que habrás recibido en tu invitación
                            y pégala en el siguiente campo para poder crear tu cuenta en Nekuno.
                        </div>

                        <div className="list-block">
                            <ul>
                                <TextInput onChange={this.handleOnChange}
                                           placeholder={'Pega aquí la URL de la invitación'}/>
                            </ul>
                        </div>
                        <div style={{color: '#FFF'}}>
                            <p>{ requesting ? 'Comprobando...' : ''}</p>
                            <p>{ error ? error.error : ''}</p>
                        </div>
                        { token ?
                            <div className="social-box">
                                <div><a onClick={this.handleFacebook}><span className="icon-facebook"></span></a></div>
                                <div><a onClick={this.handleGoogle}><span className="icon-google-plus"></span></a></div>
                                <div><a onClick={this.handleSpotify}><span className="icon-spotify"></span></a></div>
                                {/*
                                 <div><a><span className="icon-twitter"></span></a></div>


                                 */}
                            </div>
                            : '' }
                        <div className="register-title">
                            <p>Al registrarte, estás aceptando las <a href="https://nekuno.com/static/legal">Condiciones
                                Legales</a> y la <a href="https://nekuno.com/static/privacy">Política de Privacidad</a>
                                de Nekuno.</p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
