import RouterContainer from '../services/RouterContainer';
import ActionTypes from '../constants/ActionTypes';
import BaseStore from './BaseStore';
import jwt_decode from 'jwt-decode';

class LoginStore extends BaseStore {

    constructor() {
        super();
        this.subscribe(() => this._registerToActions.bind(this));
        this._error = null;
        this._user = null;
        this._jwt = null;
        this._justLoggedout = false;
    }

    _registerToActions(action) {

        switch (action.type) {

            case ActionTypes.AUTO_LOGIN:
                const jwt = action.jwt;
                if (jwt) {
                    this._jwt = jwt;
                    this._user = jwt_decode(this._jwt).user;
                    console.log('Autologin success!');
                    this.emitChange();
                }
                break;

            case ActionTypes.REQUEST_LOGIN_USER:
                this._error = null;
                this.emitChange();
                break;

            case ActionTypes.REQUEST_LOGIN_USER_SUCCESS:
                this._error = null;
                this._jwt = action.response.jwt;
                localStorage.setItem('jwt', this._jwt);
                this._user = jwt_decode(this._jwt).user;
                this.emitChange();
                break;

            case ActionTypes.REQUEST_LOGIN_USER_ERROR:
                this._error = action.error;
                this.emitChange();
                break;

            case ActionTypes.LOGOUT_USER:
                this._error = null;
                this._user = null;
                this._jwt = null;
                this._justLoggedout = true;
                localStorage.removeItem('jwt');

                const path = action.path;
                let history = RouterContainer.get();
                history.replaceState(null, path);

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
        return this._error;
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
}

export default new LoginStore();
