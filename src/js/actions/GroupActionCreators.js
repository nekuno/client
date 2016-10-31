import { dispatchAsync, dispatch } from '../dispatcher/Dispatcher';
import ActionTypes from '../constants/ActionTypes';
import * as GroupAPI from '../api/GroupAPI';
import * as ThreadActionCreators from './ThreadActionCreators';

export function requestGroup(groupId) {
    return dispatchAsync(GroupAPI.requestGroup(groupId), {
        request: ActionTypes.REQUEST_GROUP,
        success: ActionTypes.REQUEST_GROUP_SUCCESS,
        failure: ActionTypes.REQUEST_GROUP_ERROR
    }, {groupId});
}

export function joinGroup(groupId) {
    return dispatchAsync(GroupAPI.joinGroup(groupId), {
        request: ActionTypes.JOIN_GROUP,
        success: ActionTypes.JOIN_GROUP_SUCCESS,
        failure: ActionTypes.JOIN_GROUP_ERROR
    }, {groupId}).then((data) => {
        ThreadActionCreators.requestThreads();
        return data;
    });
}

export function createGroup(data) {
    return dispatchAsync(GroupAPI.createGroup(data), {
        request: ActionTypes.CREATE_GROUP,
        success: ActionTypes.CREATE_GROUP_SUCCESS,
        failure: ActionTypes.CREATE_GROUP_ERROR
    }).then((data) => {
        ThreadActionCreators.requestThreads();
        return data;
    });
}

export function leaveGroup(groupId) {
    return dispatchAsync(GroupAPI.leaveGroup(groupId), {
        request: ActionTypes.LEAVE_GROUP,
        success: ActionTypes.LEAVE_GROUP_SUCCESS,
        failure: ActionTypes.LEAVE_GROUP_ERROR
    }).then((data) => {
        ThreadActionCreators.requestThreads();
        return data;
    });
}