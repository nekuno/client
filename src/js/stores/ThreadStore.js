import { register, waitFor } from '../dispatcher/Dispatcher';
import { createStore, mergeIntoBag, isInBag } from '../utils/StoreUtils';
import selectn from 'selectn';
import ActionTypes from '../constants/ActionTypes';
import UserStore from './UserStore';
import { getValidationErrors } from '../utils/StoreUtils';

let _threads = {};
let _categories = null;
let _disabled = [];
let _errors = '';
let _skipping = [];

const ThreadStore = createStore({
    contains(id, fields) {
        return isInBag(_threads, id, fields);
    },

    get(id) {
        if (!this.contains(id)) {
            return [];
        }
        return _threads[id];
    },

    getAll() {
        return _threads;
    },

    getCategories(){
        return _categories;
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
    },

    skipNext(threadId) {
        _skipping[threadId] = true;
    },

    mustSkip(threadId) {
        let must = _skipping[threadId] === true;
        _skipping[threadId] = false;
        return must;
    }
});

ThreadStore.dispatchToken = register(action => {
    waitFor([UserStore.dispatchToken]);
    const responseThreads = selectn('response.entities.thread', action);

    if (responseThreads) {
        Object.keys(responseThreads).forEach((index) => {
            const thread = responseThreads[index];
            if (ThreadStore.mustSkip(thread.id)) {
                delete responseThreads[index]
            }
        });
        mergeIntoBag(_threads, responseThreads);
        ThreadStore.emitChange();
    }

    let item = [action.response];
    let items = [];
    switch (action.type) {
        case ActionTypes.REQUEST_CATEGORIES_SUCCESS:
            _categories = action.response.filters;
            ThreadStore.emitChange();
            break;
        case ActionTypes.CREATE_THREAD_SUCCESS:
            items[item[0].id] = item[0];
            mergeIntoBag(_threads, items);
            ThreadStore.disable(item[0].id);
            ThreadStore.emitChange();
            break;
        case ActionTypes.CREATE_DEFAULT_THREADS_SUCCESS:
            item[0].forEach((thread) => {
                items[thread.id] = thread;
            });
            mergeIntoBag(_threads, items);
            ThreadStore.disable(item[0].id);
            ThreadStore.emitChange();
            break;
        case ActionTypes.CREATE_THREAD_ERROR:
        case ActionTypes.UPDATE_THREAD_ERROR:
            if (action.error) {
                _errors = getValidationErrors(action.error);
            }
            ThreadStore.emitChange();
            break;
        case ActionTypes.UPDATE_THREAD_SUCCESS:
            let update_item = [action.response];
            let update_items = [];
            update_items[update_item[0].id] = update_item[0];
            mergeIntoBag(_threads, update_items);
            ThreadStore.disable(action.threadId);
            ThreadStore.emitChange();
            break;
        case ActionTypes.DELETE_THREAD:
            let threadId = action.threadId;
            _threads[threadId].deleting = true;
            ThreadStore.emitChange();
            break;
        case ActionTypes.DELETE_THREAD_SUCCESS:
            threadId = action.threadId;
            delete _threads[threadId];
            ThreadStore.emitChange();
            break;
        case ActionTypes.REQUEST_RECOMMENDATIONS_SUCCESS:
            ThreadStore.enable(action.threadId);
            let thread = ThreadStore.get(action.threadId);
            thread.totalResults = action.response.result.pagination.total;
            ThreadStore.skipNext(action.threadId);
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
