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
import RegisterStore from '../stores/RegisterStore';
import Slider from 'react-slick';
import Overlay from '../components/ui/Overlay/';
import FacebookButton from '../components/ui/FacebookButton';
import RouterActionCreators from '../actions/RouterActionCreators';

function getState(props) {
    const interfaceLanguage = LocaleStore.locale;
    const profile = RegisterStore.profile;

    return {
        interfaceLanguage,
        profile,
    };
}

@translate('HomePage')
@connectToStores([LocaleStore, RegisterStore], getState)
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

        this.setLoginUserState = this.setLoginUserState.bind(this);
        this.beforeChangeSlide = this.beforeChangeSlide.bind(this);
        this.afterChangeSlide = this.afterChangeSlide.bind(this);
        this.slickNext = this.slickNext.bind(this);
        this.handleSocialNetwork = this.handleSocialNetwork.bind(this);
        this._registerUser = this._registerUser.bind(this);

        this.state = {
            loginUser: false,
			currentSlide: 0,
			loginUser: false,
            initialToken: null,
        };
    }

    /* componentDidMount() {
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
                    Framework7Service.alertLoginFailed(resource, status)
                }
            );
        }
	} */
	
	componentDidMount() {
        const {location, token, profile, registerData} = this.props;
        let initialToken = location.query && location.query.token ? location.query.token : null;

        if (registerData && registerData.oauth) {
            this.handleSocialNetwork(SOCIAL_NETWORKS_NAMES.FACEBOOK, FACEBOOK_SCOPE);
        } else if (initialToken) {
            this.setState({initialToken});
            ConnectActionCreators.validateInvitation(initialToken);
        } else if (!token && !profile) {
            this.context.router.push('/');
        }
    }

    setLoginUserState(bool) {
        this.setState({
            loginUser: bool,
        })
    }

    doPreRegister() {
        const {profile} = this.props;
        let newProfile = Object.assign({}, profile);
        //newProfile.orientation = [key];
        newProfile.mode = 'contact';
        if (newProfile.objective && Array.isArray(newProfile.objective)) {
            newProfile.objective.push('human-contact');
        } else {
            newProfile.objective = ['human-contact'];
        }
        LoginActionCreators.preRegisterProfile(newProfile);
    }

    beforeChangeSlide(oldSlide, newSlide) {

    }

    afterChangeSlide(newSlide) {
        this.setState(({
            currentSlide: newSlide
        }));
    }

    slickNext() {
            this.slider.slickNext();
    }

    renderSlides = function() {
		const {strings} = this.props;
		
		const settings = {
            accessibility: true,
            draggable: true,
            swipe: true,
            className: 'swiper-wrapper',
            dots: true,
            infinite: true,
            slidesToShow: 1,
            slidesToScroll: 1,
            arrows: false,
            autoplay: true,
			initialSlide: 0,
			pauseOnFocus: true,
			speed: 1000,
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
            <Slider {...settings} ref={c => {this.slider = c }}>
                {[1, 2, 3].map(i => {
                        return (
                            <div key={i} className="swiper-slide" onClick={this.slickNext.bind(this)}>
                                <div className="login-image">
                                    <img src={images[i - 1]} />
                                </div>
                                <h1 className="slide-text">{strings['title' + i]}</h1>
                                <h3 className="slide-text">{strings['resume' + i]}</h3>
                            </div>
                        )
                    }
                )}
            </Slider>
        );
	};

	_registerUser(user, profile, token, oauthData) {
        LoginActionCreators.preRegister(user, profile, token, oauthData);
        setTimeout(() => RouterActionCreators.replaceRoute('answer-username'), 0);

        this.setState({
            registeringUser: true
        });
    }

	handleSocialNetwork(resource, scope) {
        const {token, invitation, interfaceLanguage, strings} = this.props;
        this.setState({loginUser: true});
        SocialNetworkService.login(resource, scope, true).then(() => {
            const oauthData = SocialNetworkService.buildOauthData(resource);
            LoginActionCreators.loginUserByResourceOwner(
                resource,
                SocialNetworkService.getAccessToken(resource),
                SocialNetworkService.getRefreshToken(resource)
            ).then(
                () => {
                    console.log('User already logged in. Using invitation', invitation);
                    if (invitation && invitation.hasOwnProperty('group')) {
                        console.log('Joining group', invitation.group);
                        return GroupActionCreators.joinGroup(invitation.group.id);
                    }
                    return null; // User is logged in
                },
                () => {
                    let user = SocialNetworkService.getUser(resource);
                    let profile = SocialNetworkService.getProfile(resource);
                    if (!user || !profile) {
                        Framework7Service.nekunoApp().alert(strings.blockingError);
                        this.setState({registeringUser: false});
                    } else {
                        this.doPreRegister();
                        profile.interfaceLanguage = interfaceLanguage;
                        profile.orientationRequired = false;
                        this._registerUser(user, profile, token, oauthData);
                    }
                });
        }, (status) => {
            Framework7Service.alertLoginFailed(resource, status)
        });
    }
    
    pauseSlider() {
        if (this._sliderTimer)
            clearTimeout(this._sliderTimer)
        this.slider.innerSlider.pause()
    }
    
    unpauseSlider() {
        if (this._sliderTimer)
            clearTimeout(this._sliderTimer)
        this._sliderTimer = setTimeout(() => {
            this.slider.innerSlider.play()
        }, 3000)
    }

    render() {
		const {strings} = this.props;
        const {initialToken, loginUser} = this.state;

        return (
            <div className="views">
                <div className="view view-main home-view">
                    <Overlay/>
                    <div className="home-wrapper">
                        <div className="nekuno-logo-wrapper">
                            <div className="nekuno-logo"/>
                        </div>
                        <div className="swiper-container" onTouchStart={() => this.pauseSlider()} onTouchEnd={() => this.unpauseSlider()}>
							{this.renderSlides()}
						</div>
                        {/* <div className="skip-wrapper small" onClick={this.goToRegisterPage}>
                            <span className="skip-text">{strings.skip}&nbsp;</span>
                            <span className="icon-arrow-right" />
						</div> */}
                            <FacebookButton onClickHandler={this.handleSocialNetwork} text={initialToken ? strings.compatibility : strings.signUp} disabled={loginUser}/>
                            <div className="privacy-terms-text">
                                <p dangerouslySetInnerHTML={{__html: strings.legalTerms}}/>
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