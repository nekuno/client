import { register, waitFor } from '../dispatcher/Dispatcher';
import { createStore, mergeIntoBag, isInBag } from '../utils/StoreUtils';
import selectn from 'selectn';
import ActionTypes from '../constants/ActionTypes';
import UserStore from './UserStore';

const _threads = {};

const ThreadStore = createStore({
    contains(id, fields) {
        return isInBag(_threads, id, fields);
    },

    get(id) {

        if (!this.contains(id)){
            return {};
        }
        return _threads[id];
    },

    getAll() {
        return _threads;
    }
});

ThreadStore.dispatchToken = register(action => {
    waitFor([UserStore.dispatchToken]);
    const responseThreads = selectn('response.entities.thread', action);

    if (responseThreads) {
        mergeIntoBag(_threads, responseThreads);
        ThreadStore.emitChange();
    }

    switch(action.type){
        case ActionTypes.CREATE_THREAD_SUCCESS:
            let items = [action.response];
            mergeIntoBag(_threads, items);
            ThreadStore.emitChange();
            break;
        case ActionTypes.UPDATE_THREAD_SUCCESS:
            let update_item = [action.response];
            mergeIntoBag(_threads, update_item);
            ThreadStore.emitChange();
            break;
        case ActionTypes.DELETE_THREAD_SUCCESS:
            const threadId = [action.response.threadId];
            delete _threads[threadId];
            ThreadStore.emitChange();
            break;
        default:
            break;
    }
});

export default ThreadStore;
