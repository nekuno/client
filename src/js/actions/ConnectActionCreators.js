import { dispatch, dispatchAsync } from '../dispatcher/Dispatcher';
import ActionTypes from '../constants/ActionTypes';
import AuthService from '../services/AuthService';

export default {

    validate: (token) => {
        let promise = AuthService.validate(token);
        dispatchAsync(promise, {
            request: ActionTypes.REQUEST_VALIDATE_INVITATION_USER,
            success: ActionTypes.REQUEST_VALIDATE_INVITATION_USER_SUCCESS,
            failure: ActionTypes.REQUEST_VALIDATE_INVITATION_USER_ERROR
        }, {token});
    },

    connect: (token, accessToken, resource) => {
        dispatch(ActionTypes.CONNECT_ACCOUNT, {
            token,
            accessToken,
            resource
        });
    }
}
