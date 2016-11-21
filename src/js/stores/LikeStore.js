import { register, waitFor } from '../dispatcher/Dispatcher';
import { createStore } from '../utils/StoreUtils';
import UserStore from '../stores/UserStore';
import ActionTypes from '../constants/ActionTypes';
import selectn from 'selectn';

let _likes = [];

const LikeStore = createStore({
    contains(userId1, userId2) {
        return _likes.some(like => like.from == userId1 && like.to == userId2);
    },

    get(userId1, userId2) {
        const like = _likes.find(like => like.from == userId1 && like.to == userId2) || {value: 0};
        return like.value;
    },

    merge(userId1, userId2, value) {
        if (_likes.some(like => like.from == userId1 && like.to == userId2)) {
            const index = _likes.findIndex(like => like.from == userId1 && like.to == userId2);
            _likes[index] = {from: userId1, to: userId2, value: value};
        } else {
            _likes.push({from: userId1, to: userId2, value: value});
        }
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
        case ActionTypes.DISLIKE_USER:
            LikeStore.merge(from, to, null);
            LikeStore.emitChange();
            break;
        case ActionTypes.IGNORE_USER:
            LikeStore.emitChange();
            break;
        case ActionTypes.LIKE_USER_SUCCESS:
            LikeStore.merge(from, to, 1);
            LikeStore.emitChange();
            break;
        case ActionTypes.UNLIKE_USER_SUCCESS:
            LikeStore.merge(from, to, 0);
            LikeStore.emitChange();
            break;
        case ActionTypes.DISLIKE_USER_SUCCESS:
            LikeStore.merge(from, to, -1);
            LikeStore.emitChange();
            break;
        case ActionTypes.IGNORE_USER_SUCCESS:
            LikeStore.emitChange();
            break;
        case ActionTypes.REQUEST_LIKE_USER_SUCCESS:
            const like = selectn('response.result', action) ? 1 : 0;
            LikeStore.merge(from, to, like);
            LikeStore.emitChange();
            break;
        case ActionTypes.LOGOUT_USER:
            _likes = [];
            break;
    }
});

export default LikeStore;