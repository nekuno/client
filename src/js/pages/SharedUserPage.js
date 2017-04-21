import React, { PropTypes, Component } from 'react';
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
import UserStore from '../stores/UserStore';

function requestData(props) {
    UserActionCreators.requestSharedUser(props.params.slug);
}

function getState(props) {
    const interfaceLanguage = LocaleStore.locale;
    const sharedUser = UserStore.getBySlug(props.params.slug);
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
        // Injected by React Router:
        params           : PropTypes.shape({
            slug: PropTypes.string.isRequired
        }).isRequired,
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
            loginUser: null,
        };
    }

    componentDidMount() {
        requestData(this.props);
        setTimeout(() => RouterActionCreators.storeRouterTransitionPath(`p/${this.props.params.slug}`), 0);
    }

    componentDidUpdate() {
        if (this.props.error){
            nekunoApp.alert(this.props.error, () => {
                const path = '/discover';
                console.log('Redirecting to path', path);
                this.context.router.replace(path);

            });
        }
    }

    loginByResourceOwner(resource, scope) {
        const {interfaceLanguage, sharedUser} = this.props;
        SocialNetworkService.login(resource, scope).then(
            () => {
                this.setState({
                    loginUser: true
                });
                const oauthData = SocialNetworkService.buildOauthData(resource);
                LoginActionCreators.loginUserByResourceOwner(oauthData).then(
                    () => {
                        return null; // User is logged in
                    },
                    (error) => {
                        // User not present. Register user.
                        let user = SocialNetworkService.getUser(resource);
                        let profile = SocialNetworkService.getProfile(resource);
                        user.enabled = true;
                        profile.interfaceLanguage = interfaceLanguage;
                        profile.orientationRequired = false;
                        let token = 'shared_user-' + sharedUser.id;
                        LoginActionCreators.register(user, profile, token, oauthData)
                            .catch(() => {
                                this.setState({
                                    registeringUser: false
                                });
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
                    {error ? <EmptyMessage text={strings.invalidUrl}/>
                        : registeringUser || loginUser ?
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