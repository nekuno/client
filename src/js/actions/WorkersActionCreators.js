import { dispatch, dispatchAsync } from '../dispatcher/Dispatcher';
import ActionTypes from '../constants/ActionTypes';
import ChatSocketService from '../services/ChatSocketService';

export default {

    fetchStart: (data) => {
        dispatch(ActionTypes.WORKERS_FETCH_START, data);
    },

    fetchFinish: (data) => {
        dispatch(ActionTypes.WORKERS_FETCH_FINISH, data);
    },

    processStart: (data) => {
        dispatch(ActionTypes.WORKERS_PROCESS_START, data);
    },

    processLink: (data) => {
        dispatch(ActionTypes.WORKERS_PROCESS_LINK, data);
    },

    processFinish: (data) => {
        dispatch(ActionTypes.WORKERS_PROCESS_FINISH, data);
    },

    userStatus: (data) => {
        dispatch(ActionTypes.WORKERS_USER_STATUS, data);
    }

}
