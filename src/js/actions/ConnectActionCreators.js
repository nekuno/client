import { dispatch, dispatchAsync } from '../dispatcher/Dispatcher';
import ActionTypes from '../constants/ActionTypes';
import AuthService from '../services/AuthService';

export default {

    validateInvitation: (token) => {
        let promise = AuthService.validateInvitation(token);
        dispatchAsync(promise, {
            request: ActionTypes.REQUEST_VALIDATE_INVITATION_USER,
            success: ActionTypes.REQUEST_VALIDATE_INVITATION_USER_SUCCESS,
            failure: ActionTypes.REQUEST_VALIDATE_INVITATION_USER_ERROR
        }, {token});
    },

    validateUsername: (username) => {
        let promise = AuthService.validateUsername(username);
        dispatchAsync(promise, {
            request: ActionTypes.REQUEST_VALIDATE_USERNAME,
            success: ActionTypes.REQUEST_VALIDATE_USERNAME_SUCCESS,
            failure: ActionTypes.REQUEST_VALIDATE_USERNAME_ERROR
        }, {username});
    },

    connect: (token, accessToken, resource, userId) => {
        dispatch(ActionTypes.CONNECT_ACCOUNT, {
            token,
            accessToken,
            resource,
            userId
        });
    }
}
