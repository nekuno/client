import { dispatchAsync, dispatch } from '../dispatcher/Dispatcher';
import ActionTypes from '../constants/ActionTypes';
import * as InterestsAPI from '../api/InterestsAPI';

export function requestOwnInterests(userId, type, link) {
    dispatchAsync(InterestsAPI.getOwnInterests(type, link), {
        request: ActionTypes.REQUEST_OWN_INTERESTS,
        success: ActionTypes.REQUEST_OWN_INTERESTS_SUCCESS,
        failure: ActionTypes.REQUEST_OWN_INTERESTS_ERROR
    }, {userId});
}

export function resetOwnInterests(userId) {
    dispatch(ActionTypes.RESET_OWN_INTERESTS, {userId});
}

export function requestComparedInterests(userId, otherUserId, type, showOnlyCommon, link) {
    dispatchAsync(InterestsAPI.getComparedInterests(otherUserId, type, showOnlyCommon, link), {
        request: ActionTypes.REQUEST_COMPARED_INTERESTS,
        success: ActionTypes.REQUEST_COMPARED_INTERESTS_SUCCESS,
        failure: ActionTypes.REQUEST_COMPARED_INTERESTS_ERROR
    }, {userId, otherUserId});
}

export function requestNextOwnInterests(userId, link) {
    dispatch(ActionTypes.REQUEST_NEXT_OWN_INTERESTS, {userId});
    if (link) {
        requestOwnInterests(userId, null, link);
    }
}

export function requestNextComparedInterests(userId, otherUserId, link) {
    dispatch(ActionTypes.REQUEST_NEXT_COMPARED_INTERESTS, {userId, otherUserId});
    if (link) {
        requestComparedInterests(userId, otherUserId, null, null, link);
    }
}
