import { waitFor } from '../dispatcher/Dispatcher';
import ActionTypes from '../constants/ActionTypes';
import BaseStore from './BaseStore';
import UserStore from './UserStore';
import RecommendationStore from './RecommendationStore';
import { getValidationErrors } from '../utils/StoreUtils';
import LoginStore from "./LoginStore";

class ThreadStore extends BaseStore {

    setInitial() {
        this._threads = [];
        this._categories = null;
        this._disabled = [];
        this._errors = '';
        this._editThreadUrl = 'edit-thread/{threadId}';
        this._isRequesting = false;
    }

    _registerToActions(action) {
        waitFor([UserStore.dispatchToken]);
        super._registerToActions(action);
        let response = action.response;
        switch (action.type) {
            case ActionTypes.REQUEST_CATEGORIES_SUCCESS:
                this._categories = response.filters;
                this.emitChange();
                break;
            case ActionTypes.CREATE_THREAD_SUCCESS:
                this.addThread(response);
                this.disable(response.id);
                this.emitChange();
                break;
            case ActionTypes.REQUEST_THREADS:
                this._isRequesting = true;
                this.emitChange();
                break;
            case ActionTypes.REQUEST_THREADS_SUCCESS:
                const threads = response.items;
                if (threads) {
                    this._threads = threads;
                    this.sort();
                }
                this._isRequesting = false;
                this.emitChange();
                break;
            case ActionTypes.REQUEST_THREADS_ERROR:
                this._isRequesting = false;
                this.emitChange();
                break;
            case ActionTypes.CREATE_THREAD_ERROR:
            case ActionTypes.UPDATE_THREAD_ERROR:
                if (action.error) {
                    this._errors = getValidationErrors(action.error);
                }
                this.emitChange();
                break;
            case ActionTypes.UPDATE_THREAD_SUCCESS:
                this._threads.forEach((thread, index) => {
                    if (thread.id === action.threadId) {
                        this._threads[index] = response;
                    }
                });
                this.disable(action.threadId);
                this.emitChange();
                break;
            case ActionTypes.DELETE_THREAD:
                let threadId = action.threadId;
                this.get(threadId).deleting = true;
                this.emitChange();
                break;
            case ActionTypes.DELETE_THREAD_SUCCESS:
                this._threads.forEach((thread, index) => {
                    if (thread.id == action.threadId) {
                        this._threads.splice(index, 1);
                    }
                });
                this.emitChange();
                break;
            case ActionTypes.REQUEST_RECOMMENDATIONS_SUCCESS:
                this.enable(action.threadId);
                let thread = this.get(action.threadId);
                thread.totalResults = action.response.pagination.total;
                this.emitChange();
                break;

            default:
                break;
        }
    }

    contains(id) {
        return this._threads.length > 0 && this._threads.some(thread => thread && thread.id == id);
    }

    get(id) {
        if (!this.contains(id)) {
            return {};
        }
        return this._threads.find(thread => thread && thread.id == id);
    }

    getAll() {
        return this._threads;
    }

    getByGroup(groupId) {
        return this._threads.find(thread => thread && thread.groupId == groupId);
    }

    getMainDiscoverThread() {
        return this._threads.find((thread) => {
                let items = RecommendationStore.get(thread.id) || [];
                return items.length > 0 && thread.category === 'ThreadUsers' && !thread.groupId;
            }) || this._threads.find((thread) => {
                return thread.category === 'ThreadUsers' && !thread.groupId;
            }) || {};
    }

    getEditThreadUrl(threadId) {
        return this._editThreadUrl.replace('{threadId}', threadId);
    }

    isRequesting() {
        return this._isRequesting;
    }

    noThreads() {
        return this.getAll().length === 0
    }

    isAnyPopular() {
        return this._threads.length > 0 && this._threads.some(thread => thread && RecommendationStore.arePopularRecommendations(thread.id)) || false;
    }

    getCategories(){
        return this._categories;
    }

    getErrors() {
        let errors = this._errors;
        this._errors = '';
        return errors;
    }

    isDisabled(threadId) {
        return this._disabled[threadId] === true;
    }

    enable(threadId) {
        this._disabled[threadId] = false;
    }

    disable(threadId) {
        this._disabled[threadId] = true;
    }

    addThread(thread) {
        this._threads.push(thread);
        this._threads = this._threads.sort((threadA, threadB) => threadA.updatedAt - threadB.updatedAt).reverse();
    }

    sort() {
        this._threads = this._threads.sort((threadA, threadB) => threadA.updatedAt - threadB.updatedAt).reverse();
    }

    getOwnDefault() {
        const ownThreads = this._threads;
        console.log('ownThreads');
        console.log(ownThreads);

        return ownThreads === undefined ? null : ownThreads.find(thread => thread.default === true);
    }
}

export default new ThreadStore();
