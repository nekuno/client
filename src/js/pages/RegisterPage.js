import React, { PropTypes, Component } from 'react';
const ReactLink = require('react/lib/ReactLink');
const ReactStateSetters = require('react/lib/ReactStateSetters');
import RegularTopNavbar from '../components/ui/RegularTopNavbar';
import TextInput from '../components/ui/TextInput';
import translate from '../i18n/Translate';
import connectToStores from '../utils/connectToStores';
import ConnectActionCreators from '../actions/ConnectActionCreators';
import InvitationStore from '../stores/InvitationStore';
import { FACEBOOK_SCOPE, TWITTER_SCOPE, GOOGLE_SCOPE, SPOTIFY_SCOPE } from '../constants/Constants';

function getState(props) {

    const error = InvitationStore.error;
    const token = InvitationStore.token;

    return {
        error,
        token
    };
}

@translate('RegisterPage')
@connectToStores([InvitationStore], getState)
export default class RegisterPage extends Component {

    static contextTypes = {
        history: PropTypes.object.isRequired
    };

    static propTypes = {
        // Injected by @translate:
        strings: PropTypes.object,
        // Injected by @connectToStores:
        error  : PropTypes.object
    };

    constructor(props) {
        super(props);
        this.handleOnChange = this.handleOnChange.bind(this);
        this.handleFacebook = this.handleFacebook.bind(this);
        this.handleTwitter = this.handleTwitter.bind(this);
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
            if(token) {
                ConnectActionCreators.validateInvitation(token);
            }
        }, 500);
    }

    handleFacebook(e) {
        e.preventDefault();
        return this.handleSocialNetwork('facebook', FACEBOOK_SCOPE);
    }

    handleTwitter(e) {
        e.preventDefault();
        return this.handleSocialNetwork('twitter', TWITTER_SCOPE);
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
        hello(network).login({scope: scope}).then(function(response) {
            var accessToken = response.authResponse.access_token;
            console.log('accessToken:', accessToken);
            hello(network).api('me').then(function(status) {
                    var userId = status.id.toString();
                    console.log('userId: ', userId);
                    ConnectActionCreators.connect(token, accessToken, network, userId);
                    history.pushState(null, '/join');
                },
                function(status) {
                    nekunoApp.alert(network + ' login failed: ' + status.error.message);
                }
            )
        }, function(response) {
            nekunoApp.alert(network + ' login failed: ' + response.error.message);
        });
    }

    render() {
        const {
            error,
            token,
            strings
        } = this.props;

        if(token) {
            nekunoApp.alert('Invitación correcta! Conecta ahora una red para registrarte en Nekuno');
        }

        return (
            <div className="view view-main">
                <RegularTopNavbar leftText={strings.cancel} centerText={strings.register}/>
                <div className="page">
                    <div id="page-content" className="register-content">
                        <div className="register-title bold">
                            <div className="title">{strings.title}</div>
                        </div>
                        <div className="register-sub-title">{strings.subtitle}</div>

                        <div className="list-block">
                            <ul>
                                <TextInput onChange={this.handleOnChange} placeholder={strings.paste}/>
                            </ul>
                        </div>
                        <div style={{color: '#FFF'}}>
                            <p>{ error ? error.error : ''}</p>
                        </div>
                        { token ?
                            <div className="social-box">
                                <div><a onClick={this.handleFacebook}><span className="icon-facebook"></span></a></div>
                                <div><a onClick={this.handleTwitter}><span className="icon-twitter"></span></a></div>
                                <div><a onClick={this.handleGoogle}><span className="icon-google"></span></a></div>
                                <div><a onClick={this.handleSpotify}><span className="icon-spotify"></span></a></div>
                            </div>
                            : '' }
                        <div className="register-title">
                            <p dangerouslySetInnerHTML={{__html:strings.privacy }}/>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

RegisterPage.defaultProps = {
    strings: {
        register: 'Create account',
        cancel  : 'Cancel',
        title   : 'Nekuno sólo permite el registro por invitación.',
        subtitle: 'Por favor, copia la URL que habrás recibido en tu invitación y pégala en el siguiente campo para poder crear tu cuenta en Nekuno.',
        paste   : 'Pega aquí la URL de la invitación',
        privacy : 'Al registrarte, estás aceptando las <a href="https://nekuno.com/static/legal">Condiciones Legales</a> y la <a href="https://nekuno.com/static/privacy">Política de Privacidad</a> de Nekuno.'
    }
};
