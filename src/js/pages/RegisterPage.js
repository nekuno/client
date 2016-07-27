import React, { PropTypes, Component } from 'react';
import TopNavBar from '../components/ui/TopNavBar';
import TextInput from '../components/ui/TextInput';
import SocialBox from '../components/ui/SocialBox';
import EmptyMessage from '../components/ui/EmptyMessage';
import translate from '../i18n/Translate';
import connectToStores from '../utils/connectToStores';
import ConnectActionCreators from '../actions/ConnectActionCreators';
import LoginActionCreators from '../actions/LoginActionCreators';
import InvitationStore from '../stores/InvitationStore';
import LocaleStore from '../stores/LocaleStore';
import SocialNetworkService from '../services/SocialNetworkService';

function getState(props) {

    const error = InvitationStore.error;
    const token = InvitationStore.token;
    const invitation = InvitationStore.invitation;
    const interfaceLanguage = LocaleStore.locale;

    return {
        error,
        token,
        invitation,
        interfaceLanguage
    };
}

@translate('RegisterPage')
@connectToStores([InvitationStore, LocaleStore], getState)
export default class RegisterPage extends Component {

    static propTypes = {
        // Injected by @translate:
        strings   : PropTypes.object,
        // Injected by @connectToStores:
        error     : PropTypes.object,
        token     : PropTypes.string,
        invitation: PropTypes.object
    };

    constructor(props) {
        super(props);
        this.handleOnChange = this.handleOnChange.bind(this);
        this.handleSocialNetwork = this.handleSocialNetwork.bind(this);
        
        this.state = {
            registeringUser: false
        }
    }

    componentWillMount() {
        let {location} = this.props;
        let initialToken = location.query && location.query.token ? location.query.token : null;
        this.setState({initialToken});
        if (initialToken) {
            ConnectActionCreators.validateInvitation(initialToken);
        }
    }

    handleOnChange() {
        clearTimeout(this.tokenTimeout);
        var token = this.refs.token.getValue();
        this.tokenTimeout = setTimeout(() => {
            token = token.replace(/(http[s]?:\/\/)?(www\.)?(pre\.)?(local\.)?(nekuno.com\/)?(invitation\/)?(inv)?/ig, '');
            if (token) {
                ConnectActionCreators.validateInvitation(token);
            }
        }, 500);
    }

    handleSocialNetwork(resource, scope) {
        const {token, interfaceLanguage} = this.props;
        SocialNetworkService.login(resource, scope).then(() => {
            LoginActionCreators.loginUserByResourceOwner(resource, SocialNetworkService.getAccessToken(resource))
                .then(() => { return null },
                    () => {
                        const profile = SocialNetworkService.getProfile(resource);
                        profile.interfaceLanguage = interfaceLanguage;
                        profile.orientationRequired = false;
                        const user = SocialNetworkService.getUser(resource);
                        user[resource + 'ID'] = SocialNetworkService.getResourceId(resource);
                        LoginActionCreators.register(user, profile, token, {
                            resourceOwner: resource,
                            oauthToken: SocialNetworkService.getAccessToken(resource),
                            resourceId: SocialNetworkService.getResourceId(resource),
                            expireTime: SocialNetworkService.getExpireTime(resource)
                        });
                        this.setState({
                            registeringUser: true
                        });
                    });
        }, (status) => {
            nekunoApp.alert(resource + ' login failed: ' + status.error.message)
        });
    }

    render() {

        const {error, token, invitation, strings} = this.props;

        let initialToken = this.state.initialToken;

        return (
            <div className="view view-main">
                <TopNavBar leftText={strings.cancel} centerText={strings.register}/>
                <div className="page">
                    {this.state.registeringUser ?
                        <EmptyMessage text={strings.loadingMessage} loadingGif={true} />
                        :
                        <div id="page-content" className="register-content">
                            <div className="register-title bold">
                                <div className="title">{token ? (invitation.slogan ? invitation.slogan : strings.titleCorrect) : strings.title}</div>
                            </div>
                            <div className="register-sub-title">{ token ? (invitation.htmlText ? invitation.htmlText : strings.correct) : strings.subtitle}</div>
                            { token ? '' :
                                <div className="list-block">
                                    <ul>
                                        <TextInput ref="token" defaultValue={initialToken} onChange={this.handleOnChange} placeholder={strings.paste}/>
                                    </ul>
                                </div>
                            }
                            <div style={{color: '#FFF'}}>
                                <p>{ error ? error.error : ''}</p>
                            </div>
                            { token ? <SocialBox onClickHandler={this.handleSocialNetwork}/> : '' }
                        </div>
                    }
                </div>
            </div>
        );
    }
}

RegisterPage.defaultProps = {
    strings: {
        register      : 'Create account',
        cancel        : 'Cancel',
        title         : 'Nekuno only allows registration by invitation.',
        titleCorrect  : 'Awesome! You got an invitation!',
        subtitle      : 'Please copy the URL that you\'ve received your invitation and paste it into the field below to create your account at Nekuno.',
        paste         : 'Paste the invitation url here',
        correct       : 'Just one last step! Connect one of the following social networks:',
        loadingMessage: 'Registering user'
    }
};
