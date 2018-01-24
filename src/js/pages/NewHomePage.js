import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { SOCIAL_NETWORKS, SOCIAL_NETWORKS_NAMES } from '../constants/Constants';
import ObjectivesField from '../components/registerFields/ObjectivesField';
import GroupField from '../components/registerFields/GroupField';
import OrientationField from '../components/registerFields/OrientationField';
import OrientationPopup from '../components/registerFields/OrientationPopup';
import AccessButtons from '../components/registerFields/AccessButtons';
import connectToStores from '../utils/connectToStores';
import translate from '../i18n/Translate';
import popup from '../components/Popup';
import LoginActionCreators from '../actions/LoginActionCreators';
import RouterActionCreators from '../actions/RouterActionCreators';
import LocalStorageService from '../services/LocalStorageService';
import SocialNetworkService from '../services/SocialNetworkService';
import Framework7Service from '../services/Framework7Service';
import LocaleStore from '../stores/LocaleStore';
import Slider from 'react-slick';

function getState(props) {

    const interfaceLanguage = LocaleStore.locale;

    return {
        interfaceLanguage
    };
}

@translate('HomePage')
@popup('popup-orientation')
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
        this.beforeChangeSlide = this.beforeChangeSlide.bind(this);
        this.afterChangeSlide = this.afterChangeSlide.bind(this);
        this.hideContent = this.hideContent.bind(this);
        this.goToRegisterPage = this.goToRegisterPage.bind(this);
        this.renderField = this.renderField.bind(this);

        this.promise = null;
        this.state = {
            loginUser      : false,
            registeringUser: null,
            currentSlide: 1,
            hideContent: null,
            token: null,
            slideFixed: null
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

    componentWillUnmount() {
        if (this.promise) {
            this.promise.cancel();
        }
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
                Framework7Service.nekunoApp().alert(resource + ' login failed: ' + status.error.message)
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
        this.context.router.push('/register');
    }

    openOrientationPopup() {
        Framework7Service.nekunoApp().popup('.popup-orientation');
    }

    split(text) {
        return text.split("\n").map(function(item, key) {
            return (
                key + 1 === text.split("\n").length ? <span key={key}>{item}</span> : <span key={key}>{item}<br/></span>
            )
        });
    }

    beforeChangeSlide(oldSlide, newSlide) {
        this.setState(({
            currentSlide: newSlide
        }));
    }

    afterChangeSlide(newSlide) {
        setTimeout(() => {
            const {hideContent, slideFixed} = this.state;
            if (hideContent && !slideFixed) {
                this.slider.slickPrev();
                this.setState({slideFixed: true});
            }
        }, 1000);
    }

    slickGoTo(slide) {
        this.slider.slickGoTo(slide)
    }

    renderSlides = function() {
        const {strings} = this.props;
        const {hideContent} = this.state;
        const settings = {
            accessibility: !hideContent,
            draggable: !hideContent,
            swipe: !hideContent,
            autoplaySpeed: 5000,
            className: 'swiper-wrapper',
            dots: false,
            infinite: true,
            slidesToShow: 1,
            slidesToScroll: 1,
            arrows: false,
            autoplay: false,
            //autoplay: !hideContent,
            initialSlide: 1,
            beforeChange: this.beforeChangeSlide,
            afterChange: this.afterChangeSlide
        };
        return (
            <Slider {...settings} ref={c => this.slider = c }>
                {[1, 2, 3].map(i => {
                        return (
                            <div key={i} className="swiper-slide">
                                <div id={'login-' + i + '-image'} className="page">
                                    <div className="bottom-background-rectangle"></div>
                                    <div className={hideContent ? "vertical-hidden-content title" : "title"}>
                                        {this.split(strings['title' + i])}
                                    </div>
                                    {this.renderField(i)}
                                </div>
                            </div>
                        )
                    }
                )}
            </Slider>
        );
    };

    renderField(index) {
        const {currentSlide, registeringUser} = this.state;

        if (!registeringUser) {
            return <AccessButtons onLoginClick={this.loginByResourceOwner} onRegisterClick={() => this.setState({'registeringUser': true})}/>;
        }

        switch (index) {
            case 1:
                return <GroupField onValidInvitation={this.hideContent} activeSlide={currentSlide === 0}/>;
                //return <GroupField onValidInvitation={this.hideContent} activeSlide={currentSlide === 0} onChangeField={() => this.slider.slickPause()}/>;
            case 2:
                return <ObjectivesField onClickField={this.hideContent} onSaveHandler={this.goToRegisterPage}/>;
            case 3:
                return <OrientationField onOtherClickHandler={this.openOrientationPopup} onSaveHandler={this.goToRegisterPage}/>;
            default:
        }
    };

    hideContent() {
        this.setState({hideContent: true});
    }

    render() {
        const {strings} = this.props;
        const {loginUser, currentSlide, hideContent} = this.state;

        return (
            <div className="views">
                <div className="view view-main home-view">
                    <div className="swiper-container">
                        {this.renderSlides()}
                    </div>
                    <div className="nekuno-logo-wrapper">
                        <div className="nekuno-logo"></div>
                    </div>
                    <div id="page-content" className="home-content">

                    </div>
                    <div className={hideContent ? "vertical-hidden-content bottom-layer" : "bottom-layer"}>
                        <div className="swiper-pagination-and-button">
                            <div className="title">{strings.choosePath}</div>
                            <div className="slider-buttons">
                                <div className="slider-button" onClick={this.slickGoTo.bind(this, 0)}>
                                    <span className={currentSlide === 0 ? "icon-calendar-check" : "icon-calendar-check2"}/>
                                    <div className={currentSlide === 0 ? "slider-button-text active" : "slider-button-text"}>{strings.events}</div>
                                </div>
                                <div className="slider-button" onClick={this.slickGoTo.bind(this, 1)}>
                                    <span className={currentSlide === 1 ? "icon-compass2" : "icon-compass3"}/>
                                    <div className={currentSlide === 1 ? "slider-button-text active" : "slider-button-text"}>{strings.explore}</div>
                                </div>
                                <div className="slider-button" onClick={this.slickGoTo.bind(this, 2)}>
                                    <span className={currentSlide === 2 ? "icon-heart2" : "icon-heart3"}/>
                                    <div className={currentSlide === 2 ? "slider-button-text active" : "slider-button-text"}>{strings.contact}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <OrientationPopup profile={{}} onContinue={this.goToRegisterPage}/>
            </div>
        );
    }

}

HomePage.defaultProps = {
    strings: {
        choosePath     : 'Choose your path',
        title1         : 'Rediscover my tribe' + "\n" + 'unlocking badges',
        title2         : 'Share what I love' + "\n" + 'joining and creating proposals',
        title3         : 'All previous + discover' + "\n" + 'my life mates',
        events         : 'Events',
        explore        : 'Explore',
        contact        : 'Contact',
        login          : 'Login',
        hasInvitation  : 'Do you have an invitation?',
        register       : 'Register',
        loginUser      : 'Trying to login user',
        registeringUser: 'Registering user',
        wantGuest      : 'Do you want to try it?',
        asGuest        : 'Enter as guest',
        blockingError  : 'Your browser has blocked a Facebook request and we are not able to register you. Please, disable the blocking configuration or use an other browser.',
        cannotLogin    : 'No user registered with this Facebook account'
    }
};