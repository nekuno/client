//TODO: REQUEST_REGISTER errors are no longer displayed, so they can be removed

import ActionTypes from '../constants/ActionTypes';
import BaseStore from './BaseStore';
import { getValidationErrors } from '../utils/StoreUtils';

class RegisterStore extends BaseStore {

    setInitial() {
        this._validUsername = true;
        this._error = null;
    }

    _registerToActions(action) {
        super._registerToActions(action);

        switch (action.type) {

            case ActionTypes.REQUEST_REGISTER_USER:
                this._error = null;
                this.emitChange();
                break;

            case ActionTypes.REQUEST_REGISTER_USER_SUCCESS:
                this._error = null;
                this.emitChange();
                break;

            case ActionTypes.REQUEST_REGISTER_USER_ERROR:
                this._error = getValidationErrors(action.error);
                this.emitChange();
                break;

            case ActionTypes.REQUEST_VALIDATE_USERNAME:
                this._validUsername = true;
                this.emitChange();
                break;

            case ActionTypes.REQUEST_VALIDATE_USERNAME_SUCCESS:
                this._validUsername = true;
                this.emitChange();
                break;

            case ActionTypes.REQUEST_VALIDATE_USERNAME_ERROR:
                this._validUsername = false;
                this.emitChange();
                break;

            default:
                break;
        }
    }

    validUsername() {
        let valid = this._validUsername;
        this._validUsername = true;
        return valid;
    }

    get error() {
        let error = this._error;
        this._error = null;
        return error;
    }
}

export default new RegisterStore();
