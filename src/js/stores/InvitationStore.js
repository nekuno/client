import ActionTypes from '../constants/ActionTypes';
import BaseStore from './BaseStore';

class InvitationStore extends BaseStore {

    setInitial() {
        this._error = null;
        this._token = null;
        this._invitation = null;
        this._invitations = [];
        this._noInvitations = null;
        this._loadingInvitations = null;
    }

    _registerToActions(action) {
        super._registerToActions(action);
        switch (action.type) {

            case ActionTypes.REQUEST_VALIDATE_INVITATION_USER:
                this._error = null;
                this._token = null;
                this._invitation = null;
                this.emitChange();
                break;

            case ActionTypes.REQUEST_VALIDATE_INVITATION_USER_SUCCESS:
                this._error = null;
                this._token = action.response.invitation.token;
                this._invitation = action.response.invitation;
                this.emitChange();
                break;

            case ActionTypes.REQUEST_VALIDATE_INVITATION_USER_ERROR:
                this._error = action.error;
                this._token = null;
                this._invitation = null;
                this.emitChange();
                break;

            case ActionTypes.REQUEST_INVITATIONS:
                this._loadingInvitations = true;
                this.emitChange();
                break;

            case ActionTypes.REQUEST_INVITATIONS_SUCCESS:
                this._loadingInvitations = null;
                this._noInvitations = action.response.length > 0 ? null : true;
                this._invitations = action.response || [];
                this.emitChange();
                break;

            case ActionTypes.REQUEST_INVITATIONS_ERROR:
                this._loadingInvitations = null;
                this._noInvitations = true;
                this.emitChange();
                break;

            default:
                break;
        }
    }

    get token() {
        return this._token;
    }

    get invitation() {
        return this._invitation;
    }

    get error() {
        return this._error;
    }

    get invitations() {
        return this._invitations;
    }

    get noInvitations() {
        return this._noInvitations;
    }

    get loadingInvitations() {
        return this._loadingInvitations;
    }

}

export default new InvitationStore();