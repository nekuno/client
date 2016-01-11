import { register, waitFor } from '../dispatcher/Dispatcher';
import { createStore, mergeIntoBag, isInBag } from '../utils/StoreUtils';
import UserStore from '../stores/UserStore';
import ActionTypes from '../constants/ActionTypes';
import selectn from 'selectn';

const _like = {};

const LikeStore = createStore({
    contains(userId1, userId2) {

        return (userId1 in _like && (userId2 in _like[userId1])) ||
            (userId2 in _like && (userId1 in _like[userId2]));
    },

    get(userId1, userId2) {

        if (userId1 in _like && (userId2 in _like[userId1])){
            return _like[userId1][userId2];
        } else if (userId2 in _like && (userId1 in _like[userId2])) {
            return _like[userId2][userId1];
        } else {
            return null;
        }
    },

    merge(userId1, userId2, value){
        _like[userId1] = (userId1 in _like) ? _like[userId1] : [];
        _like[userId1][userId2] = value;
    }
});

LikeStore.dispatchToken = register(action => {

    waitFor([UserStore.dispatchToken]);
    if (action.type == ActionTypes.LIKE_USER_SUCCESS
        || action.type == ActionTypes.UNLIKE_USER_SUCCESS)
    {
        const {from, to} = action;

        LikeStore.merge(from, to, action.type == ActionTypes.LIKE_USER_SUCCESS);
        LikeStore.emitChange();

    }
    else if (action.type == ActionTypes.REQUEST_LIKE_USER_SUCCESS)
    {
        const {from, to} = action;
        const like = selectn('response.result', action)? 1 : 0 ;

        LikeStore.merge(from, to, like);
        LikeStore.emitChange();
    }
});

export default LikeStore;