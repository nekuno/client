import { dispatchAsync } from '../dispatcher/Dispatcher';
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

    connect: (resource, accessToken, resourceId, expireTime, refreshToken) => {
        let promise = AuthService.connect(resource, accessToken, resourceId, expireTime, refreshToken);
        dispatchAsync(promise, {
            request: ActionTypes.CONNECT_ACCOUNT,
            success: ActionTypes.CONNECT_ACCOUNT_SUCCESS,
            failure: ActionTypes.CONNECT_ACCOUNT_ERROR
        }, {resource, accessToken, resourceId, expireTime, refreshToken});
        return promise;
    }
}
