import { dispatch, dispatchAsync } from '../dispatcher/Dispatcher';
import ActionTypes from '../constants/ActionTypes';
import * as UserDataStatusAPI from '../api/UserDataStatusAPI';

export default {

    requestUserDataStatus: (userId) => {
        dispatchAsync(UserDataStatusAPI.getUserDataStatus(userId), {
            request: ActionTypes.REQUEST_USER_DATA_STATUS,
            success: ActionTypes.REQUEST_USER_DATA_STATUS_SUCCESS,
            failure: ActionTypes.REQUEST_USER_DATA_STATUS_ERROR
        }, {userId});
    }

}
