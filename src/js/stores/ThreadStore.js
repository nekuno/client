import { register } from '../dispatcher/Dispatcher';
import { createStore, mergeIntoBag, isInBag } from '../utils/StoreUtils';
import selectn from 'selectn';

const _threads = {};

const ThreadStore = createStore({
    contains(id, fields) {
        return isInBag(_threads, id, fields);
    },

    get(id) {

        if (!this.contains(id)){
            return null;
        }
        return _threads[id];
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
