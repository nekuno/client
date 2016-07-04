import { register, waitFor } from '../dispatcher/Dispatcher';
import ActionTypes from '../constants/ActionTypes';
import * as Constants from '../constants/Constants';
import BaseStore from './BaseStore';
import ThreadStore from '../stores/ThreadStore';
import RecommendationStore from '../stores/RecommendationStore';
import {
    createIndexedListStore,
    createListActionHandler
} from '../utils/PaginatedStoreUtils';
import selectn from 'selectn';

class RecommendationsByThreadStore extends BaseStore {

    _position = [];
    _ids = [];
    _nextUrl = null;

    setReceivingClasses() {
        this._receivingClasses.push({
            'request': ActionTypes.REQUEST_RECOMMENDATIONS,
            'success': ActionTypes.REQUEST_RECOMMENDATIONS_SUCCESS,
            'error': ActionTypes.REQUEST_RECOMMENDATIONS_ERROR
        });
        this._receivingClasses.push({
            'request': ActionTypes.REQUEST_THREADS,
            'success': ActionTypes.REQUEST_THREADS_SUCCESS,
            'error': ActionTypes.REQUEST_THREADS_ERROR
        });
    }

    //TODO: Move to IndexedListStore (A by B store)
    setReceiving(action) {
        this._receiving[action.threadId] = true;
    }

    setReceivedSuccess(action) {
        this._receiving[action.threadId] = false;
        this._received[action.threadId] = true;
    }

    setReceivedError(action) {
        this._receiving[action.threadId] = false;
    }

    setInitial() {
        super.setInitial();
        this._position = [];
        this._ids = [];
    }

    //TODO: Move to IndexedListStore renaming to getElements(listId)
    getRecommendationsFromThread(threadId) {
        const thread = ThreadStore.get(threadId);
        if (!thread) {
            //Shouldn´t happen : UserActionCreators.requestRecommendation checks this
            return null;
        }

        return this._ids[threadId] ? this._ids[threadId] : [];
    }

    //TODO: Move to IndexedListStore (A by B store) renaming to elementsReceived
    recommendationsReceived(threadId) {
        return this._received[threadId] ? this._received[threadId] : false;
    }

    //TODO: Move to IndexedListStore (A by B store)
    setPosition(threadId, newPosition) {
        this._position[threadId] = newPosition;
    }

    //TODO: Move to IndexedListStore (A by B store)
    getPosition(threadId) {
        return this._position[threadId];
    }

    //TODO: Move to IndexedListStore (A by B store)
    advancePosition(threadId, number = 1) {
        this._position[threadId] += number;
    }

    _registerToActions(action) {

        waitFor([ThreadStore.dispatchToken, RecommendationStore.dispatchToken]);

        super._registerToActions(action);

        const { threadId } = action;
        switch (action.type) {
            case ActionTypes.REQUEST_RECOMMENDATIONS_SUCCESS:
                action.result.items.forEach((id) => {
                   this._ids[threadId].push(id);
                });
                this.emitChange();
                break;
            case ActionTypes.RECOMMENDATIONS_NEXT:
                this.advancePosition(threadId, 1);
                break;
            case ActionTypes.RECOMMENDATIONS_PREV:
                if (this.getPosition(threadId) > 0) {
                    this.advancePosition(threadId, -1);
                }
                break;
            case ActionTypes.UPDATE_THREAD:
                this._ids[threadId] = [];
                this.emitChange();
                break;
            case ActionTypes.REQUEST_THREADS_SUCCESS:
                const responseThreads = selectn('response.entities.thread', action);
                Object.keys(responseThreads).forEach((threadId) => {
                    const thread = responseThreads[threadId];
                    this._ids[threadId] = this._ids.hasOwnProperty(threadId) ? this._ids[threadId] : [];
                    Object.keys(thread.cached).forEach((value, index) => {
                        this._ids[threadId].push(index);
                    });
                    this._nextUrl = thread.recommendationUrl;
                });
                this.emitChange();
                break;
            default:
                break;
        }
    }
}

export default new RecommendationsByThreadStore();