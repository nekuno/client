import ActionTypes from '../constants/ActionTypes';
import { mergeIntoBag, isInBag } from '../utils/StoreUtils';
import BaseStore from './BaseStore';
import selectn from 'selectn';
import { API_URLS } from '../constants/Constants';

class LikedUsersStore extends BaseStore {

    setInitial() {
        super.setInitial();
        this._ownUsers = [];
        this._isLoading = false;
        this._nextUrl = '';
    }


    _registerToActions(action) {
        super._registerToActions(action);

        let responseUsers = {};
        switch(action.type) {
            case ActionTypes.REQUEST_OWN_LIKED_USERS:
                this._isLoading = true;
                this.emitChange();
                break;
            case ActionTypes.REQUEST_OWN_LIKED_USERS_SUCCESS:
                responseUsers = selectn('response.items', action);
                const pagination = action.response.pagination;
                this._nextUrl = pagination.nextLink;
                mergeIntoBag(this._ownUsers, responseUsers);
                this._isLoading = false;
                this.emitChange();
                break;
            case ActionTypes.REQUEST_OWN_LIKED_USERS_ERROR:
                this._isLoading = false;
                this.emitChange();
                break;
            default:
                break;
        }
    }

    get() {
        return this._ownUsers;
    }

    isLoading() {
        return this._isLoading;
    }

    getRequestUrl() {
        return this._nextUrl !== '' ? this._nextUrl : API_URLS.OWN_LIKED_USERS;
    }
}

export default new LikedUsersStore();
