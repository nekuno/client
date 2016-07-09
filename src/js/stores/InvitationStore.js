import ActionTypes from '../constants/ActionTypes';
import BaseStore from './BaseStore';

class InvitationStore extends BaseStore {

    setInitial() {
        this._error = null;
        this._token = null;
        this._invitation = null;
    }

    _registerToActions(action) {
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

}

export default new InvitationStore();