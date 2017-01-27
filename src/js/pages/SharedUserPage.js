import React, { PropTypes, Component } from 'react';
import { SOCIAL_NETWORKS, SOCIAL_NETWORKS_NAMES } from '../constants/Constants';
import FacebookButton from '../components/ui/FacebookButton';
import EmptyMessage from '../components/ui/EmptyMessage';
import Image from '../components/ui/Image';
import connectToStores from '../utils/connectToStores';
import translate from '../i18n/Translate';
import LoginActionCreators from '../actions/LoginActionCreators';
import RouterActionCreators from '../actions/RouterActionCreators';
import * as UserActionCreators from '../actions/UserActionCreators';
import SocialNetworkService from '../services/SocialNetworkService';
import LocaleStore from '../stores/LocaleStore';
import LoginStore from '../stores/LoginStore';
import UserStore from '../stores/UserStore';

function requestData(props) {
    UserActionCreators.requestSharedUser(parseInt(props.params.id));
}

function getState(props) {
    const interfaceLanguage = LocaleStore.locale;
    const sharedUser = UserStore.get(parseInt(props.params.id));
    const error = UserStore.getError();

    return {
        interfaceLanguage,
        sharedUser,
        error
    };
}

@translate('SharedUserPage')
@connectToStores([LocaleStore, UserStore], getState)
export default class SharedUserPage extends Component {

    static propTypes = {
        // Injected by @translate:
        strings          : PropTypes.object,
        // Injected by @connectToStores:
        interfaceLanguage: PropTypes.string,
        error            : PropTypes.string
    };

    static contextTypes = {
        router: PropTypes.object.isRequired
    };

    constructor(props) {
        super(props);

        this.loginByResourceOwner = this.loginByResourceOwner.bind(this);

        this.state = {
            registeringUser: null,
            loginUser: true,
        };
    }

    componentDidMount() {
        const {params} = this.props;
        if (LoginStore.isLoggedIn()) {
            this.context.router.push(`profile/${params.id}`);
        } else {
            const facebookNetwork = SOCIAL_NETWORKS.find(socialNetwork => socialNetwork.resourceOwner == SOCIAL_NETWORKS_NAMES.FACEBOOK);
            const resource = facebookNetwork.resourceOwner;
            const scope = facebookNetwork.scope;
            RouterActionCreators.storeRouterTransitionPath(`profile/${params.id}`);
            SocialNetworkService.login(resource, scope).then(
                () => {
                    LoginActionCreators.loginUserByResourceOwner(resource, SocialNetworkService.getAccessToken(resource)).then(
                        () => {
                            // User has logged in
                        },
                        (error) => {
                            // User not present.
                            this.setState({
                                loginUser: false
                            });
                            requestData(this.props);
                        });
                },
                (error) => {
                    this.setState({
                        loginUser: false
                    });
                    requestData(this.props);
                }
            );
        }
    }

    loginByResourceOwner(resource, scope) {
        const {interfaceLanguage, params} = this.props;
        SocialNetworkService.login(resource, scope).then(
            () => {
                LoginActionCreators.loginUserByResourceOwner(resource, SocialNetworkService.getAccessToken(resource)).then(
                    () => {
                        return null; // User is logged in
                    },
                    (error) => {
                        // User not present. Register user.
                        let user = SocialNetworkService.getUser(resource);
                        let profile = SocialNetworkService.getProfile(resource);
                        user[resource + 'ID'] = SocialNetworkService.getResourceId(resource);
                        user.enabled = true;
                        profile.interfaceLanguage = interfaceLanguage;
                        profile.orientationRequired = false;
                        let token = 'shared_user-' + params.id;
                        LoginActionCreators.register(user, profile, token, {
                            resourceOwner: resource,
                            oauthToken   : SocialNetworkService.getAccessToken(resource),
                            resourceId   : SocialNetworkService.getResourceId(resource),
                            expireTime   : SocialNetworkService.getExpireTime(resource),
                            refreshToken : SocialNetworkService.getRefreshToken(resource)
                        });

                        this.setState({
                            registeringUser: true
                        });
                    });
            },
            (status) => {
                this.setState({
                    loginUser: false
                });
                nekunoApp.alert(resource + ' login failed: ' + status.error.message)
            });
    }

    render() {
        const {sharedUser, error, strings} = this.props;
        const {loginUser, registeringUser} = this.state;

        return (
            <div className="views">
                <div className="view view-main">
                    {registeringUser || loginUser ?
                        <EmptyMessage text={registeringUser ? strings.registeringUser : strings.loginUser} loadingGif={true}/>
                        : sharedUser && sharedUser.username && sharedUser.photo.thumbnail ?
                            <div id="page-content" className="shared-user-content">
                                <div className="shared-user-picture">
                                    <Image src={sharedUser.photo.thumbnail.medium}/>
                                </div>
                                <div className="title">{strings.title.replace('%username%', sharedUser.username)}</div>
                                <FacebookButton onClickHandler={this.loginByResourceOwner} text={strings.signUp}/>
                                <div className="register-sub-title privacy-terms-text">
                                    <p dangerouslySetInnerHTML={{__html: strings.privacy}}/>
                                </div>
                            </div>
                            : error ? <EmptyMessage text={strings.invalidUrl}/>
                                    : <EmptyMessage text={strings.loadingProfile} loadingGif={true}/>
                    }
                </div>
            </div>
        );
    }
}

SharedUserPage.defaultProps = {
    strings: {
        title          : 'Do you want to see your compatibility with %username%?',
        signUp         : 'Sign up with Facebook',
        loginUser      : 'Trying to login user',
        registeringUser: 'Registering user',
        loadingProfile : 'Loading profile',
        invalidUrl     : 'Invalid URL',
        privacy        : 'By registering, you agree to the <a href="https://nekuno.com/legal-notice" target="_blank">Legal Conditions</a> and the Nekuno <a href="https://nekuno.com/privacy-policy" target="_blank">Privacy Policy</a>.'
    }
};