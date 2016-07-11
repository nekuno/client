import { register, waitFor } from '../dispatcher/Dispatcher';
import { createStore, mergeIntoBag, isInBag } from '../utils/StoreUtils';
import selectn from 'selectn';
import ActionTypes from '../constants/ActionTypes';
import UserStore from './UserStore';
import { getValidationErrors } from '../utils/StoreUtils';

let _threads = {};
let _disabled = [];
let _errors = '';

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
    },

    getErrors() {
        return _errors;
    },

    deleteErrors() {
        _errors = '';
        this.emitChange();
    },

    isDisabled(threadId) {
        return _disabled[threadId] === true;
    },

    enable(threadId) {
        _disabled[threadId] = false;
    },

    disable(threadId) {
        _disabled[threadId] = true;
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
            let item = [action.response];
            let items = [];
            items[item[0].id] = item[0];
            mergeIntoBag(_threads, items);
            ThreadStore.disable(item[0].id);
            ThreadStore.emitChange();
            break;
        case ActionTypes.CREATE_THREAD_ERROR:
        case ActionTypes.UPDATE_THREAD_ERROR:
            if (action.error){
                _errors = getValidationErrors(action.error);
            }
            ThreadStore.disable(action.threadId);
            ThreadStore.emitChange();
            break;
        case ActionTypes.UPDATE_THREAD_SUCCESS:
            let update_item = [action.response];
            let update_items = [];
            update_items[update_item[0].id] = update_item[0];
            mergeIntoBag(_threads, update_items);
            ThreadStore.emitChange();
            break;
        case ActionTypes.DELETE_THREAD_SUCCESS:
            const threadId = [action.threadId];
            delete _threads[threadId];
            ThreadStore.emitChange();
            break;
        case ActionTypes.REQUEST_RECOMMENDATIONS_SUCCESS:
            ThreadStore.enable(action.threadId);
            ThreadStore.emitChange();
            break;
        case ActionTypes.LOGOUT_USER:
            _threads = {};
            _errors = '';
            break;
        default:
            break;
    }
});

export default ThreadStore;
