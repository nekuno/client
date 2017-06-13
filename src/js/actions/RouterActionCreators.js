import { dispatch } from '../dispatcher/Dispatcher';
import ActionTypes from '../constants/ActionTypes';

export default {
    storeRouterTransitionPath: (path) => {
        dispatch(ActionTypes.ROUTER_NEXT_TRANSITION_PATH, {path});
    },

    nextRoute: (route) => {
        dispatch(ActionTypes.NEXT_ROUTE, {route});
    },


    removePreviousRoute: () => {
        dispatch(ActionTypes.REMOVE_PREV_ROUTE, {});
    },

    previousRoute: (route) => {
        dispatch(ActionTypes.PREVIOUS_ROUTE, {route});
    }
}
