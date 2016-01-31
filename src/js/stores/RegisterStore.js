import ActionTypes from '../constants/ActionTypes';
import BaseStore from './BaseStore';

class RegisterStore extends BaseStore {

    constructor() {
        super();
        this.subscribe(() => this._registerToActions.bind(this));
        this._requesting = false;
        this._error = null;
        this._user = null;
    }

    _registerToActions(action) {

        switch (action.type) {

            case ActionTypes.REQUEST_REGISTER_USER:
                this._requesting = true;
                this._error = null;
                this.emitChange();
                break;

            case ActionTypes.REQUEST_REGISTER_USER_SUCCESS:
                this._requesting = false;
                this._error = null;
                this._user = action.response.user;
                this.emitChange();
                break;

            case ActionTypes.REQUEST_REGISTER_USER_ERROR:
                this._requesting = false;
                this._error = action.error;
                this.emitChange();
                break;

            default:
                break;
        }
    }

    get user() {
        return this._user;
    }

    get error() {
        let error = this._error;
        this._error = null;
        return error;
    }

    requesting() {
        return this._requesting;
    }

}

export default new RegisterStore();
