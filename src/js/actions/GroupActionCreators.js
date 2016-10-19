import { dispatchAsync, dispatch } from '../dispatcher/Dispatcher';
import ActionTypes from '../constants/ActionTypes';
import * as GroupAPI from '../api/GroupAPI';

export function joinGroup(groupId) {
    return dispatchAsync(GroupAPI.joinGroup(groupId), {
        request: ActionTypes.JOIN_GROUP,
        success: ActionTypes.JOIN_GROUP_SUCCESS,
        failure: ActionTypes.JOIN_GROUP_ERROR
    }, {groupId});
}

export function createGroup(data) {
    return dispatchAsync(GroupAPI.createGroup(data), {
        request: ActionTypes.CREATE_GROUP,
        success: ActionTypes.CREATE_GROUP_SUCCESS,
        failure: ActionTypes.CREATE_GROUP_ERROR
    });
}