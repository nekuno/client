import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { SOCIAL_NETWORKS, SOCIAL_NETWORKS_NAMES } from '../constants/Constants';
import ExploreField from '../components/registerFields/ExploreField';
import GroupField from '../components/registerFields/GroupField';
import OrientationField from '../components/registerFields/OrientationField';
import OrientationPopup from '../components/registerFields/OrientationPopup';
import DetailPopup from '../components/registerFields/DetailPopup';
import AccessButtons from '../components/registerFields/AccessButtons';
import connectToStores from '../utils/connectToStores';
import translate from '../i18n/Translate';
import popup from '../components/Popup';
import LoginActionCreators from '../actions/LoginActionCreators';
import LocalStorageService from '../services/LocalStorageService';
import SocialNetworkService from '../services/SocialNetworkService';
import Framework7Service from '../services/Framework7Service';
import LocaleStore from '../stores/LocaleStore';
import RegisterStore from '../stores/RegisterStore';
import Slider from 'react-slick';

function getState(props) {

    const interfaceLanguage = LocaleStore.locale;
    const profile = RegisterStore.profile || {};
    const hasToken = RegisterStore.hasToken();

    return {
        interfaceLanguage,
        profile,
        hasToken
    };
}

@translate('HomePage')
@popup(['popup-orientation', 'popup-detail'])
@connectToStores([LocaleStore, RegisterStore], getState)
export default class HomePage extends Component {

    static propTypes = {
        // Injected by @translate:
        strings          : PropTypes.object,
        // Injected by @connectToStores:
        interfaceLanguage: PropTypes.string,
        profile          : PropTypes.object,
        hasToken         : PropTypes.bool,
        // Injected by @popup:
        showPopup        : PropTypes.func,
        closePopup       : PropTypes.func,
        popupContentRef  : PropTypes.func,
        opened           : PropTypes.bool,
    };

    static contextTypes = {
        router: PropTypes.object.isRequired
    };

