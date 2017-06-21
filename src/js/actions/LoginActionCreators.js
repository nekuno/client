import { dispatch, dispatchAsync } from '../dispatcher/Dispatcher';
import ActionTypes from '../constants/ActionTypes';
import AuthService from '../services/AuthService';
import ChatSocketService from '../services/ChatSocketService';
import WorkersSocketService from '../services/WorkersSocketService';
import PushNotificationsService from '../services/PushNotificationsService';
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
            const autologinRequests = this.autologinRequests(LoginStore.user.id);
            Promise.all(autologinRequests).then(() => {
                if (!RouterStore.hasNextTransitionPath() && (document.location.hash === '' || document.location.hash === '#/' || document.location.hash.indexOf('#/?') === 0)) {
                    console.log('storing');
                    RouterActionCreators.storeRouterTransitionPath('/discover');
                }
                this.redirect();
            }, (error) => {
                console.log(error);
            });
        }
    }

    autologinRequests(userId) {
        const userPromise = UserActionCreators.requestOwnUser();
        const statsPromise = UserActionCreators.requestStats(userId);
        // UserDataStatusActionCreators.requestUserDataStatus();
        const profilePromise = UserActionCreators.requestOwnProfile(userId);

        const necessaryData = [statsPromise, profilePromise, userPromise];

        return necessaryData;
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
        PushNotificationsService.init();
        const userId = LoginStore.user.id;
        this.requestDataOnLogin(userId);
        ChatSocketService.connect();
        WorkersSocketService.connect();
        // Promise.all(necessaryData).then(
        //     () => {
                console.log('QuestionActionCreators.requestQuestions', QuestionStore.answersLength(userId));
                console.log('LoginStore.isComplete()', LoginStore.isComplete());
                console.log('ProfileStore.isComplete(userId)', ProfileStore.isComplete(userId));
                console.log(ProfileStore.get(userId));
                console.log('QuestionStore.isJustRegistered(userId)', QuestionStore.isJustRegistered(userId));
                const path = this.choosePath(userId);
                if (path) {
                    console.log('Redirecting to path', path);
                    let router = RouterContainer.get();
                    router.replace(path);
                }
                return null;
            // }
            // , (error) => {
            //     console.error(error);
            // // }
        // ) .catch((error) => {
        //     console.error(error);
        // });
    }

    requestDataOnLogin(userId) {
        // const statsPromise = UserActionCreators.requestStats(userId);
        UserDataStatusActionCreators.requestUserDataStatus();
        // const profilePromise = UserActionCreators.requestOwnProfile(userId);

        // const necessaryData = [statsPromise, profilePromise];

        // return necessaryData;
    }

    choosePath(userId) {
        let path = null;
        if (QuestionStore.answersLength(userId) === 0) {
            path = '/social-networks-on-sign-up';
        } else if (!LoginStore.isComplete() || !ProfileStore.isComplete(userId) || QuestionStore.isJustRegistered(userId)) {
            path = '/register-questions-landing';
        } else {
            path = RouterStore.nextTransitionPath;
            if (path) {
                console.log('RouterStore.nextTransitionPath found', path);
            }
        }

        return path;
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
