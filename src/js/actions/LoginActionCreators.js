import { dispatch, dispatchAsync } from '../dispatcher/Dispatcher';
import ActionTypes from '../constants/ActionTypes';
import AuthService from '../services/AuthService';
import ChatSocketService from '../services/ChatSocketService';
import WorkersSocketService from '../services/WorkersSocketService';
import PushNotificationsService from '../services/PushNotificationsService';
import Framework7Service from '../services/Framework7Service';
import LoginStore from '../stores/LoginStore';
import ProfileStore from '../stores/ProfileStore';
import QuestionStore from '../stores/QuestionStore';
import RouterStore from '../stores/RouterStore';
import RouterContainer from '../services/RouterContainer';
import * as QuestionActionCreators from '../actions/QuestionActionCreators';
import * as UserActionCreators from '../actions/UserActionCreators';
import * as ThreadActionCreators from '../actions/ThreadActionCreators';
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
            UserActionCreators.requestAutologinData().then(() => {
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

    loginUserByResourceOwner(resourceOwner, accessToken, refreshToken = null) {

        let promise = AuthService.resourceOwnerLogin(resourceOwner, accessToken, refreshToken);
        return dispatchAsync(promise, {
            request: ActionTypes.REQUEST_LOGIN_USER,
            success: ActionTypes.REQUEST_LOGIN_USER_SUCCESS,
            failure: ActionTypes.REQUEST_LOGIN_USER_ERROR
        }, {resourceOwner, accessToken, refreshToken})
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
        Framework7Service.nekunoApp().confirm(question, title,
            () => {
                UserActionCreators.setOwnEnabled(true).then(() => {
                    location.reload();
                }, (error) => { console.log(error) });
            },
            () => {
                return this.logoutUser();
            });
    }

    successfulRedirect() {
        PushNotificationsService.init();
        const userId = LoginStore.user.id;
        this.requestDataOnLogin(userId);
        ChatSocketService.connect();
        WorkersSocketService.connect();
        console.log('QuestionActionCreators.requestQuestions', QuestionStore.ownAnswersLength(userId));
        console.log('LoginStore.isComplete()', LoginStore.isComplete());
        console.log('ProfileStore.isComplete(userId)', ProfileStore.isComplete(userId));
        console.log('QuestionStore.isJustRegistered(userId)', QuestionStore.isJustRegistered(userId));
        const path = this.choosePath(userId);
        if (path) {
            console.log('Redirecting to path', path);
            let router = RouterContainer.get();
            router.replace(path);
        }
        return null;
    }

    requestDataOnLogin(userId) {
        UserDataStatusActionCreators.requestUserDataStatus();
        UserActionCreators.requestStats(userId);
        UserActionCreators.requestMetadata();
        ThreadActionCreators.requestFilters();
        const requestQuestionsLink = QuestionStore.getRequestQuestionsUrl(userId);
        QuestionActionCreators.requestQuestions(userId, requestQuestionsLink);
    }

    choosePath(userId) {
        let path = null;
        if (QuestionStore.ownAnswersLength(userId) === 0) {
            path = '/social-networks-on-sign-up';
        } else if (!LoginStore.isComplete() || !ProfileStore.isComplete(userId) || QuestionStore.isJustRegistered(userId)) {
            if (QuestionStore.isJustRegistered(userId)) {
                path = '/register-questions-landing';
            } else {
                path = '/answer-user-fields';
            }
        } else {
            path = RouterStore.nextTransitionPath;
            if (path) {
                console.log('RouterStore.nextTransitionPath found', path);
            }
        }

        return path;
    }

    preRegisterProfile(profile) {
        dispatch(ActionTypes.PRE_REGISTER_PROFILE, {profile});
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
                return this.loginUserByResourceOwner(oauth.resourceOwner, oauth.oauthToken, oauth.refreshToken);
            }, (error) => {
                console.error(error);
                Framework7Service.nekunoApp().alert('Error registering. Please contact enredos@nekuno.com');
                throw error;
            });
    }

    logoutUser(path = '/') {
        PushNotificationsService.unSubscribe().then(() => {
            dispatch(ActionTypes.LOGOUT_USER, {path});
            ChatSocketService.disconnect();
            WorkersSocketService.disconnect();
        }, () => {
            console.log('Error unsubscribing user')
            dispatch(ActionTypes.LOGOUT_USER, {path});
            ChatSocketService.disconnect();
            WorkersSocketService.disconnect();
        });
    }
}
