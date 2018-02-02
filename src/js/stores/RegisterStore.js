//TODO: REQUEST_REGISTER errors are no longer displayed, so they can be removed

import ActionTypes from '../constants/ActionTypes';
import BaseStore from './BaseStore';
import { mergeIntoBag } from '../utils/StoreUtils';
import { getValidationErrors } from '../utils/StoreUtils';

class RegisterStore extends BaseStore {

    setInitial() {
        this._validUsername = true;
        this._error = null;
        this._user = null;
        this._profile = null;
        this._token = null;
        this._oauth = null;
    }

    _registerToActions(action) {
        super._registerToActions(action);

        let profile;
        switch (action.type) {
            case ActionTypes.PRE_REGISTER_PROFILE:
                profile = action.profile || {};
                this._profile = this._profile || {};
                mergeIntoBag(this._profile, profile);
                this._token = 'join';
                this._error = null;
                this.emitChange();
                break;

            case ActionTypes.PRE_REGISTER_USER:
                const {user, token, oauth} = action;
                profile = action.profile || {};
                this._profile = this._profile || {};
                mergeIntoBag(this._profile, profile);
                this._user = user;
                this._token = token || this._token;
                this._oauth = oauth;
                this._error = null;
                this.emitChange();
                break;

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

    getData() {
        return {
            user: this._user,
            profile: this._profile,
            token: this._token,
            oauth: this._oauth
        }
    }

    get profile() {
        return this._profile;
    }

    get error() {
        let error = this._error;
        this._error = null;
        return error;
    }
}

export default new RegisterStore();
