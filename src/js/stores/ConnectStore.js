import ActionTypes from '../constants/ActionTypes';
import BaseStore from './BaseStore';

class ConnectStore extends BaseStore {

   setInitial() {
        this._token = null;
        this._accessToken = null;
        this._resource = null;
        this._resourceId = null;
        this._expireTime = null;
        this._profile = null;
    }

    _registerToActions(action) {
        super._registerToActions(action);

        switch (action.type) {
            case ActionTypes.CONNECT_REGISTER_ACCOUNT:
                this._token = action.token;
                this._accessToken = action.accessToken;
                this._resource = action.resource;
                this._resourceId = action.resourceId;
                this._expireTime = action.expireTime;
                this._profile = action.profile;
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

    get resourceId() {
        return this._resourceId;
    }

    get expireTime() {
        return this._expireTime;
    }

    get profile() {
        return this._profile;
    }

}

export default new ConnectStore();