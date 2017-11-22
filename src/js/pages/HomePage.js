import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { SOCIAL_NETWORKS, SOCIAL_NETWORKS_NAMES } from '../constants/Constants';
import FacebookButton from '../components/ui/FacebookButton';
import connectToStores from '../utils/connectToStores';
import translate from '../i18n/Translate';
import LoginActionCreators from '../actions/LoginActionCreators';
import RouterActionCreators from '../actions/RouterActionCreators';
import LocalStorageService from '../services/LocalStorageService';
import SocialNetworkService from '../services/SocialNetworkService';
import LocaleStore from '../stores/LocaleStore';

let nekunoSwiper;
let delay = 2000;

function initSwiper() {
    // Init slider and store its instance in nekunoSwiper variable
    nekunoSwiper = nekunoApp.swiper('.swiper-container', {
        pagination: '.swiper-pagination',
        autoplay  : 3000
    });
}

function destroySwiper() {
    if (typeof nekunoSwiper.destroy !== 'undefined') {
        nekunoSwiper.destroy(true);
    }
}

function getState(props) {

    const interfaceLanguage = LocaleStore.locale;

    return {
        interfaceLanguage
    };
}

@translate('HomePage')
@connectToStores([LocaleStore], getState)
export default class HomePage extends Component {

    static propTypes = {
        // Injected by @translate:
        strings          : PropTypes.object,
        // Injected by @connectToStores:
        interfaceLanguage: PropTypes.string
    };

    static contextTypes = {
        router: PropTypes.object.isRequired
    };

    constructor(props) {
        super(props);

        this.loginByResourceOwner = this.loginByResourceOwner.bind(this);
        this.login = this.login.bind(this);
        this.setLoginUserState = this.setLoginUserState.bind(this);
        this.split = this.split.bind(this);

        this.promise = null;
        this.state = {
            loginUser      : false,
            registeringUser: null,
            details        : {
                title1: 0,
                title2: 0,
                title3: 0
            }
        };
        this.interval = null;
    }

    componentDidMount() {
        initSwiper();
        const facebookNetwork = SOCIAL_NETWORKS.find(socialNetwork => socialNetwork.resourceOwner == SOCIAL_NETWORKS_NAMES.FACEBOOK);
        const resource = facebookNetwork.resourceOwner;
        if (!LocalStorageService.get('jwt') && hello.getAuthResponse(resource)) {
            console.log('Attempting oauth login...');
            this.setLoginUserState(true);
            SocialNetworkService._setResourceData(resource, {authResponse: hello.getAuthResponse(resource)}).then(
                () => {
                    this.login(resource);
                },
                (status) => {
                    this.setLoginUserState(false);
                    nekunoApp.alert(resource + ' login failed: ' + status.error.message)
                }
            );
        }
        this.interval = setInterval(() => {
            const {strings} = this.props;
            const details = this.state.details;
            [1, 2, 3].map(i => {
                if (strings['title' + i + 'Details'].length > 0 && details['title' + i] + 1 === strings['title' + i + 'Details'].length) {
                    details['title' + i] = 0;
                } else {
                    details['title' + i]++;
                }
            });
            this.setState({details: details});

        }, delay);
    }

    componentWillUnmount() {
        destroySwiper();
        if (this.promise) {
            this.promise.cancel();
        }
        clearInterval(this.interval);
    }

    loginAsGuest = function() {
        LoginActionCreators.loginUser('guest', 'guest');
    };

    loginByResourceOwner(resource, scope) {

        this.setLoginUserState(true);
        SocialNetworkService.login(resource, scope).then(
            () => {
                this.login(resource);
            },
            (status) => {
                this.setLoginUserState(false);
                nekunoApp.alert(resource + ' login failed: ' + status.error.message)
            });
    }

