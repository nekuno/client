import ActionTypes from '../constants/ActionTypes';
import { register, waitFor } from '../dispatcher/Dispatcher';
import { createStore, mergeIntoBag, isInBag } from '../utils/StoreUtils';
import UserStore from '../stores/UserStore'
import selectn from 'selectn';

let _matching = {};

const MatchingStore = createStore({
    contains(userId1, userId2) {

        return (userId1 in _matching && (userId2 in _matching[userId1])) ||
            (userId2 in _matching && (userId1 in _matching[userId2]));
    },

    get(userId1, userId2) {

        if (userId1 in _matching && (userId2 in _matching[userId1])){
            return _matching[userId1][userId2];
        } else if (userId2 in _matching && (userId1 in _matching[userId2])) {
            return _matching[userId2][userId1];
        } else {
            return null;
        }
    },

    merge(userId1, userId2, value){
        _matching[userId1] = (userId1 in _matching) ? _matching[userId1] : [];
        _matching[userId1][userId2] = value;
    }
});

MatchingStore.dispatchToken = register(action => {
    waitFor([UserStore.dispatchToken]);
    const responseMatching = selectn('response.matching', action);
    if (responseMatching) {
        const {userId1, userId2} = action;

        if (!MatchingStore.contains(userId1, userId2)){
            MatchingStore.merge(userId1, userId2, responseMatching);
            MatchingStore.emitChange();
        }

    }

    if (action.type == ActionTypes.LOGOUT_USER){
        _matching = {};
    }
});

export default MatchingStore;