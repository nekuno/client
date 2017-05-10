import React, { PropTypes, Component } from 'react';
import { SOCIAL_NETWORKS, SOCIAL_NETWORKS_NAMES } from '../constants/Constants';
import selectn from 'selectn';
import FacebookButton from '../components/ui/FacebookButton';
import EmptyMessage from '../components/ui/EmptyMessage';
import connectToStores from '../utils/connectToStores';
import translate from '../i18n/Translate';
import LoginActionCreators from '../actions/LoginActionCreators';
import SocialNetworkService from '../services/SocialNetworkService';
import LocaleStore from '../stores/LocaleStore';

let nekunoSwiper;

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

        this.goToRegisterPage = this.goToRegisterPage.bind(this);
        this.loginByResourceOwner = this.loginByResourceOwner.bind(this);
        this.split = this.split.bind(this);

        this.promise = null;
        this.state = {
            loginUser      : selectn('location.query.autoLogin', props),
            registeringUser: null,
        };
    }

    componentDidMount() {
        initSwiper();
        if (this.state.loginUser) {
            const facebookNetwork = SOCIAL_NETWORKS.find(socialNetwork => socialNetwork.resourceOwner == SOCIAL_NETWORKS_NAMES.FACEBOOK);
            const resource = facebookNetwork.resourceOwner;
            const scope = facebookNetwork.scope;
            this.loginByResourceOwner(resource, scope);
        }
    }

    componentWillUnmount() {
        destroySwiper();
        if (this.promise) {
            this.promise.cancel();
        }
    }

    loginAsGuest = function() {
        LoginActionCreators.loginUser('guest', 'guest');
    };

    goToRegisterPage = function() {
        this.context.router.push('/register');
    };

    loginByResourceOwner(resource, scope) {
        const {interfaceLanguage} = this.props;
        SocialNetworkService.login(resource, scope).then(
            () => {
                const oauthData = SocialNetworkService.buildOauthData(resource);
                LoginActionCreators.loginUserByResourceOwner(oauthData).then(
                    () => {
                        return null; // User is logged in
                    },
                    (error) => {
                        // User not present. Register user.
                        let user = SocialNetworkService.getUser(resource);
                        let profile = SocialNetworkService.getProfile(resource);
                        profile.interfaceLanguage = interfaceLanguage;
                        profile.orientationRequired = false;
                        let token = 'join';
                        LoginActionCreators.preRegister(user, profile, token, oauthData);
                        setTimeout(() => this.context.router.push('answer-username'), 0);
                    });
            },
            (status) => {
                this.setState({
                    loginUser: false
                });
                nekunoApp.alert(resource + ' login failed: ' + status.error.message)
            });
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
        return (
            [1, 2, 3].map(i =>
                <div key={i} className="swiper-slide">
                    <div id={'login-' + i + '-image'} className="page">
                        <div className="title">
                            {this.split(strings['title' + i])}
                        </div>
                    </div>
                </div>
            )
        );
    };

    render() {
        const {strings} = this.props;
        const {loginUser, registeringUser} = this.state;

        return (
            <div className="views">
                {registeringUser || loginUser ?
                    <div className="view view-main home-view">
                        <EmptyMessage text={registeringUser ? strings.registeringUser : strings.loginUser} loadingGif={true}/>
                    </div>
                    :
                    <div className="view view-main home-view">
                        <div className="swiper-container swiper-init" data-speed="400" data-space-between="40" data-pagination=".swiper-pagination">
                            <div className="linear-gradient-rectangle"></div>

                            <div className="swiper-wrapper">
                                {this.renderSlides()}
                            </div>
                        </div>
                        <div className="nekuno-logo-wrapper">
                            <div className="nekuno-logo"></div>
                        </div>
                        <div id="page-content" className="home-content">

                        </div>
                        <div className="swiper-pagination-and-button">
                            <div className="swiper-pagination"></div>
                            <div>
                                <FacebookButton onClickHandler={this.loginByResourceOwner} text={strings.login}/>
                                <div className="register-sub-title privacy-terms-text">
                                    <p dangerouslySetInnerHTML={{__html: strings.privacy}}/>
                                </div>
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
                    </div>
                }
            </div>
        );
    }

}

HomePage.defaultProps = {
    strings: {
        title1         : 'Add your networks and discover',
        title1Details  : ['your life partners', 'projects', 'adventure'],
        title2         : 'Unlock badges to rediscover your',
        title2Details  : ['group', 'organization', 'ngo', 'school', 'institute', 'work', 'university', 'event', 'tribe', 'forum', 'channel'],
        title3         : '100% Free' + "\n" + '100% Open source' + "\n" + 'You decide the information you share',
        title3Details  : [],
        login          : 'Login with Facebook',
        hasInvitation  : 'Do you have an invitation?',
        register       : 'Register',
        loginUser      : 'Trying to login user',
        registeringUser: 'Registering user',
        wantGuest      : 'Do you want to try it?',
        asGuest        : 'Enter as guest',
        privacy        : 'By registering, you agree to the <a href="https://nekuno.com/legal-notice" target="_blank">Legal Conditions</a> and the Nekuno <a href="https://nekuno.com/privacy-policy" target="_blank">Privacy Policy</a>.'
    }
};