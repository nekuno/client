import { register } from '../dispatcher/Dispatcher';
import { createStore, mergeIntoBag, isInBag } from '../utils/StoreUtils';
import selectn from 'selectn';

const _threads = {};

const ThreadStore = createStore({
    contains(name, fields) {
        return isInBag(_threads, name, fields);
    },

    get(name) {
        return _threads[name];
    },

    getAll() {
        return _threads;
    }
});

ThreadStore.dispatchToken = register(action => {
    const responseThreads = selectn('response.entities.thread', action);

    if (responseThreads) {
        mergeIntoBag(_threads, responseThreads);
        ThreadStore.emitChange();
    }
});

export default ThreadStore;
