import { register, waitFor } from '../dispatcher/Dispatcher';
import { createStore, mergeIntoBag, isInBag } from '../utils/StoreUtils';
import UserStore from '../stores/UserStore';
import ActionTypes from '../constants/ActionTypes';
import selectn from 'selectn';

let _like = {};

const LikeStore = createStore({
    contains(userId1, userId2) {

        return (userId1 in _like && (userId2 in _like[userId1])) ||
            (userId2 in _like && (userId1 in _like[userId2]));
    },

    get(userId1, userId2) {

        if (userId1 in _like && (userId2 in _like[userId1])) {
            return _like[userId1][userId2];
        } else if (userId2 in _like && (userId1 in _like[userId2])) {
            return _like[userId2][userId1];
        } else {
            return false;
        }
    },

    merge(userId1, userId2, value){
        _like[userId1] = (userId1 in _like) ? _like[userId1] : [];
        _like[userId1][userId2] = value;
    }
});

LikeStore.dispatchToken = register(action => {

    waitFor([UserStore.dispatchToken]);
    const {from, to} = action;
    switch(action.type) {
        case ActionTypes.LIKE_USER:
            LikeStore.merge(from, to, null);
            LikeStore.emitChange();
            break;
        case ActionTypes.UNLIKE_USER:
            LikeStore.merge(from, to, null);
            LikeStore.emitChange();
            break;
        case ActionTypes.LIKE_USER_SUCCESS:
            LikeStore.merge(from, to, true);
            LikeStore.emitChange();
            break;
        case ActionTypes.UNLIKE_USER_SUCCESS:
            LikeStore.merge(from, to, false);
            LikeStore.emitChange();
            break;
        case ActionTypes.REQUEST_LIKE_USER_SUCCESS:
            const like = selectn('response.result', action) ? true : false;
            LikeStore.merge(from, to, like);
            LikeStore.emitChange();
            break;
        case ActionTypes.LOGOUT_USER:
            _like = {};
            break;
    }
});

export default LikeStore;