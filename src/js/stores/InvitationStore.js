import ActionTypes from '../constants/ActionTypes';
import BaseStore from './BaseStore';

class InvitationStore extends BaseStore {

    constructor() {
        super();
        this.subscribe(() => this._registerToActions.bind(this));
        this._requesting = false;
        this._error = null;
        this._token = null;
    }

    _registerToActions(action) {
        switch (action.type) {

            case ActionTypes.REQUEST_VALIDATE_INVITATION_USER:
                this._requesting = true;
                this._error = null;
                this.emitChange();
                break;

            case ActionTypes.REQUEST_VALIDATE_INVITATION_USER_SUCCESS:
                this._requesting = false;
                this._error = null;
                this._token = action.response.invitation.token;
                this.emitChange();
                break;

            case ActionTypes.REQUEST_VALIDATE_INVITATION_USER_ERROR:
                this._requesting = false;
                this._error = action.error;
                this.emitChange();
                break;

            default:
                break;
        }
    }

    get token() {
        return this._token;
    }

    get error() {
        return this._error;
    }

    requesting() {
        return this._requesting;
    }

}

export default new InvitationStore();