import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { SOCIAL_NETWORKS, SOCIAL_NETWORKS_NAMES } from '../constants/Constants';
import connectToStores from '../utils/connectToStores';
import translate from '../i18n/Translate';
import LoginActionCreators from '../actions/LoginActionCreators';
import LocalStorageService from '../services/LocalStorageService';
import SocialNetworkService from '../services/SocialNetworkService';
import Framework7Service from '../services/Framework7Service';
import LocaleStore from '../stores/LocaleStore';
import Slider from 'react-slick';
import Overlay from '../components/ui/Overlay/Overlay.js';
import '../../scss/pages/home.scss';

function getState(props) {
    const interfaceLanguage = LocaleStore.locale;

    return {
        interfaceLanguage,
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

        this.login = this.login.bind(this);
        this.setLoginUserState = this.setLoginUserState.bind(this);
        this.beforeChangeSlide = this.beforeChangeSlide.bind(this);
        this.afterChangeSlide = this.afterChangeSlide.bind(this);
        this.slickNext = this.slickNext.bind(this);
        this.goToRegisterPage = this.goToRegisterPage.bind(this);

        this.state = {
            loginUser: false,
            currentSlide: 0
        };
    }

    componentDidMount() {
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
                    Framework7Service.nekunoApp().alert(resource + ' login failed: ' + status.error.message)
                }
            );
        }
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
                    Framework7Service.nekunoApp().alert(strings.blockingError);
                    this.setState({loginUser: false});
                } else {
                    profile.interfaceLanguage = interfaceLanguage;
                    profile.orientationRequired = false;
                    let token = 'join';
                    LoginActionCreators.preRegister(user, profile, token, oauthData);
                    this.setState({'registeringUser': true});
                }
            });
    }

    setLoginUserState(bool) {
        this.setState({
            loginUser: bool,
        })
    }

    goToRegisterPage() {
        this.context.router.push('/answer-username');
    }

    beforeChangeSlide(oldSlide, newSlide) {

    }

    afterChangeSlide(newSlide) {
        this.setState(({
            currentSlide: newSlide
        }));
    }

    skip() {
        this.goToRegisterPage();
    }

    slickNext() {
        if (this.state.currentSlide === 2) {
            this.goToRegisterPage();
        } else {
            this.slider.slickNext();
        }
    }

    renderSlides = function() {
        const {strings} = this.props;
        const settings = {
            accessibility: false,
            draggable: false,
            swipe: false,
            fade: true,
            className: 'swiper-wrapper',
            dots: true,
            infinite: false,
            slidesToShow: 1,
            slidesToScroll: 1,
            arrows: false,
            autoplay: false,
            initialSlide: 0,
            beforeChange: this.beforeChangeSlide,
            afterChange: this.afterChangeSlide,
            customPaging: (i) => <div className={"dot dot-" + i}/>,
        };
        const images = [
            '/img/proposals/ConocerGente.png',
            '/img/proposals/Publica.png',
            '/img/proposals/Propuestas.png',
        ];

        return (
            <Slider {...settings} ref={c => this.slider = c }>
                {[1, 2, 3].map(i => {
                        return (
                            <div key={i} className="swiper-slide" onClick={this.slickNext.bind(this)}>
                                <div className="login-image">
                                    <img src={images[i - 1]} />
                                </div>
                                <h1>{strings['title' + i]}</h1>
                                <h3>{strings['resume' + i]}</h3>
                            </div>
                        )
                    }
                )}
            </Slider>
        );
    };

    render() {
        const {strings} = this.props;

        return (
            <div className="views">
                <div className="view view-main home-view">
                    <Overlay/>
                    <div className="home-wrapper">
                        <div className="nekuno-logo-wrapper">
                            <div className="nekuno-logo"/>
                        </div>
                        <div className="swiper-container">
                            {this.renderSlides()}
                        </div>
                        <div className="skip-wrapper small" onClick={this.goToRegisterPage}>
                            <span className="skip-text">{strings.skip}&nbsp;</span>
                            <span className="icon-arrow-right" />
                        </div>
                    </div>
                </div>
            </div>
        );
    }

}

HomePage.defaultProps = {
    strings: {
        title1         : 'Meet people related to you',
        title2         : 'Share your ideas and plans',
        title3         : 'Take part in projects and plans',
        resume1        : 'Nekuno makes it easy to find people compatible with you',
        resume2        : 'Meet people compatible with you for carrying out projects and plans',
        resume3        : 'Discover projects and plans that matches your profile',
        skip           : 'Skip',
        blockingError  : 'Your browser has blocked a Facebook request and we are not able to register you. Please, disable the blocking configuration or use an other browser.'
    }
};