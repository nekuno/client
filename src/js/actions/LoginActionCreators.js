import { dispatch, dispatchAsync } from '../dispatcher/Dispatcher';
import ActionTypes from '../constants/ActionTypes';
import AuthService from '../services/AuthService';
import ChatSocketService from '../services/ChatSocketService';
import WorkersSocketService from '../services/WorkersSocketService';
import NotificationsSocketService from '../services/NotificationsSocketService';
import LoginStore from '../stores/LoginStore';
import ProfileStore from '../stores/ProfileStore';
import QuestionStore from '../stores/QuestionStore';
import RouterStore from '../stores/RouterStore';
import RouterContainer from '../services/RouterContainer';
import * as QuestionActionCreators from '../actions/QuestionActionCreators';
import * as UserActionCreators from '../actions/UserActionCreators';
import UserDataStatusActionCreators from '../actions/UserDataStatusActionCreators';
import RouterActionCreators from '../actions/RouterActionCreators';
import LocalStorageService from '../services/LocalStorageService';
import AnalyticsService from '../services/AnalyticsService';
import TranslationService from '../services/TranslationService';

export default new class LoginActionCreators {

    autologin() {
        let jwt = LocalStorageService.get('jwt');
        console.log('Attempting auto-login...');
        dispatch(ActionTypes.AUTO_LOGIN, {jwt});
        if (LoginStore.isLoggedIn()) {
            UserActionCreators.requestOwnUser().then(() => {
                if (!RouterStore.hasNextTransitionPath() && (document.location.hash === '' || document.location.hash === '#/' || document.location.hash.indexOf('#/?') === 0)) {
                    RouterActionCreators.storeRouterTransitionPath('/discover');
                }
                this.redirect();
            }, (error) => {
                console.log(error);
            });
        }

    }

    loginUser(username, password) {
        let promise = AuthService.login(username, password);
        dispatchAsync(promise, {
            request: ActionTypes.REQUEST_LOGIN_USER,
            success: ActionTypes.REQUEST_LOGIN_USER_SUCCESS,
            failure: ActionTypes.REQUEST_LOGIN_USER_ERROR
        }, {username, password})
            .then(() => {
                if (!RouterStore.hasNextTransitionPath()) {
                    RouterActionCreators.storeRouterTransitionPath('/discover');
                }
                this.redirect();
                return null;
            }, (error) => {
                console.error(error);
            });
    }

    loginUserByResourceOwner(oauthData) {

        const resourceOwner = oauthData['resourceOwner'];
        const accessToken = oauthData['oauthToken'];

        let promise = AuthService.resourceOwnerLogin(oauthData);
        return dispatchAsync(promise, {
            request: ActionTypes.REQUEST_LOGIN_USER,
            success: ActionTypes.REQUEST_LOGIN_USER_SUCCESS,
            failure: ActionTypes.REQUEST_LOGIN_USER_ERROR
        }, {resourceOwner, accessToken})
            .then(() => {
                const userId = LoginStore.user.id;
                AnalyticsService.setUserId(userId);
                AnalyticsService.trackEvent('Login', resourceOwner + ' login', document.referrer);
                if (!RouterStore.hasNextTransitionPath()) {
                    RouterActionCreators.storeRouterTransitionPath('/discover');
                }
                this.redirect();
                return new Promise(function(resolve) {
                    resolve(true)
                });
            }, (error) => {
                return new Promise(function(resolve, reject) {
                    reject(error)
                });
            });
    }

    redirect() {

        if (LoginStore.isLoggedIn()) {
            if (LoginStore.isEnabled()) {
                this.successfulRedirect();
            } else {
                this.confirmReenable();
            }
        }
    }

    confirmReenable() {
        const question = TranslationService.getTranslatedString('LoginActionCreators', 'enableQuestion');
        const title = TranslationService.getTranslatedString('LoginActionCreators', 'inactiveAccount');
        nekunoApp.confirm(question, title,
            () => {
                UserActionCreators.setOwnEnabled(true).then(() => {
                    location.reload();
                });
            },
            () => {
                return this.logoutUser();
            });
    }

    successfulRedirect() {
        UserActionCreators.requestStats(LoginStore.user.id);
        ChatSocketService.connect();
        WorkersSocketService.connect();
        NotificationsSocketService.connect();
        UserDataStatusActionCreators.requestUserDataStatus();
        UserActionCreators.requestOwnProfile(LoginStore.user.id).then(() => {
            QuestionActionCreators.requestQuestions(LoginStore.user.id).then(
                () => {
                    console.log('QuestionActionCreators.requestQuestions', QuestionStore.answersLength(LoginStore.user.id));
                    console.log('LoginStore.isComplete()', LoginStore.isComplete());
                    console.log('ProfileStore.isComplete(LoginStore.user.id)', ProfileStore.isComplete(LoginStore.user.id));
                    console.log('QuestionStore.isJustRegistered(LoginStore.user.id)', QuestionStore.isJustRegistered(LoginStore.user.id));
                    let path = null;
                    if (QuestionStore.answersLength(LoginStore.user.id) == 0) {
                        path = '/social-networks-on-sign-up';
                    } else if (!LoginStore.isComplete() || !ProfileStore.isComplete(LoginStore.user.id) || QuestionStore.isJustRegistered(LoginStore.user.id)) {
                        path = '/register-questions-landing';
                    } else {
                        path = RouterStore.nextTransitionPath;
                        if (path) {
                            console.log('RouterStore.nextTransitionPath found', path);
                        }
                    }
                    if (path) {
                        console.log('Redirecting to path', path);
                        let router = RouterContainer.get();
                        router.replace(path);
                    }
                    return null;
                }, (error) => {
                    console.error(error);
                }
            );
        }, (error) => {
            console.error(error);
        });
    }

    preRegister(user, profile, token, oauth) {
        dispatch(ActionTypes.PRE_REGISTER_USER, {user, profile, token, oauth});
    }

    register(user, profile, token, oauth) {
        let promise = AuthService.register(user, profile, token, oauth);
        return dispatchAsync(promise, {
            request: ActionTypes.REQUEST_REGISTER_USER,
            success: ActionTypes.REQUEST_REGISTER_USER_SUCCESS,
            failure: ActionTypes.REQUEST_REGISTER_USER_ERROR
        }, {user, profile, token, oauth})
            .then((user) => {
                AnalyticsService.setUserId(user.id);
                AnalyticsService.trackEvent('Registration', 'Registration success', document.referrer);
                return this.loginUserByResourceOwner(oauth);
            }, (error) => {
                console.error(error);
                nekunoApp.alert('Error registering. Please contact enredos@nekuno.com');
                throw error;
            });
    }

    logoutUser(path = '/') {
        dispatch(ActionTypes.LOGOUT_USER, {path});
        ChatSocketService.disconnect();
        WorkersSocketService.disconnect();
        NotificationsSocketService.disconnect();
    }
}
