import { dispatch, dispatchAsync } from '../dispatcher/Dispatcher';
import ActionTypes from '../constants/ActionTypes';
import AuthService from '../services/AuthService';
import LoginStore from '../stores/LoginStore';
import RouterContainer from '../services/RouterContainer';

export default new class LoginActionCreators {

    loginUser(username, password) {
        let promise = AuthService.login(username, password);
        dispatchAsync(promise, {
            request: ActionTypes.REQUEST_LOGIN_USER,
            success: ActionTypes.REQUEST_LOGIN_USER_SUCCESS,
            failure: ActionTypes.REQUEST_LOGIN_USER_ERROR
        }, {username, password})
            .then(() => {
                this.redirect();
                return null;
            }, (error) => {
                console.error(error);
            });
    }

    redirect() {
        var history = RouterContainer.get();
        var path = '/';
        if (LoginStore.isLoggedIn()) {
            var user = LoginStore.user;
            path = '/threads/' + user.qnoow_id;
        }
        history.replaceState(null, path);
        console.log('&*&*&* redirecting to path', path);
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
        this.redirect();
    }
}
