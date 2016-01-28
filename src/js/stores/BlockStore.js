import { register, waitFor } from '../dispatcher/Dispatcher';
import { createStore, mergeIntoBag, isInBag } from '../utils/StoreUtils';
import UserStore from '../stores/UserStore';
import ActionTypes from '../constants/ActionTypes';
import selectn from 'selectn';

const _block = {};

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
            return null;
        }
    },

    merge(userId1, userId2, value){
        _block[userId1] = (userId1 in _block) ? _block[userId1] : [];
        _block[userId1][userId2] = value;
    }
});

BlockStore.dispatchToken = register(action => {

    waitFor([UserStore.dispatchToken]);
    if (action.type == ActionTypes.BLOCK_USER_SUCCESS
        || action.type == ActionTypes.UNBLOCK_USER_SUCCESS)
    {
        const {from, to} = action;

        BlockStore.merge(from, to, action.type == ActionTypes.BLOCK_USER_SUCCESS);
        BlockStore.emitChange();

    }
    else if (action.type == ActionTypes.REQUEST_BLOCK_USER_SUCCESS)
    {
        const {from, to} = action;
        const block = selectn('response.result', action)? 1 : 0 ;

        BlockStore.merge(from, to, block);
        BlockStore.emitChange();
    }
});

export default BlockStore;