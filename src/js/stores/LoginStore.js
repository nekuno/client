import { REQUIRED_REGISTER_USER_FIELDS } from '../constants/Constants';
import RouterContainer from '../services/RouterContainer';
import ActionTypes from '../constants/ActionTypes';
import BaseStore from './BaseStore';
import jwt_decode from 'jwt-decode';
import {getValidationErrors} from '../utils/StoreUtils';
import LocalStorageService from '../services/LocalStorageService';

class LoginStore extends BaseStore {

    setInitial() {
        this._error = null;
        this._user = null;
        this._jwt = null;
        this._justLoggedout = false;
        this._initialRequiredUserQuestionsCount = 0;
        this._requiredUserQuestionsCount = 0;
        this._usernameAnswered = false;
        this._tryingToLogin = null;
    }

    _registerToActions(action) {

        switch (action.type) {

            case ActionTypes.AUTO_LOGIN:
                this._tryingToLogin = true;
                const jwt = action.jwt;
                if (jwt) {
                    const now = parseInt(((new Date()).getTime() / 1e3), 10);
                    const exp = jwt_decode(jwt).exp;
                    if (exp < now) {
                        console.log('jwt token expired on', (new Date(exp * 1e3).toString()));
                        this._tryingToLogin = false;
                    } else {
                        this._jwt = jwt;
                        this._user = {id: jwt_decode(this._jwt).user.id};
                        this._tryingToLogin = false;
                        console.log('Autologin success!');
                        this.emitChange();
                    }
                } else {
                    this._tryingToLogin = false;
                }
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
                this._usernameAnswered = true;
                this._requiredUserQuestionsCount++;
                this.emitChange();
                break;

            case ActionTypes.EDIT_USER_ERROR:
                this._error = getValidationErrors(action.error);
                this.emitChange();
                break;

            case ActionTypes.USERNAME_ANSWERED:
                this._usernameAnswered = true;
                this.emitChange();
                break;

            case ActionTypes.REQUEST_SET_PROFILE_PHOTO_SUCCESS:
                this._user = action.response;
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

    getInitialRequiredUserQuestionsCount() {
        return this._initialRequiredUserQuestionsCount;
    }

    getRequiredUserQuestionsCount() {
        return this._requiredUserQuestionsCount;
    }

    isUsernameAnswered() {
        return this._usernameAnswered;
    }

    getNextRequiredUserField() {
        return this.isUsernameAnswered() ? REQUIRED_REGISTER_USER_FIELDS.find(field =>
            !(typeof this._user[field.name] !== 'undefined' && this._user[field.name])
        ) || null : {name: 'username'};
    }

    _setInitialRequiredUserQuestionsCount() {
        let count = 1; // Username also counts although it's set
        REQUIRED_REGISTER_USER_FIELDS.forEach(field => {
            if (!(typeof this._user[field.name] !== 'undefined' && this._user[field.name])) {
                count++;
            }
        });

        this._initialRequiredUserQuestionsCount = count;
    }
}

export default new LoginStore();
