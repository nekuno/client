import { register, waitFor } from '../dispatcher/Dispatcher';
import { createStore } from '../utils/StoreUtils';
import UserStore from '../stores/UserStore';
import ActionTypes from '../constants/ActionTypes';
import selectn from 'selectn';

let _block = {};

const BlockStore = createStore({
    contains(userId1, userId2) {

        return (userId1 in _block && (userId2 in _block[userId1])) ||
            (userId2 in _block && (userId1 in _block[userId2]));
    },

    get(userId1, userId2) {

        if (userId1 in _block && (userId2 in _block[userId1])){
            return _block[userId1][userId2];
        } else if (userId2 in _block && (userId1 in _block[userId2])) {
            return _block[userId2][userId1];
        } else {
            return false;
        }
    },

    merge(userId1, userId2, value){
        _block[userId1] = (userId1 in _block) ? _block[userId1] : [];
        _block[userId1][userId2] = value;
    }
});

BlockStore.dispatchToken = register(action => {

    waitFor([UserStore.dispatchToken]);
    const {from, to} = action;
    switch(action.type) {
        case ActionTypes.BLOCK_USER:
            BlockStore.merge(from, to, null);
            BlockStore.emitChange();
            break;
        case ActionTypes.UNBLOCK_USER:
            BlockStore.merge(from, to, null);
            BlockStore.emitChange();
            break;
        case ActionTypes.BLOCK_USER_SUCCESS:
            BlockStore.merge(from, to, true);
            BlockStore.emitChange();
            break;
        case ActionTypes.UNBLOCK_USER_SUCCESS:
            BlockStore.merge(from, to, false);
            BlockStore.emitChange();
            break;
        case ActionTypes.REQUEST_BLOCK_USER_SUCCESS:
            const block = selectn('response.result', action)? 1 : 0 ;
            BlockStore.merge(from, to, block);
            BlockStore.emitChange();
            break;
        case ActionTypes.LOGOUT_USER:
            _block = {};
            break;
    }
});

export default BlockStore;