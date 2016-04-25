import { dispatch, dispatchAsync } from '../dispatcher/Dispatcher';
import ActionTypes from '../constants/ActionTypes';
import AuthService from '../services/AuthService';
import ChatSocketService from '../services/ChatSocketService';
import WorkersSocketService from '../services/WorkersSocketService';
import LoginStore from '../stores/LoginStore';
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
        if (!RouterStore.hasNextTransitionPath() && LoginStore.isLoggedIn() && document.location.hash.indexOf('#/?') === 0) {
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

    redirect() {

        if (LoginStore.isLoggedIn()) {

            UserActionCreators.requestProfile(LoginStore.user.id);
            UserActionCreators.requestStats(LoginStore.user.id);

            ChatSocketService.connect();
            WorkersSocketService.connect();
            UserDataStatusActionCreators.requestUserDataStatus();

            QuestionActionCreators.requestQuestions(LoginStore.user.id).then(
                (data) => {
                    let path = null;
                    let answers = selectn('result.pagination.total', data) || 0;
                    if (answers == 0) {
                        path = '/social-networks-on-sign-up';
                    } else if (answers < 4) {
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
                return this.loginUser(user.username, user.plainPassword);
            }, (error) => {
                console.error(error);
            });
    }

    logoutUser() {
        dispatch(ActionTypes.LOGOUT_USER);
        ChatSocketService.disconnect();
        WorkersSocketService.disconnect();
        let history = RouterContainer.get();
        history.replaceState(null, '/');
    }
}
