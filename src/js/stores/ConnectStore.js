import ActionTypes from '../constants/ActionTypes';
import BaseStore from './BaseStore';

class ConnectStore extends BaseStore {

    constructor() {
        super();
        this.subscribe(() => this._registerToActions.bind(this));
        this._token = null;
        this._accessToken = null;
        this._resource = null;
        this._userId = null;

    }

    _registerToActions(action) {
        switch (action.type) {
            case ActionTypes.CONNECT_ACCOUNT:
                this._token = action.token;
                this._accessToken = action.accessToken;
                this._resource = action.resource;
                this._userId = action.userId;
                this.emitChange();
                break;

        }
    }

    get token() {
        return this._token;
    }

    get accessToken() {
        return this._accessToken;
    }

    get resource() {
        return this._resource;
    }

    get userId() {
        return this._userId;
    }

}

export default new ConnectStore();