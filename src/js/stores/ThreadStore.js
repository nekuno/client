import { register, waitFor } from '../dispatcher/Dispatcher';
import { createStore } from '../utils/StoreUtils';
import ActionTypes from '../constants/ActionTypes';
import UserStore from './UserStore';
import RecommendationStore from './RecommendationStore';
import { getValidationErrors } from '../utils/StoreUtils';

let _threads = [];
let _categories = null;
let _disabled = [];
let _errors = '';

const ThreadStore = createStore({
    contains(id) {
        return _threads.length > 0 && _threads.some(thread => thread && thread.id == id);
    },

    get(id) {
        if (!this.contains(id)) {
            return {};
        }
        return _threads.find(thread => thread && thread.id == id);
    },

    getAll() {
        return _threads;
    },

    getByGroup(groupId) {
        return _threads.find(thread => thread && thread.groupId == groupId);
    },

    getMainDiscoverThread() {
        return _threads.find((thread) => {
                let items = RecommendationStore.get(thread.id) || [];
                return items.length > 0 && thread.category === 'ThreadUsers' && thread.groupId === null;
            }) || _threads.find((thread) => {
                return thread.category === 'ThreadUsers' && thread.groupId === null;
            }) || {};
    },

    noThreads() {
        return this.getAll().length === 0
    },

    isAnyPopular() {
        return _threads.length > 0 && _threads.some(thread => thread && RecommendationStore.arePopularRecommendations(thread.id)) || false;
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

    addThread(thread) {
        _threads.push(thread);
        _threads = _threads.sort((threadA, threadB) => threadA.updatedAt - threadB.updatedAt).reverse();
    },

    sort() {
        _threads = _threads.sort((threadA, threadB) => threadA.updatedAt - threadB.updatedAt).reverse();
    },
});

ThreadStore.dispatchToken = register(action => {
    waitFor([UserStore.dispatchToken]);
    let response = action.response;
    switch (action.type) {
        case ActionTypes.REQUEST_CATEGORIES_SUCCESS:
            _categories = response.filters;
            ThreadStore.emitChange();
            break;
        case ActionTypes.CREATE_THREAD_SUCCESS:
            ThreadStore.addThread(response);
            ThreadStore.disable(response.id);
            ThreadStore.emitChange();
            break;
        case ActionTypes.CREATE_DEFAULT_THREADS_SUCCESS:
            _threads = response;
            _threads.forEach(thread => ThreadStore.disable(thread.id));
            ThreadStore.emitChange();
            break;
        case ActionTypes.REQUEST_THREADS_SUCCESS:
            const threads = response.items;
            if (threads) {
                _threads = threads;
                ThreadStore.sort();
            }
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
            _threads.forEach((thread, index) => {
                if (thread.id == action.threadId) {
                    _threads[index] = response;
                }
            });
            ThreadStore.disable(action.threadId);
            ThreadStore.emitChange();
            break;
        case ActionTypes.DELETE_THREAD:
            let threadId = action.threadId;
            ThreadStore.get(threadId).deleting = true;
            ThreadStore.emitChange();
            break;
        case ActionTypes.DELETE_THREAD_SUCCESS:
            _threads.forEach((thread, index) => {
                if (thread.id == action.threadId) {
                    _threads.splice(index, 1);
                }
            });
            ThreadStore.emitChange();
            break;
        case ActionTypes.REQUEST_RECOMMENDATIONS_SUCCESS:
            ThreadStore.enable(action.threadId);
            let thread = ThreadStore.get(action.threadId);
            thread.totalResults = action.response.pagination.total;
            ThreadStore.emitChange();
            break;
        case ActionTypes.LOGOUT_USER:
            _threads = [];
            _errors = '';
            ThreadStore.emitChange();
            break;
        default:
            break;
    }
});

export default ThreadStore;
