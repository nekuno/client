import { register } from '../dispatcher/Dispatcher';
import { createStore, mergeIntoBag, isInBag } from '../utils/StoreUtils';
import selectn from 'selectn';

const _users = {};

const UserStore = createStore({
    contains(userId, fields) {
        return isInBag(_users, userId, fields);
    },

    get(userId) {
        return _users[userId];
    }
});

UserStore.dispatchToken = register(action => {
    const responseUsers = selectn('response.entities.users', action);
    if (responseUsers) {
        mergeIntoBag(_users, responseUsers);
        UserStore.emitChange();
    }
});

export default UserStore;
