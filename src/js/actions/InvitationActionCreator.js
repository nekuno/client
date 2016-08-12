import { dispatchAsync } from '../dispatcher/Dispatcher';
import ActionTypes from '../constants/ActionTypes';
import * as InvitationAPI from '../api/InvitationAPI';

export function requestInvitations() {
    dispatchAsync(InvitationAPI.getInvitations(), {
        request: ActionTypes.REQUEST_INVITATIONS,
        success: ActionTypes.REQUEST_INVITATIONS_SUCCESS,
        failure: ActionTypes.REQUEST_INVITATIONS_ERROR
    });
}

