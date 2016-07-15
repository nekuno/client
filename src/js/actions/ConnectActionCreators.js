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

    connectRegister: (token, resource, accessToken, resourceId, expireTime, profile) => {
        dispatch(ActionTypes.CONNECT_REGISTER_ACCOUNT, {
            token,
            resource,
            accessToken,
            resourceId,
            expireTime,
            profile
        });
    },

    connect: (resource, accessToken, resourceId, expireTime) => {
        let promise = AuthService.connect(resource, accessToken, resourceId, expireTime);
        dispatchAsync(promise, {
            request: ActionTypes.CONNECT_ACCOUNT,
            success: ActionTypes.CONNECT_ACCOUNT_SUCCESS,
            failure: ActionTypes.CONNECT_ACCOUNT_ERROR
        }, {resource, accessToken, resourceId, expireTime});
        return promise;
    }
}
