import { REQUIRED_REGISTER_USER_FIELDS } from '../constants/Constants';
import RouterContainer from '../services/RouterContainer';
import ActionTypes from '../constants/ActionTypes';
import BaseStore from './BaseStore';
import jwt_decode from 'jwt-decode';
import {getValidationErrors} from '../utils/StoreUtils';

class LoginStore extends BaseStore {

    setInitial() {
        this._error = null;
        this._user = null;
        this._jwt = null;
        this._justLoggedout = false;
        this._initialRequiredUserQuestionsCount = 0;
        this._requiredUserQuestionsCount = 0;
        this._usernameAnswered = false;
    }

    _registerToActions(action) {

        switch (action.type) {

            case ActionTypes.AUTO_LOGIN:
                const jwt = action.jwt;
                if (jwt) {
                    const now = parseInt(((new Date()).getTime() / 1e3), 10);
                    const exp = jwt_decode(jwt).exp;
                    if (exp < now) {
                        console.log('jwt token expired on', (new Date(exp * 1e3).toString()));
                    } else {
                        this._jwt = jwt;
                        this._user = {id: jwt_decode(this._jwt).user.id};
                        console.log('Autologin success!');
                        this.emitChange();
                    }
                }
                break;

            case ActionTypes.REQUEST_LOGIN_USER:
                this._error = null;
                this.emitChange();
                break;

            case ActionTypes.REQUEST_LOGIN_USER_SUCCESS:
                this._error = null;
                this._jwt = action.response.jwt;
                this._user = jwt_decode(this._jwt).user;
                localStorage.setItem('jwt', this._jwt);
                this._setInitialRequiredUserQuestionsCount();
                this.emitChange();
                break;

            case ActionTypes.REQUEST_LOGIN_USER_ERROR:
                this._error = action.error;
                this.emitChange();
                break;

            case ActionTypes.LOGOUT_USER:
                this.setInitial();
                this._justLoggedout = true;
                localStorage.removeItem('jwt');

                const path = action.path;
                let history = RouterContainer.get();
                history.replaceState(null, path);

                this.emitChange();
                break;

            case ActionTypes.REQUEST_OWN_USER_SUCCESS:
                this._user = action.response;
                this._setInitialRequiredUserQuestionsCount();
                this.emitChange();
                break;

            case ActionTypes.EDIT_USER_SUCCESS:
                this._user = action.response.user;
                this._jwt = action.response.jwt;
                localStorage.setItem('jwt', this._jwt);
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

    get justLoggedOut() {
        const justLoggedOut = !!this._justLoggedout;
        this._justLoggedout = false;
        return justLoggedOut;
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
