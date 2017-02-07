import ActionTypes from '../constants/ActionTypes';
import { register } from '../dispatcher/Dispatcher';
import { createStore, mergeIntoBag, isInBag } from '../utils/StoreUtils';
import selectn from 'selectn';

let _users = {};
let _error = null;

const UserStore = createStore({
    contains(userId, fields) {
        return isInBag(_users, userId, fields);
    },

    get(userId) {
        return _users[userId];
    },

    containsSlug(slug, fields) {
        const index = Object.keys(_users).find(userId => _users[userId].slug === slug);
        return isInBag(_users, index, fields);
    },

    getBySlug(slug) {
        const index = Object.keys(_users).find(userId => _users[userId].slug === slug);
        return index && index > -1 ? _users[index] : null;
    },

    getError() {
        let error = _error;
        _error = null;

        return error;
    }
});

UserStore.dispatchToken = register(action => {
    const responseUsers = selectn('response.entities.users', action);
    if (responseUsers) {
        mergeIntoBag(_users, responseUsers);
        UserStore.emitChange();
    }
    switch(action.type) {
        case ActionTypes.REQUEST_PUBLIC_USER_ERROR:
            _error = action.error.error;
            UserStore.emitChange();
            break;
        case ActionTypes.LOGOUT_USER:
            _users = {};
            break;

        default:
            break;
    }
});

export default UserStore;
