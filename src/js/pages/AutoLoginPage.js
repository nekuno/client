import React, { PropTypes, Component } from 'react';
import { SOCIAL_NETWORKS, SOCIAL_NETWORKS_NAMES } from '../constants/Constants';
import TopNavBar from '../components/ui/TopNavBar';
import EmptyMessage from '../components/ui/EmptyMessage';
import connectToStores from '../utils/connectToStores';
import translate from '../i18n/Translate';
import LoginActionCreators from '../actions/LoginActionCreators';
import SocialNetworkService from '../services/SocialNetworkService';
import LocaleStore from '../stores/LocaleStore';

function getState(props) {
    const interfaceLanguage = LocaleStore.locale;

    return {
        interfaceLanguage
    };
}

@translate('AutoLoginPage')
@connectToStores([LocaleStore], getState)
export default class AutoLoginPage extends Component {

    static propTypes = {
        // Injected by @connectToStores:
        interfaceLanguage: PropTypes.string,
        // Injected by @translate:
        strings: PropTypes.object
    };

    static contextTypes = {
        history: PropTypes.object.isRequired
    };

    constructor() {
        super();

        this.goHome = this.goHome.bind(this);

        this.state = {
            registeringUser: null
        };
    }

    componentDidMount() {
        const {interfaceLanguage} = this.props;
        const facebookNetwork = SOCIAL_NETWORKS.find(socialNetwork => socialNetwork.resourceOwner == SOCIAL_NETWORKS_NAMES.FACEBOOK);
        const resource = facebookNetwork.resourceOwner;
        const scope = facebookNetwork.scope;
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
                        let token = 'join';
                        LoginActionCreators.register(user, profile, token, {
                            resourceOwner: resource,
                            oauthToken   : SocialNetworkService.getAccessToken(resource),
                            resourceId   : SocialNetworkService.getResourceId(resource),
                            expireTime   : SocialNetworkService.getExpireTime(resource),
                            refreshToken : SocialNetworkService.getRefreshToken(resource)
                        });

                        console.log(error);
                        this.setState({
                            registeringUser: true
                        });
                    });
            },
            (status) => {
                nekunoApp.alert(resource + ' login failed: ' + status.error.message);
                this.goHome();
            });
    }

    goHome() {
        this.context.history.pushState(null, '/');
    }

    render() {
        const {strings} = this.props;
        const {registeringUser} = this.state;
        return (
            <div className="view view-main">
                <TopNavBar centerText={'Nekuno'}/>
                <div className="page">
                    <div id="page-content">
                        <EmptyMessage text={registeringUser ? strings.registeringUser : strings.loginUser} loadingGif={true}/>
                    </div>
                </div>
            </div>
        );
    }
}

AutoLoginPage.defaultProps = {
    strings: {
        loginUser      : 'Trying to login user',
        registeringUser: 'Registering user',
    }
};