    login(resource) {

        const {interfaceLanguage, strings} = this.props;
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
                let user = SocialNetworkService.getUser(resource);
                let profile = SocialNetworkService.getProfile(resource);
                if (!user || !profile) {
                    nekunoApp.alert(strings.blockingError);
                    this.setState({loginUser: false});
                } else {
                    profile.interfaceLanguage = interfaceLanguage;
                    profile.orientationRequired = false;
                    let token = 'join';
                    LoginActionCreators.preRegister(user, profile, token, oauthData);
                    setTimeout(() => RouterActionCreators.replaceRoute('answer-username'), 0);
                }
            });
    }

    setLoginUserState(bool) {
        this.setState({
            loginUser: bool,
        })
    }

    split(text) {
        return text.split("\n").map(function(item, key) {
            return (
                key + 1 === text.split("\n").length ? <span key={key}>{item}</span> : <span key={key}>{item}<br/></span>
            )
        });
    }

    renderSlides = function() {
        const {strings} = this.props;
        const {details} = this.state;
        return (
            [1, 2, 3].map(i => {
                    const detail = strings['title' + i + 'Details'][details['title' + i]];
                    return (
                        <div key={i} className="swiper-slide">
                            <div id={'login-' + i + '-image'} className="page">
                                <div className="linear-gradient-rectangle"></div>
                                <div className="title">
                                    {this.split(strings['title' + i].replace('%detail%', detail))}
                                </div>
                            </div>
                        </div>
                    )
                }
            )
        );
    };

    render() {
        const {strings} = this.props;
        const {loginUser} = this.state;

        return (
            <div className="views">
                <div className="view view-main home-view">
                    <div className="swiper-container swiper-init" data-speed="400" data-space-between="40" data-pagination=".swiper-pagination">
                        <div className="swiper-wrapper">
                            {this.renderSlides()}
                        </div>
                    </div>
                    <div className="nekuno-logo-wrapper">
                        <div className="nekuno-logo"></div>
                    </div>
                    <div id="page-content" className="home-content">

                    </div>
                    <div className="bottom-layer">
                        <div className="swiper-pagination-and-button">
                            <div className="swiper-pagination"></div>
                            <div>
                                <FacebookButton onClickHandler={this.loginByResourceOwner} text={strings.login} disabled={loginUser}/>
                                {/*<div className="register-text-block">*/}
                                {/*<div onClick={this.goToRegisterPage} className="register-text">*/}
                                {/*<span>{strings.hasInvitation}</span> <a href="javascript:void(0)">{strings.register}</a>*/}
                                {/*</div>*/}
                                {/*/!*Uncomment to enable login as guest*/}
                                {/*<div onClick={this.loginAsGuest} className="register-text">*/}
                                {/*<span>{strings.wantGuest}</span> <a href="javascript:void(0)">{strings.asGuest}</a>*/}
                                {/*</div>*!/*/}
                                {/*</div>*/}
                            </div>
                        </div>
                        <div className="bottom-text">
                            <div className="register-sub-title privacy-terms-text">
                                <p dangerouslySetInnerHTML={{__html: strings.legalTerms}}/>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

}

HomePage.defaultProps = {
    strings: {
        title1         : 'Add your networks and discover your %detail% partners',
        title1Details  : ['life', 'project', 'adventure'],
        title2         : 'Unlock badges to rediscover your %detail%',
        title2Details  : ['group', 'organization', 'ngo', 'school', 'institute', 'work', 'university', 'event', 'tribe', 'forum', 'channel'],
        title3         : '100% Free' + "\n" + '100% Open source',
        title3Details  : [],
        login          : 'Login with Facebook',
        hasInvitation  : 'Do you have an invitation?',
        register       : 'Register',
        loginUser      : 'Trying to login user',
        registeringUser: 'Registering user',
        wantGuest      : 'Do you want to try it?',
        asGuest        : 'Enter as guest',
        legalTerms     : 'We will never post anything on your networks.</br>By registering, you agree to the <a href="https://nekuno.com/terms-and-conditions" target="_blank">End-user license agreement</a>.',
        blockingError  : 'Your browser has blocked a Facebook request and we are not able to register you. Please, disable the blocking configuration or use an other browser.'
    }
};