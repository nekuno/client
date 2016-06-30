import { register, waitFor } from '../dispatcher/Dispatcher';
import ActionTypes from '../constants/ActionTypes';
import * as Constants from '../constants/Constants';
import ThreadStore from '../stores/ThreadStore';
import RecommendationStore from '../stores/RecommendationStore';
import {
    createIndexedListStore,
    createListActionHandler
} from '../utils/PaginatedStoreUtils';
import selectn from 'selectn';

//Move logic to createIndexedListStore?
let _position = [];

const RecommendationsByThreadStore = createIndexedListStore({

    getRecommendationsFromThread(threadId) {

        const thread = ThreadStore.get(threadId);
        if (!thread) {
            //Shouldn´t happen : UserActionCreators.requestRecommendation checks this
            return null;
        }

        return this.getIds(threadId);

    },

    recommendationsReceived(threadId) {
        return this.getList(threadId).getPageCount() > 0;
    },

    setPosition(threadId, newPosition){
        _position[threadId] = newPosition;
    },

    getPosition(threadId){
        return _position[threadId];
    },

    advancePosition(threadId, number = 1){
        _position[threadId] += number;
    }
});

const handleListAction = createListActionHandler({
    request: ActionTypes.REQUEST_RECOMMENDATIONS,
    success: ActionTypes.REQUEST_RECOMMENDATIONS_SUCCESS,
    failure: ActionTypes.REQUEST_RECOMMENDATIONS_ERROR
});

register(action => {

    waitFor([ThreadStore.dispatchToken, RecommendationStore.dispatchToken]);

    const { threadId } = action;
    switch (action.type) {
        case ActionTypes.RECOMMENDATIONS_NEXT:
            RecommendationsByThreadStore.advancePosition(threadId, 1);
            break;
        case ActionTypes.RECOMMENDATIONS_PREV:
            if (RecommendationsByThreadStore.getPosition(threadId) > 0) {
                RecommendationsByThreadStore.advancePosition(threadId, -1);
            }
            break;
        case ActionTypes.UPDATE_THREAD:
            let delete_list = RecommendationsByThreadStore.getList(threadId);
            delete_list._ids = [];
            RecommendationsByThreadStore.emitChange();
            break;
        case ActionTypes.REQUEST_THREADS_SUCCESS:
            const responseThreads = selectn('response.entities.thread', action);
            Object.keys(responseThreads).forEach((threadId) => {
                const thread = responseThreads[threadId];
                const nextRecommendation = Constants.getRecommendationUrl(threadId) + '?offset=20';
                let recommendationIds = [];
                Object.keys(thread.cached).forEach((key) => {
                    recommendationIds.push(key);
                });
                RecommendationsByThreadStore.getList(threadId).expectPage();
                RecommendationsByThreadStore.getList(threadId).receivePage(recommendationIds, nextRecommendation);
            });
            break;
        case ActionTypes.LOGOUT_USER:
            _position = [];
            RecommendationsByThreadStore.removeLists();
            break;
        default:
            break;
    }

    if (threadId) {
        handleListAction(
            action,
            RecommendationsByThreadStore.getList(threadId),
            RecommendationsByThreadStore.emitChange
        );
    }
});

export default RecommendationsByThreadStore;