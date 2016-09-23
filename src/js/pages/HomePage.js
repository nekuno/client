import React, { PropTypes, Component } from 'react';
import FullWidthButton from '../components/ui/FullWidthButton';
import FacebookButton from '../components/ui/FacebookButton';
import moment from 'moment';
import 'moment/locale/es';
import { LAST_RELEASE_DATE } from '../constants/Constants';
import { getVersion } from '../utils/APIUtils';
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
    nekunoSwiper.destroy(true);
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
        history: PropTypes.object.isRequired
    };

    constructor(props) {
        super(props);

        this.goToRegisterPage = this.goToRegisterPage.bind(this);
        this.loginByResourceOwner = this.loginByResourceOwner.bind(this);

        this.promise = null;
        this.state = {
            needsUpdating: false
        };
    }

    componentDidMount() {
        initSwiper();
        this.promise = getVersion().then((response) => {
            var lastVersion = moment(response, 'DD [de] MMMM [de] YYYY');
            var thisVersion = moment(LAST_RELEASE_DATE, 'DD [de] MMMM [de] YYYY');
            this.setState({needsUpdating: lastVersion > thisVersion});
        });
    }

    componentWillUnmount() {
        destroySwiper();
        this.promise.cancel();
    }

    loginAsGuest = function() {
        LoginActionCreators.loginUser('guest', 'guest');
    };

    goToRegisterPage = function() {
        this.context.history.pushState(null, '/register');
    };

    loginByResourceOwner(resource, scope) {
        const {interfaceLanguage} = this.props;
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

                        nekunoApp.alert(error.error);
                        // this.context.history.pushState(null, '/login');
                    });
            },
            (status) => {
                nekunoApp.alert(resource + ' login failed: ' + status.error.message)
            });
    }

    renderSlides = function() {
        const {strings} = this.props;
        return (
            [1, 2, 3].map(i =>
                <div key={i} className="swiper-slide">
                    <div id={'login-' + i + '-image'} className="page">
                        <div className="title">
                            {i === 1 ? strings.title1 : i === 2 ? strings.title2 : strings.title3}
                        </div>
                    </div>
                </div>
            )
        );
    };

    render() {
        const {strings} = this.props;

        return (
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
                    { this.state.needsUpdating ?
                        <FullWidthButton onClick={() => window.location = 'https://play.google.com/store/apps/details?id=com.nekuno'}>
                            {strings.update}
                        </FullWidthButton>
                        :
                        <div>
                            <FacebookButton onClickHandler={this.loginByResourceOwner} text={strings.login}/>
                            <div className="register-text-block">
                                <div onClick={this.goToRegisterPage} className="register-text">
                                    <span>{strings.hasInvitation}</span> <a href="javascript:void(0)">{strings.register}</a>
                                </div>
                                {/*Uncomment to enable login as guest
                                 <div onClick={this.loginAsGuest} className="register-text">
                                 <span>{strings.wantGuest}</span> <a href="javascript:void(0)">{strings.asGuest}</a>
                                 </div>*/}
                            </div>
                        </div>
                    }
                </div>
            </div>
        );
    }

}

HomePage.defaultProps = {
    strings: {
        title1       : 'Discover contents of the topics that interest you',
        title2       : 'Connect only with most compatible people with you',
        title3       : 'You decide the information you share',
        update       : 'Update',
        login        : 'Login with Facebook',
        hasInvitation: 'Do you have an invitation?',
        register     : 'Register',
        wantGuest    : 'Do you want to try it?',
        asGuest      : 'Enter as guest'
    }
};