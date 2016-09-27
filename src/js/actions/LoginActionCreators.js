import { dispatch, dispatchAsync } from '../dispatcher/Dispatcher';
import ActionTypes from '../constants/ActionTypes';
import AuthService from '../services/AuthService';
import ChatSocketService from '../services/ChatSocketService';
import WorkersSocketService from '../services/WorkersSocketService';
import LoginStore from '../stores/LoginStore';
import ProfileStore from '../stores/ProfileStore';
import QuestionStore from '../stores/QuestionStore';
import RouterStore from '../stores/RouterStore';
import RouterContainer from '../services/RouterContainer';
import * as QuestionActionCreators from '../actions/QuestionActionCreators';
import * as UserActionCreators from '../actions/UserActionCreators';
import UserDataStatusActionCreators from '../actions/UserDataStatusActionCreators';
import RouterActionCreators from '../actions/RouterActionCreators';
import selectn from 'selectn';

export default new class LoginActionCreators {

    autologin() {
        let jwt = localStorage.getItem('jwt');
        console.log('Attempting auto-login...');
        dispatch(ActionTypes.AUTO_LOGIN, {jwt});
        if (LoginStore.isLoggedIn()) {
            UserActionCreators.requestOwnUser();
        }
        if (!RouterStore.hasNextTransitionPath() && LoginStore.isLoggedIn() && (document.location.hash === '' || document.location.hash.indexOf('#/?') === 0)) {
            RouterActionCreators.storeRouterTransitionPath('/threads');
        }
        this.redirect();
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
                    RouterActionCreators.storeRouterTransitionPath('/threads');
                }
                this.redirect();
                return null;
            }, (error) => {
                console.error(error);
            });
    }

    loginUserByResourceOwner(resourceOwner, accessToken) {
        let promise = AuthService.resourceOwnerLogin(resourceOwner, accessToken);
        return dispatchAsync(promise, {
            request: ActionTypes.REQUEST_LOGIN_USER,
            success: ActionTypes.REQUEST_LOGIN_USER_SUCCESS,
            failure: ActionTypes.REQUEST_LOGIN_USER_ERROR
        }, {resourceOwner, accessToken})
            .then(() => {
                if (!RouterStore.hasNextTransitionPath()) {
                    RouterActionCreators.storeRouterTransitionPath('/threads');
                }
                this.redirect();
                return new Promise(function (resolve) {resolve(true)});
            }, (error) => {
                return new Promise(function (resolve, reject) {reject(error)});
            });
    }

    redirect() {

        if (LoginStore.isLoggedIn()) {

            if (LoginStore.user.enabled === false) {
                return this.logoutUser();
            }

            UserActionCreators.requestStats(LoginStore.user.id);
            ChatSocketService.connect();
            WorkersSocketService.connect();
            UserDataStatusActionCreators.requestUserDataStatus();
            UserActionCreators.requestOwnProfile(LoginStore.user.id).then(() => {
                QuestionActionCreators.requestQuestions(LoginStore.user.id).then(
                    () => {
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
                            let history = RouterContainer.get();
                            history.replaceState(null, path);
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
    }

    register(user, profile, token, oauth) {
        let promise = AuthService.register(user, profile, token, oauth);
        dispatchAsync(promise, {
            request: ActionTypes.REQUEST_REGISTER_USER,
            success: ActionTypes.REQUEST_REGISTER_USER_SUCCESS,
            failure: ActionTypes.REQUEST_REGISTER_USER_ERROR
        }, {user, profile, token, oauth})
            .then(() => {
                return this.loginUserByResourceOwner(oauth.resourceOwner, oauth.oauthToken);
            }, (error) => {
                console.error(error);
            });
    }

    logoutUser(path = '/') {
        dispatch(ActionTypes.LOGOUT_USER,{path});
        ChatSocketService.disconnect();
        WorkersSocketService.disconnect();
    }
}
