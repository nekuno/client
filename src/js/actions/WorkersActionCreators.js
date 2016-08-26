import { dispatch, dispatchAsync } from '../dispatcher/Dispatcher';
import ActionTypes from '../constants/ActionTypes';

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

    similarityStart: (data) => {
        dispatch(ActionTypes.WORKERS_SIMILARITY_START, data);
    },

    similarityStep: (data) => {
        dispatch(ActionTypes.WORKERS_SIMILARITY_STEP, data);
    },

    similarityFinish: (data) => {
        dispatch(ActionTypes.WORKERS_SIMILARITY_FINISH, data);
    },

    matchingStart: (data) => {
        dispatch(ActionTypes.WORKERS_MATCHING_START, data);
    },

    matchingStep: (data) => {
        dispatch(ActionTypes.WORKERS_MATCHING_STEP, data);
    },

    matchingFinish: (data) => {
        dispatch(ActionTypes.WORKERS_MATCHING_FINISH, data);
    },

    affinityStart: (data) => {
        dispatch(ActionTypes.WORKERS_AFFINITY_START, data);
    },

    affinityStep: (data) => {
        dispatch(ActionTypes.WORKERS_AFFINITY_STEP, data);
    },

    affinityFinish: (data) => {
        dispatch(ActionTypes.WORKERS_AFFINITY_FINISH, data);
    },

    userStatus: (data) => {
        dispatch(ActionTypes.WORKERS_USER_STATUS, data);
    }

}
