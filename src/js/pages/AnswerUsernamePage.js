import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { SOCIAL_NETWORKS, SOCIAL_NETWORKS_NAMES, FACEBOOK_SCOPE } from '../constants/Constants';
import Input from '../components/ui/Input/Input.js';
import translate from '../i18n/Translate';
import connectToStores from '../utils/connectToStores';
import LoginActionCreators from '../actions/LoginActionCreators';
import  * as UserActionCreators from '../actions/UserActionCreators';
import RouterActionCreators from '../actions/RouterActionCreators';
import SocialNetworkService from '../services/SocialNetworkService';
import RegisterStore from '../stores/RegisterStore';
import TopNavBar from '../components/TopNavBar/TopNavBar.js';
import Overlay from '../components/ui/Overlay/Overlay.js';
import '../../scss/pages/answer-username.scss';

/**
 * Retrieves state from stores for current props.
 */
function getState() {
    const isUsernameValid = RegisterStore.validUsername();

    return {
        isUsernameValid
    };
}

@translate('AnswerUsernamePage')
@connectToStores([RegisterStore], getState)
export default class AnswerUsernamePage extends Component {

    static propTypes = {
        // Injected by @translate:
        strings                 : PropTypes.object,
        // Injected by @connectToStores:
        isUsernameValid         : PropTypes.bool
    };

    static contextTypes = {
        router: PropTypes.object.isRequired
    };

    constructor(props) {
        super(props);

        this.onUsernameChange = this.onUsernameChange.bind(this);
        this.handleClickSave = this.handleClickSave.bind(this);
        this.login = this.login.bind(this);

        this.state = {
            username: '',
            validationPromise: Promise.resolve(true)
        };
    }

    onUsernameChange(username) {
        const {validationPromise} = this.state;
        if (typeof validationPromise.cancel !== 'undefined') {
            validationPromise.cancel();
        }

        if (typeof this.usernameTimeout !== 'undefined') {
            clearTimeout(this.usernameTimeout);
        }
        this.usernameTimeout = setTimeout(() => {
            let newPromise = UserActionCreators.validateUsername(username).then(() => {
                // Username valid
                // this.setState({username: username});
            }).catch(() => {
                //TODO: Fix it
                alert(this.props.strings.invalidUsername);
            });
            this.setState({validationPromise: newPromise});
        }, 1000);
    }

    handleClickSave(username) {
        let user = {username: username};
        LoginActionCreators.preRegister(user).then(() => {
            // TODO: Set next route
            setTimeout(() =>  { RouterActionCreators.replaceRoute('/') }, 0);
        }).catch(error => {
            //TODO: Fix it
            alert(this.props.strings.invalidUsername);
        });
    }

    goToProfessionalProfile() {
        // TODO: Enable when ready
        //RouterActionCreators.nextRoute('/professional-profile');
    }

    login() {
        const {token, interfaceLanguage, strings} = this.props;
        this.setState({loginUser: true});
        SocialNetworkService.login(SOCIAL_NETWORKS_NAMES.FACEBOOK).then(() => {
            const oauthData = SocialNetworkService.buildOauthData(SOCIAL_NETWORKS_NAMES.FACEBOOK);
            LoginActionCreators.loginUserByResourceOwner(
                SOCIAL_NETWORKS_NAMES.FACEBOOK,
                SocialNetworkService.getAccessToken(SOCIAL_NETWORKS_NAMES.FACEBOOK),
                SocialNetworkService.getRefreshToken(SOCIAL_NETWORKS_NAMES.FACEBOOK)
            ).then(
                () => {
                    return null; // User is logged in
                },
                () => {
                    let user = SocialNetworkService.getUser(SOCIAL_NETWORKS_NAMES.FACEBOOK);
                    let profile = SocialNetworkService.getProfile(SOCIAL_NETWORKS_NAMES.FACEBOOK);
                    if (!user || !profile) {
                        // TODO: Fix it
                        alert(strings.blockingError);
                        this.setState({registeringUser: false});
                    } else {
                        profile.interfaceLanguage = interfaceLanguage;
                        profile.orientationRequired = false;
                        this._registerUser(user, profile, token, oauthData);
                    }
                });
        }, (status) => {
            // TODO: Fix it
            alert(SOCIAL_NETWORKS_NAMES.FACEBOOK + ' login failed: ' + status.error.message)
        });
    }
    
    render() {
        const {strings, isUsernameValid} = this.props;
        return (
            <div className="views">
                <div className="view view-main answer-username-view">
                    <TopNavBar background={'transparent'} color={'white'} position={'absolute'} iconLeft={'arrow-left'} textSize={'small'} textCenter={strings.yourAccount}/>
                    <Overlay/>
                    <div className="content">
                        <h2>{strings.heading}</h2>
                        <h2>{strings.heading2}</h2>
                        <Input placeholder={strings.placeholder} checked={isUsernameValid} onChange={this.onUsernameChange}/>
                        <div className="login1" onClick={this.login}>{strings.alreadyRegistered}</div>
                        <div className="login2" onClick={this.login}>{strings.login}</div>
                        {/*<div className="page answer-username-page">*/}
                            {/*<div id="page-content" className="answer-question-content">*/}
                                {/*{registering ? <EmptyMessage text={strings.loadingMessage} loadingGif={true} /> :*/}
                                    {/*<UsernameField username={''} isUsernameValid={isUsernameValid} onSaveHandler={this.handleClickSave} />*/}
                                {/*}*/}
                            {/*</div>*/}
                        {/*</div>*/}
                    </div>
                    {isUsernameValid ?
                        <div className="continue-wrapper small" onClick={this.goToRegisterPage}>
                            <span className="continue-text">{strings.continue}&nbsp;</span>
                            <span className="icon-arrow-right" />
                        </div>
                        : null
                    }
                </div>
            </div>
        );
    }
}

AnswerUsernamePage.defaultProps = {
    strings: {
        yourAccount      : 'Your account at Nekuno',
        heading          : "Let's start!",
        heading2         : "What would you like to be your name?",
        placeholder      : 'Write your name here',
        alreadyRegistered: 'Already registered?',
        login            : 'Log in in here',
        continue         : 'Continue',
        invalidUsername  : 'Invalid username',
    }
};