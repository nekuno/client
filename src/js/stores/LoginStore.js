import { REQUIRED_REGISTER_USER_FIELDS } from '../constants/Constants';
import RouterContainer from '../services/RouterContainer';
import ActionTypes from '../constants/ActionTypes';
import BaseStore from './BaseStore';
import jwt_decode from 'jwt-decode';
import { getValidationErrors } from '../utils/StoreUtils';
import LocalStorageService from '../services/LocalStorageService';

class LoginStore extends BaseStore {

    setInitial() {
        this._error = null;
        this._user = null;
        this._jwt = null;
        this._justLoggedout = false;
        this._initialRequiredUserQuestionsCount = 0;
        this._requiredUserQuestionsCount = 0;
        this._tryingToLogin = null;
    }

    _registerToActions(action) {
        switch (action.type) {

            case ActionTypes.AUTO_LOGIN:
                this._tryingToLogin = true;
                const jwt = action.jwt;
                if (jwt) {
                    const expired = this.isJwtExpired(jwt);
                    if (expired) {
                        console.log('jwt token expired on', (new Date(expired * 1e3).toString()));
                        this._tryingToLogin = false;
                        this.setInitial();
                        LocalStorageService.remove('jwt');
                    } else {
                        this._jwt = jwt;
                        this._user = {id: jwt_decode(this._jwt).user.id};
                        this._tryingToLogin = false;
                        console.log('Autologin success!');
                    }
                } else {
                    this._tryingToLogin = false;
                }
                this.emitChange();
                break;

            case ActionTypes.REQUEST_LOGIN_USER:
                this._error = null;
                this._tryingToLogin = true;
                this.emitChange();
                break;

            case ActionTypes.REQUEST_LOGIN_USER_SUCCESS:
                this._error = null;
                this.jwt = action.response.jwt;
                this._user = jwt_decode(this._jwt).user;
                this._tryingToLogin = false;
                this._setInitialRequiredUserQuestionsCount();
                this.emitChange();
                break;

            case ActionTypes.REQUEST_LOGIN_USER_ERROR:
                this._error = action.error;
                this._tryingToLogin = false;
                this.emitChange();
                break;

            case ActionTypes.LOGOUT_USER:
                this.setInitial();
                this._justLoggedout = true;
                LocalStorageService.remove('jwt');

                const path = action.path;
                let router = RouterContainer.get();
                router.replace(path);

                this.emitChange();
                break;

            case ActionTypes.REQUEST_OWN_USER_SUCCESS:
                this._user = action.response;
                this._setInitialRequiredUserQuestionsCount();
                this.emitChange();
                break;

            case ActionTypes.EDIT_USER_SUCCESS:
                this._user = action.response.user;
                this.jwt = action.response.jwt;
                this._requiredUserQuestionsCount++;
                this.emitChange();
                break;

            case ActionTypes.EDIT_USER_ERROR:
                this._error = getValidationErrors(action.error);
                this.emitChange();
                break;

            case ActionTypes.REQUEST_SET_PROFILE_PHOTO_SUCCESS:
                this._user = action.response;
                this.emitChange();
                break;

            case ActionTypes.SET_ENABLED_SUCCESS:
                let enabled = action.enabled;
                this._user['enabled'] = enabled;
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
        const error = this._error;
        this._error = null;
        return error;
    }

    get jwt() {
        return this._jwt;
    }

    set jwt(jwt) {
        this._jwt = jwt;
        LocalStorageService.set('jwt', jwt);
    }

    get justLoggedOut() {
        const justLoggedOut = !!this._justLoggedout;
        this._justLoggedout = false;
        return justLoggedOut;
    }

    get isTryingToLogin() {
        return this._tryingToLogin;
    }

    isLoggedIn() {
        return !!this._user;
    }

    isGuest() {
        return this.isLoggedIn() && this._user.username == 'guest'
    }

    isComplete() {
        let count = 0;
        REQUIRED_REGISTER_USER_FIELDS.forEach(field => {
            if (!(typeof this._user[field.name] !== 'undefined' && this._user[field.name])) {
                count++;
            }
        });

        return count === 0;
    }

    isEnabled() {
        return this._user.enabled == true;
    }

    getInitialRequiredUserQuestionsCount() {
        return this._initialRequiredUserQuestionsCount;
    }

    getRequiredUserQuestionsCount() {
        return this._requiredUserQuestionsCount;
    }

    isJwtExpired(jwt)
    {
        if (typeof jwt != 'string' || jwt == 'true'){
            return true;
        }

        const jwtDecoded = jwt_decode(jwt);

        if (!jwtDecoded.hasOwnProperty('exp')){
            return true;
        }
        const exp = jwt_decode(jwt).exp;
        const now = parseInt(((new Date()).getTime() / 1e3), 10);

        return now > exp ? exp : false;
    }

    getNextRequiredUserField() {
        return REQUIRED_REGISTER_USER_FIELDS.find(field =>
            !(typeof this._user[field.name] !== 'undefined' && this._user[field.name])
        ) || null;
    }

    _setInitialRequiredUserQuestionsCount() {
        let count = 0;
        REQUIRED_REGISTER_USER_FIELDS.forEach(field => {
            if (!(typeof this._user[field.name] !== 'undefined' && this._user[field.name])) {
                count++;
            }
        });

        this._initialRequiredUserQuestionsCount = count;
    }
}

export default new LoginStore();
