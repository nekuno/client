import { dispatchAsync } from '../dispatcher/Dispatcher';
import ActionTypes from '../constants/ActionTypes';
import * as UserDataStatusAPI from '../api/UserDataStatusAPI';

export default {

    requestUserDataStatus: () => {
        dispatchAsync(UserDataStatusAPI.getUserDataStatus(), {
            request: ActionTypes.REQUEST_USER_DATA_STATUS,
            success: ActionTypes.REQUEST_USER_DATA_STATUS_SUCCESS,
            failure: ActionTypes.REQUEST_USER_DATA_STATUS_ERROR
        }, {});
    }

}
