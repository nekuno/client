import { dispatch, dispatchAsync } from '../dispatcher/Dispatcher';
import ActionTypes from '../constants/ActionTypes';
import AuthService from '../services/AuthService';

export default {

    loginUser: (username, password) => {
        let promise = AuthService.login(username, password);
        dispatchAsync(promise, {
            request: ActionTypes.REQUEST_LOGIN_USER,
            success: ActionTypes.REQUEST_LOGIN_USER_SUCCESS,
            failure: ActionTypes.REQUEST_LOGIN_USER_ERROR
        }, {username, password});
    },

    register: (username, plainPassword, email, profile) => {
        let promise = AuthService.register(username, plainPassword, email);
        dispatchAsync(promise, {
            request: ActionTypes.REQUEST_REGISTER_USER,
            success: ActionTypes.REQUEST_REGISTER_USER_SUCCESS,
            failure: ActionTypes.REQUEST_REGISTER_USER_ERROR
        }, {username, plainPassword, email})
            .then(function(user) {
                console.log(user);
                console.log(profile);
            }).catch(function(error) {
                console.log(error);
        });
    },

    logoutUser: () => {
        dispatch(ActionTypes.LOGOUT_USER);
    }
}
