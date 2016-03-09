import { dispatch, dispatchAsync } from '../dispatcher/Dispatcher';
import ActionTypes from '../constants/ActionTypes';
import AuthService from '../services/AuthService';
import ChatSocketService from '../services/ChatSocketService';
import WorkersSocketService from '../services/WorkersSocketService';
import LoginStore from '../stores/LoginStore';
import RouterContainer from '../services/RouterContainer';
import * as QuestionActionCreators from '../actions/QuestionActionCreators';

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
            ChatSocketService.connect();
            WorkersSocketService.connect();
            var user = LoginStore.user;
            QuestionActionCreators.requestQuestions(user.qnoow_id).then(function(data){
                path = data.result.pagination.total < 4 ? '/register-questions-landing' : '/threads/' + user.qnoow_id ;
                history.replaceState(null, path);
                console.log('&*&*&* redirecting to path', path);
            });
        } else {
            ChatSocketService.disconnect();
            WorkersSocketService.disconnect();
            history.replaceState(null, path);
            console.log('&*&*&* redirecting to path', path);
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
        this.redirect();
    }
}
