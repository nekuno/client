import PropTypes from 'prop-types';
import React, { Component } from 'react';
import TopNavBar from '../components/ui/TopNavBar';
import Input from '../components/ui/Input';
import SocialBox from '../components/ui/SocialBox';
import FacebookButton from '../components/ui/FacebookButton';
import EmptyMessage from '../components/ui/EmptyMessage';
import translate from '../i18n/Translate';
import connectToStores from '../utils/connectToStores';
import ConnectActionCreators from '../actions/ConnectActionCreators';
import * as GroupActionCreators from '../actions/GroupActionCreators';
import RouterActionCreators from '../actions/RouterActionCreators';
import LoginActionCreators from '../actions/LoginActionCreators';
import InvitationStore from '../stores/InvitationStore';
import LocaleStore from '../stores/LocaleStore';
import SocialNetworkService from '../services/SocialNetworkService';
import Framework7Service from '../services/Framework7Service';

function getState(props) {

    const error = InvitationStore.error;
    const token = InvitationStore.token || 'join';
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
        strings          : PropTypes.object,
        // Injected by @connectToStores:
        error            : PropTypes.object,
        token            : PropTypes.string,
        invitation       : PropTypes.object,
        interfaceLanguage: PropTypes.string
    };

    static contextTypes = {
        router: PropTypes.object.isRequired
    };

    constructor(props) {
        super(props);
        this.handleOnChange = this.handleOnChange.bind(this);
        this.handleSocialNetwork = this.handleSocialNetwork.bind(this);
        this._registerUser = this._registerUser.bind(this);

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
            token = token.replace(/(http[s]?:\/\/)?(m\.)?(client\.)?(pre\.)?(local\.)?nekuno.com\/#\/register\/\?token=/ig, '');
            token = token.replace(/(http[s]?:\/\/)?(www\.)?(pre\.)?(local\.)?(nekuno.com\/)?(invitation\/)?(inv)?/ig, '');
            if (token) {
                ConnectActionCreators.validateInvitation(token);
            }
        }, 500);
    }

    handleSocialNetwork(resource, scope) {
        const {token, invitation, interfaceLanguage, strings} = this.props;
        SocialNetworkService.login(resource, scope, true).then(() => {
            const oauthData = SocialNetworkService.buildOauthData(resource);
            LoginActionCreators.loginUserByResourceOwner(
                resource,
                SocialNetworkService.getAccessToken(resource),
                SocialNetworkService.getRefreshToken(resource)
            ).then(
                () => {
                    console.log('User already logged in. Using invitation', invitation);
                    if (invitation.hasOwnProperty('group')) {
                        console.log('Joining group', invitation.group);
                        return GroupActionCreators.joinGroup(invitation.group.id);
                    }
                    return null; // User is logged in
                },
                () => {
                    let user = SocialNetworkService.getUser(resource);
                    let profile = SocialNetworkService.getProfile(resource);
                    if (!user || !profile) {
                        Framework7Service.nekunoApp().alert(strings.blockingError);
                        this.setState({registeringUser: false});
                    } else {
                        profile.interfaceLanguage = interfaceLanguage;
                        profile.orientationRequired = false;
                        this._registerUser(user, profile, token, oauthData);
                    }
                });
        }, (status) => {
            Framework7Service.nekunoApp().alert(resource + ' login failed: ' + status.error.message)
        });
    }

    _registerUser(user, profile, token, oauthData) {
        LoginActionCreators.preRegister(user, profile, token, oauthData);
        setTimeout(() => RouterActionCreators.replaceRoute('answer-username'), 0);

        this.setState({
            registeringUser: true
        });
    }

    render() {
        const {error, token, invitation, strings} = this.props;
        const {initialToken} = this.state;

        return (
            <div className="views">
                <div className="view view-main register-view">
                    <div className="page register-page">
                        <div className="register-image" style={invitation && invitation.image_url && (!initialToken || token || error) ? {background: 'url("' + invitation.image_url + '") no-repeat center top', minHeight: '100%'} : null}>
                            <div className="gradient-transparency"></div>
                        </div>
                        <div className="register-nekuno-logo-wrapper">
                            <div className="register-nekuno-logo"></div>
                        </div>
                        {this.state.registeringUser ?
                            <EmptyMessage text={strings.registeringMessage} loadingGif={true}/>
                            : initialToken && !token && !error ? <EmptyMessage text={strings.loadingMessage} loadingGif={true}/>
                                :
                                <div id="page-content" className="register-content">
                                    <div className="register-title bold">
                                        <div className="title">{token && invitation ? (invitation.slogan ? invitation.slogan : strings.titleCorrect) : strings.title}</div>
                                    </div>
                                    <div className="register-sub-title bold">
                                        {strings.openSource}
                                    </div>
                                </div>
                        }

                        { token ?
                            <div>
                                <FacebookButton onClickHandler={this.handleSocialNetwork} text={initialToken ? strings.compatibility : strings.signUp}/>
                                <br />
                                <div className="privacy-terms-text">
                                    <p dangerouslySetInnerHTML={{__html: strings.legalTerms}}/>
                                </div>
                                <br />
                                <br />
                            </div>
                            : ''
                        }
                    </div>
                </div>
            </div>
        );
    }
}

RegisterPage.defaultProps = {
    strings: {
        register          : 'Create account',
        cancel            : 'Cancel',
        title             : 'Nekuno analyzes your interests to offer you recommendations',
        openSource        : 'Open & free software',
        titleCorrect      : 'Awesome! You got an invitation!',
        subtitle          : 'Please copy the URL that you\'ve received your invitation and paste it into the field below to create your account at Nekuno.',
        paste             : 'Paste the invitation url here',
        correct           : 'Just one last step! Connect Facebook:',
        loadingMessage    : 'Loading',
        registeringMessage: 'Registering user',
        publishMessage    : 'We\'ll never publish anything on your wall',
        legalTerms        : 'We will never post anything on your networks.</br>By registering, you agree to the <a href="https://nekuno.com/terms-and-conditions" target="_blank">End-user license agreement</a>.',
        signUp            : 'Analyze',
        compatibility     : 'Analize compatibility',
        blockingError     : 'Your browser has blocked a Facebook request and we are not able to register you. Please, disable the blocking configuration or use an other browser.'

    }
};
