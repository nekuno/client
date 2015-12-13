import { dispatchAsync } from '../dispatcher/Dispatcher';
import ActionTypes from '../constants/ActionTypes';
import * as UserAPI from '../api/UserAPI';
import UserStore from '../stores/UserStore';

export function requestUser(login, fields) {
    // Exit early if we know enough about this user
    if (UserStore.contains(login, fields)) {
        return;
    }

    dispatchAsync(UserAPI.getUser(login), {
        request: ActionTypes.REQUEST_USER,
        success: ActionTypes.REQUEST_USER_SUCCESS,
        failure: ActionTypes.REQUEST_USER_ERROR
    }, {login});
}
