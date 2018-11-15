import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { SOCIAL_NETWORKS_NAMES, FACEBOOK_SCOPE } from '../constants/Constants';
import connectToStores from '../utils/connectToStores';
import translate from '../i18n/Translate';
import LoginActionCreators from '../actions/LoginActionCreators';
import SocialNetworkService from '../services/SocialNetworkService';
import LocaleStore from '../stores/LocaleStore';
import RegisterStore from '../stores/RegisterStore';
import Button from '../components/ui/Button/Button.js';
import Overlay from '../components/ui/Overlay/Overlay.js';
import TopNavBar from '../components/TopNavBar/TopNavBar.js';
import '../../scss/pages/connect-facebook.scss';

function getState() {
    const interfaceLanguage = LocaleStore.locale;
    const user = RegisterStore.user;
    const username = user && user.username ? user.username : null;
    const profile = RegisterStore.profile;

    return {
        interfaceLanguage,
        username,
        profile
    };
}

@translate('ConnectFacebookPage')
@connectToStores([LocaleStore, RegisterStore], getState)
export default class ConnectFacebookPage extends Component {

    static propTypes = {
        // Injected by @translate:
        strings          : PropTypes.object,
        // Injected by @connectToStores:
        interfaceLanguage: PropTypes.string,
        username         : PropTypes.string,
        profile          : PropTypes.object,
    };

    static contextTypes = {
        router: PropTypes.object.isRequired
    };

    constructor(props) {
        super(props);

        this.connectFacebook = this.connectFacebook.bind(this);

        this.state = {
            registering: false
        }
    }

    componentDidMount() {
        if (!this.props.username) {
            this.context.router.push('/answer-username');
        }
    }

    connectFacebook() {
        const {interfaceLanguage, strings} = this.props;
        let {username, profile, token} = this.props;
        const resource = 'facebook';
        token = token || 'join';
        this.setState({registering: true});
        SocialNetworkService.login(SOCIAL_NETWORKS_NAMES.FACEBOOK, FACEBOOK_SCOPE).then(() => {
            const oauthData = SocialNetworkService.buildOauthData(resource);
            LoginActionCreators.loginUserByResourceOwner(
                resource,
                SocialNetworkService.getAccessToken(resource),
                SocialNetworkService.getRefreshToken(resource)
            ).then(
                () => {
                    return null; // User is logged in
                },
                (error) => {
                    // User not present. Register user.
                    const userFromNetwork = SocialNetworkService.getUser(resource);
                    const profileFromNetwork = SocialNetworkService.getProfile(resource);
                    if (!oauthData || !userFromNetwork || !profileFromNetwork) {
                        alert(strings.blockingError);
                    } else {
                        const user = {...userFromNetwork, username: username};
                        profile = {...profileFromNetwork, ...profile};
                        profile.interfaceLanguage = interfaceLanguage;
                        profile.orientationRequired = false;

                        LoginActionCreators.register(user, profile, token, oauthData).then(() => {
                            setTimeout(() => {
                                this.context.router.push('/connecting-facebook')
                            }, 0);
                        }).catch(error => {
                            console.log(error);
                            alert(error);
                        });
                    }
                });
        }, (status) => {
            this.setState({registering: false});
            alert(resource + ' login failed: ' + status.error.message)
        });
    }

    render() {
        const {strings} = this.props;
        const {registering} = this.state;

        return (
            <div className="views">
                <div className="view view-main connect-facebook-view">
                    <TopNavBar background={'transparent'} color={'white'} iconLeft={'arrow-left'} textCenter={strings.yourAccount} position={'absolute'} textSize={'small'}/>
                    <div className="connect-facebook-wrapper">
                        <Overlay/>
                        <div className="image-wrapper">
                            <img src="/img/proposals/Facebook.png"/>
                        </div>
                        <h1>{strings.title}</h1>
                        <div className="resume">{strings.description}</div>
                        <Button onClickHandler={this.connectFacebook} disabled={registering}>{strings.connect}</Button>
                    </div>
                </div>
            </div>
        );
    }

}

ConnectFacebookPage.defaultProps = {
    strings: {
        yourAccount: 'Your account at Nekuno',
        title      : 'We are almost done! Connect Facebook',
        description: 'We need to obtain information about the kind of contents you like for recommending you compatible people',
        connect    : 'Connect with Facebook',
    }
};