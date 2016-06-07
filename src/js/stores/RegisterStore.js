import ActionTypes from '../constants/ActionTypes';
import BaseStore from './BaseStore';

class RegisterStore extends BaseStore {

    setInitial() {
        this._validUsername = true;
        this._user = null;
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
                this._user = action.response.user;
                this._error = null;
                this.emitChange();
                break;

            case ActionTypes.REQUEST_REGISTER_USER_ERROR:
                this._error = action.error;
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

    get user() {
        return this._user;
    }

    get error() {
        let error = this._error;
        this._error = null;
        return error;
    }

    deleteUser() {
        this._user = null;
    }

}

export default new RegisterStore();
