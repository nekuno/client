import ActionTypes from '../constants/ActionTypes';
import { mergeIntoBag, isInBag } from '../utils/StoreUtils';
import BaseStore from './BaseStore';
import selectn from 'selectn';

class UserStore extends BaseStore {

    setInitial() {
        this._users = {};
        this._error = null;
    }

    _registerToActions(action) {
        super._registerToActions(action);

        let responseUsers = {};
        switch(action.type) {
            case ActionTypes.REQUEST_OWN_USER_SUCCESS:
            case ActionTypes.EDIT_USER_SUCCESS:
            case ActionTypes.REQUEST_USER_SUCCESS:
            case ActionTypes.REQUEST_PUBLIC_USER_SUCCESS:
                responseUsers = selectn('response.entities.users', action);
                mergeIntoBag(this._users, responseUsers);
                this.emitChange();
                break;
            case ActionTypes.REQUEST_PUBLIC_USER_ERROR:
                this._error = action.error.error;
                this.emitChange();
                break;
            case ActionTypes.REQUEST_AUTOLOGIN_SUCCESS:
                const userId = action.response.user.id;
                responseUsers[userId] = action.response.user;
                mergeIntoBag(this._users, responseUsers);
                this.emitChange();
                break;
            default:
                break;
        }
    }

    contains(userId, fields) {
        return isInBag(this._users, userId, fields);
    }

    get(userId) {
        return this._users[userId];
    }

    containsSlug(slug, fields) {
        const index = Object.keys(this._users).find(userId => this._users[userId].slug === slug);
        return isInBag(this._users, index, fields);
    }

    getBySlug(slug) {
        const index = Object.keys(this._users).find(userId => this._users[userId].slug === slug);
        return index && index > -1 ? this._users[index] : null;
    }

    getError() {
        let error = this._error;
        this._error = null;

        return error;
    }

}

export default new UserStore();
