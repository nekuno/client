import { register, waitFor } from '../dispatcher/Dispatcher';
import ActionTypes from '../constants/ActionTypes';
import * as Constants from '../constants/Constants';
import IndexedListStore from '../stores/IndexedListStore';
import ThreadStore from '../stores/ThreadStore';
import RecommendationStore from '../stores/RecommendationStore';
import {
    createIndexedListStore,
    createListActionHandler
} from '../utils/PaginatedStoreUtils';
import selectn from 'selectn';

class RecommendationsByThreadStore extends IndexedListStore {

    _nextUrl = [];

    getNextPageUrl(threadId) {
        return this._nextUrl[threadId];
    }

    setReceivingClasses() {
        this._receivingClasses.push({
            'request': {'type': ActionTypes.REQUEST_RECOMMENDATIONS, 'listId': 'threadId'},
            'success': {'type': ActionTypes.REQUEST_RECOMMENDATIONS_SUCCESS, 'listId': 'threadId'},
            'error': {'type': ActionTypes.REQUEST_RECOMMENDATIONS_ERROR, 'listId': 'threadId'}
        });
        this._receivingClasses.push({
            'request': {'type': ActionTypes.REQUEST_THREADS, 'listId': null},
            'success': {'type': ActionTypes.REQUEST_THREADS_SUCCESS, 'listId': {'array': 'response.result.items'}},
            'error': {'type': ActionTypes.REQUEST_THREADS_ERROR, 'listId': null}
        });
    }

    getRecommendationsFromThread(threadId) {
        const thread = ThreadStore.get(threadId);
        if (!thread) {
            //Shouldn´t happen : UserActionCreators.requestRecommendation checks this
            return null;
        }

        return this.getElements(threadId);
    }

    _registerToActions(action) {

        waitFor([ThreadStore.dispatchToken, RecommendationStore.dispatchToken]);

        super._registerToActions(action);

        const { threadId } = action;
        switch (action.type) {
            case ActionTypes.REQUEST_RECOMMENDATIONS_SUCCESS:
                action.response.result.items.forEach((id) => {
                    const thread = ThreadStore.get(threadId);
                    const {positioner, elementId} = RecommendationStore.getRecommendationId(action.response.entities.recommendation[id], thread.category);
                    this.insertId(threadId, elementId, positioner);
                    this._nextUrl[threadId] = action.response.result.pagination.nextLink;
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
                    Object.keys(thread.cached).forEach((value) => {
                        const {elementId, positioner} = RecommendationStore.getRecommendationId(thread.cached[value], thread.category);
                        this.insertId(threadId, elementId, positioner);
                    });
                    this._nextUrl[threadId] = thread.recommendationUrl;
                });
                this.emitChange();
                break;
            default:
                break;
        }
    }
}

export default new RecommendationsByThreadStore();