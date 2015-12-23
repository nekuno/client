import { register, waitFor } from '../dispatcher/Dispatcher';
import { createStore, mergeIntoBag, isInBag } from '../utils/StoreUtils';
import UserStore from '../stores/UserStore'
import selectn from 'selectn';

const _similarity = {};

const SimilarityStore = createStore({
    contains(userId1, userId2) {

        return (userId1 in _similarity && (userId2 in _similarity[userId1])) ||
            (userId2 in _similarity && (userId1 in _similarity[userId2]));
    },

    get(userId1, userId2) {

        if (userId1 in _similarity && (userId2 in _similarity[userId1])){
            return _similarity[userId1][userId2];
        } else if (userId2 in _similarity && (userId1 in _similarity[userId2])) {
            return _similarity[userId2][userId1];
        } else {
            return null;
        }
    },

    merge(userId1, userId2, value){
        _similarity[userId1] = (userId1 in _similarity) ? _similarity[userId1] : [];
        _similarity[userId1][userId2] = value;
    }
});

SimilarityStore.dispatchToken = register(action => {
    waitFor([UserStore.dispatchToken]);
    const responseSimilarity = selectn('response.similarity', action);
    if (responseSimilarity) {
        const {userId1, userId2} = action;

        if (!SimilarityStore.contains(userId1, userId2)){
            SimilarityStore.merge(userId1, userId2, responseSimilarity);
            SimilarityStore.emitChange();
        }

    }
});

export default SimilarityStore;