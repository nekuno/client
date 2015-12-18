/*import { register, waitFor } from '../dispatcher/Dispatcher';
import {
    createIndexedListStore,
    createListActionHandler
} from '../utils/PaginatedStoreUtils';
import selectn from 'selectn';
import ActionTypes from '../constants/ActionTypes'
import ThreadStore from '../stores/ThreadStore'
import RecommendationStore from '../stores/RecommendationStore'

let _recommendations = [];
let _current = 0;
let _nextLink = "";

const RecommendationsByThreadStore = createIndexedListStore({

    contains(id) {
        return isInBag(_recommendations, id);
    },

    getNextLink() {
        return _nextLink;
    },

    getPosition() {
        return _current;
    },

    getLastTwenty() {
        return _recommendations.slice(Math.max(_recommendations.length - 20, 0));
    },

    getThreeUsers() {
        return {previous: this.getUser(this.getPosition() - 1 ),
                current: this.getUser(this.getPosition()),
                next: this.getUser(this.getPosition() + 1 )};
    },

    getUser(position){
        if (!this.contains(position)){
            return null;
        }

        return _recommendations[position];
    },

    getCount(){
        return _recommendations.length;
    },

    goTo(position) {
        _current = position;
        return this.getPosition();
    }
});

RecommendationsByThreadStore.dispatchToken = register(action => {

    waitFor([ThreadStore.dispatchToken, RecommendationStore.dispatchToken]);

    if (action.type === ActionTypes.RECOMMENDATIONS_PREV){
        if (RecommendationsByThreadStore.getPosition() == 0){
            return;
        }
        RecommendationsByThreadStore.goTo(RecommendationsByThreadStore.getPosition() - 1);
        RecommendationsByThreadStore.emitChange();
    }

    if (action.type === ActionTypes.RECOMMENDATIONS_NEXT){
        RecommendationsByThreadStore.goTo(RecommendationsByThreadStore.getPosition() + 1);
        RecommendationsByThreadStore.emitChange();
    }

    const recommendations = selectn('response.entities.recommendation', action);

    if (!recommendations){
        return;
    }

    let orderedUsers = [];
    for (let id in recommendations) {
        orderedUsers.push(recommendations[id]);
    }
    //TODO: Order by similarity or matching
    orderedUsers.sort(compareBySimilarity);

    _nextLink = selectn('response.entities.pagination.undefined.nextLink', action);
    _recommendations = _recommendations.concat(orderedUsers);
    RecommendationsByThreadStore.emitChange();
});

function compareBySimilarity(a,b) {
    if (a.similarity > b.similarity)
        return -1;
    if (a.similarity < b.similarity)
        return 1;
    return 0;
};

export default RecommendationsByThreadStore;*/

import { register, waitFor } from '../dispatcher/Dispatcher';
import ActionTypes from '../constants/ActionTypes';
import ThreadStore from '../stores/ThreadStore';
import RecommendationStore from '../stores/RecommendationStore';
import {
    createIndexedListStore,
    createListActionHandler
} from '../utils/PaginatedStoreUtils';

const RecommendationsByThreadStore = createIndexedListStore({
    getRecommendationsFromThread(threadId) {

        const thread = ThreadStore.get(threadId);
        if (!thread){
            //Shouldn´t happen : UserActionCreators.requestRecommendation checks this
            return null;
        }

        return this.getIds(threadId);

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

    if (threadId) {
        handleListAction(
            action,
            RecommendationsByThreadStore.getList(threadId),
            RecommendationsByThreadStore.emitChange
        );
    }
});

export default RecommendationsByThreadStore;