    constructor(props) {
        super(props);

        this.onRegisterClick = this.onRegisterClick.bind(this);
        this.loginByResourceOwner = this.loginByResourceOwner.bind(this);
        this.login = this.login.bind(this);
        this.preRegisterProfile = this.preRegisterProfile.bind(this);
        this.setLoginUserState = this.setLoginUserState.bind(this);
        this.split = this.split.bind(this);
        this.beforeChangeSlide = this.beforeChangeSlide.bind(this);
        this.afterChangeSlide = this.afterChangeSlide.bind(this);
        this.hideContent = this.hideContent.bind(this);
        this.showContent = this.showContent.bind(this);
        this.setDetail = this.setDetail.bind(this);
        this.goToRegisterPage = this.goToRegisterPage.bind(this);
        this.openOrientationPopup = this.openOrientationPopup.bind(this);
        this.onCancelDetailPopup = this.onCancelDetailPopup.bind(this);
        this.onCancelOrientationPopup = this.onCancelOrientationPopup.bind(this);
        this.renderField = this.renderField.bind(this);

        this.promise = null;
        this.state = {
            loginUser      : false,
            registeringUser: null,
            currentSlide: 1,
            hideContent: null,
            token: null,
            slideFixed: null,
            detail: null
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

        if (this.context.router.location.hash && this.context.router.location.hash === '#signup') {
            this.setState({registeringUser: true});
        }
    }

    componentDidUpdate(prevProps, prevState) {
        const {detail, registeringUser} = this.state;
        const {opened} = this.props;

        if (detail && !opened && prevProps.opened) {
            this.setDetail(null);
        } else if (detail && detail !== prevState.detail) {
            this.props.showPopup('popup-detail');
        } else if (registeringUser && !this.context.router.location.hash) {
            this.setState({
                registeringUser: false,
                hideContent: null,
                detail: null,
            });
        }
    }

    componentWillUnmount() {
        if (this.promise) {
            this.promise.cancel();
        }
    }

    onRegisterClick() {
        this.setState({'registeringUser': true});
        this.context.router.push(this.context.router.location.pathname + '#signup');
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

    preRegisterProfile(profile) {
        LoginActionCreators.preRegisterProfile(profile);
    }

    setLoginUserState(bool) {
        this.setState({
            loginUser: bool,
        })
    }

    goToRegisterPage() {
        setTimeout(() => this.context.router.push('/register'), 0);
    }

    openOrientationPopup() {
        this.props.showPopup('popup-orientation');
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
    }

    slickGoTo(slide) {
        this.slider.slickGoTo(slide)
    }

    onCancelDetailPopup() {
        this.props.closePopup('popup-detail');
        this.setDetail(null);
    }

    onCancelOrientationPopup() {
        this.props.closePopup('popup-orientation');
    }

    renderSlides = function() {
        const {strings} = this.props;
        const {hideContent, registeringUser} = this.state;
        const settings = {
            accessibility: !hideContent,
            draggable: !hideContent,
            swipe: !hideContent,
            //autoplaySpeed: 5000,
            className: 'swiper-wrapper',
            dots: false,
            infinite: true,
            slidesToShow: 1,
            slidesToScroll: 1,
            arrows: false,
            autoplay: false,
            //autoplay: !registeringUser,
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
        const {profile} = this.props;
        const {currentSlide, registeringUser} = this.state;

        if (!registeringUser) {
            return;
        }

        switch (index) {
            case 1:
                return <GroupField onValidInvitation={this.goToRegisterPage} activeSlide={currentSlide === 0}/>;
                //return <GroupField onValidInvitation={this.hideContent} activeSlide={currentSlide === 0} onChangeField={() => this.slider.slickPause()}/>;
            case 2:
                return <ExploreField profile={profile} onClickField={this.hideContent} onSaveHandler={this.goToRegisterPage} onBackHandler={this.showContent} onDetailSelection={this.setDetail}/>;
            case 3:
                return <OrientationField profile={profile} onOtherClickHandler={this.openOrientationPopup} onSaveHandler={this.goToRegisterPage}/>;
            default:
        }
    };

    hideContent() {
        this.setState({hideContent: true});
    }

    showContent() {
        this.setState({hideContent: false});
    }

    setDetail(name) {
        this.setState({'detail': name});
    }

    render() {
        const {profile, strings, hasToken} = this.props;
        const {loginUser, registeringUser, currentSlide, hideContent, detail} = this.state;

        return (
            <div className="views">
                <div className="view view-main home-view">
                    <div className="swiper-container">
                        {this.renderSlides()}
                    </div>
                    {!registeringUser ? <AccessButtons hasNetworkInfo={hasToken} onLoginClick={this.loginByResourceOwner} onRegisterClick={this.onRegisterClick}/> : null}
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
                                    <span className={currentSlide === 0 ? "icon icon-calendar-check active" : "icon-calendar-check2"}/>
                                    <div className={currentSlide === 0 ? "slider-button-text active" : "slider-button-text"}>{strings.events}</div>
                                </div>
                                <div className="slider-button" onClick={this.slickGoTo.bind(this, 1)}>
                                    <span className={currentSlide === 1 ? "icon icon-compass2 active" : "icon-compass3"}/>
                                    <div className={currentSlide === 1 ? "slider-button-text active" : "slider-button-text"}>{strings.explore}</div>
                                </div>
                                <div className="slider-button" onClick={this.slickGoTo.bind(this, 2)}>
                                    <span className={currentSlide === 2 ? "icon icon-heart2 active" : "icon-heart3"}/>
                                    <div className={currentSlide === 2 ? "slider-button-text active" : "slider-button-text"}>{strings.contact}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <DetailPopup profile={profile} detail={detail} onCancel={this.onCancelDetailPopup} contentRef={detail ? this.props.popupContentRef : null} onSave={this.preRegisterProfile}/>
                <OrientationPopup profile={profile} onContinue={this.goToRegisterPage} onCancel={this.onCancelOrientationPopup} contentRef={!detail ? this.props.popupContentRef : null}/>
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
        blockingError  : 'Your browser has blocked a Facebook request and we are not able to register you. Please, disable the blocking configuration or use an other browser.'
    }
};