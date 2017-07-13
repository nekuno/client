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
import LoginActionCreators from '../actions/LoginActionCreators';
import InvitationStore from '../stores/InvitationStore';
import LocaleStore from '../stores/LocaleStore';
import SocialNetworkService from '../services/SocialNetworkService';
import GeocoderService from '../services/GeocoderService';

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
        strings          : PropTypes.object,
        // Injected by @connectToStores:
        error            : PropTypes.object,
        token            : PropTypes.string,
        invitation       : PropTypes.object,
        interfaceLanguage: PropTypes.string
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
        const {token, invitation, interfaceLanguage} = this.props;
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
                    profile.interfaceLanguage = interfaceLanguage;
                    profile.orientationRequired = false;
                    if (!profile.location && navigator.geolocation) {
                        var options = {
                            enableHighAccuracy: true,
                            timeout           : 5000, // 5s
                            maximumAge        : 14400000 // 4h
                        };
                        navigator.geolocation.getCurrentPosition((position) => {
                            if (position.coords.accuracy < 2000) { // filter by accuracy
                                GeocoderService.getLocationFromCoords(position.coords.latitude, position.coords.longitude).then(
                                    (location) => {
                                        profile.location = location;
                                        this._registerUser(user, profile, token, oauthData);
                                    },
                                    () => { // Register user without location
                                        this._registerUser(user, profile, token, oauthData);
                                    }
                                )
                            } else {
                                this._registerUser(user, profile, token, oauthData);
                            }
                        }, () => {
                            this._registerUser(user, profile, token, oauthData)
                        }, options);
                    } else {
                        this._registerUser(user, profile, token, oauthData);
                    }
                });
        }, (status) => {
            nekunoApp.alert(resource + ' login failed: ' + status.error.message)
        });
    }

    _registerUser(user, profile, token, oauthData) {
        LoginActionCreators.register(user, profile, token, oauthData);

        this.setState({
            registeringUser: true
        });
    }

    render() {

        const {error, token, invitation, strings} = this.props;

        let initialToken = this.state.initialToken;

        return (
            <div className="views">
                <TopNavBar leftText={strings.cancel} centerText={strings.register}/>
                <div className="view view-main">
                    <div className="page" style={invitation && invitation.image_url ? {background: 'url("' + invitation.image_url + '") no-repeat center top', minHeight: '100%'} : null}>
                        {invitation && invitation.image_url ? <div className="gradient-transparency"></div> : null}

                        {this.state.registeringUser ?
                            <EmptyMessage text={strings.loadingMessage} loadingGif={true}/>
                            :
                            <div id="page-content" className="register-content">
                                <div className="register-title bold">
                                    <div className="title">{token ? (invitation.slogan ? invitation.slogan : strings.titleCorrect) : strings.title}</div>
                                </div>
                                <div className="register-sub-title">{ token ? (invitation.htmlText ? invitation.htmlText : strings.correct) : strings.subtitle}</div>
                                { token ? <div className="register-sub-title"><strong>{strings.publishMessage}</strong></div> : null}
                                <br />
                                { token ? '' :
                                    <div className="list-block">
                                        <ul>
                                            <Input ref="token" defaultValue={initialToken} onChange={this.handleOnChange} placeholder={strings.paste}/>
                                        </ul>
                                    </div>
                                }
                                <div style={{color: '#FFF'}}>
                                    <p>{ error ? error.error : ''}</p>
                                </div>

                                { token ?
                                    <div>
                                        {/* Uncomment to enable all social networks */}
                                        {/* <SocialBox onClickHandler={this.handleSocialNetwork}/> */}
                                        <FacebookButton onClickHandler={this.handleSocialNetwork} text={strings.signUp}/>
                                        <br />
                                        <div className="register-sub-title privacy-terms-text">
                                            <p dangerouslySetInnerHTML={{__html: strings.privacy}}/>
                                        </div>
                                        <br />
                                        <br />
                                    </div>
                                    : ''
                                }
                            </div>
                        }
                    </div>
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
        correct       : 'Just one last step! Connect Facebook:',
        loadingMessage: 'Registering user',
        publishMessage: 'We\'ll never publish anything on your wall',
        privacy       : 'By registering, you agree to the <a href="https://nekuno.com/terms-and-conditions" target="_blank">Legal Conditions</a> and the Nekuno <a href="https://nekuno.com/privacy-policy" target="_blank">Privacy Policy</a>.',
        signUp        : 'Sign up with Facebook'
    }
};
