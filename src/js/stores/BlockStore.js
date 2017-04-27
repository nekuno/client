import { waitFor } from '../dispatcher/Dispatcher';
import UserStore from '../stores/UserStore';
import ActionTypes from '../constants/ActionTypes';
import BaseStore from './BaseStore';

class BlockStore extends BaseStore {
    setInitial() {
        this._block = {};
    }

    _registerToActions(action) {
        waitFor([UserStore.dispatchToken]);
        super._registerToActions(action);
        const {from, to} = action;
        switch (action.type) {
            case ActionTypes.BLOCK_USER:
                this._merge(from, to, null);
                this.emitChange();
                break;
            case ActionTypes.UNBLOCK_USER:
                this._merge(from, to, null);
                this.emitChange();
                break;
            case ActionTypes.BLOCK_USER_SUCCESS:
                this._merge(from, to, true);
                this.emitChange();
                break;
            case ActionTypes.UNBLOCK_USER_SUCCESS:
                this._merge(from, to, false);
                this.emitChange();
                break;
            case ActionTypes.REQUEST_BLOCK_USER_SUCCESS:
                const block = Object.keys(action.response).length > 0;
                this._merge(from, to, block);
                this.emitChange();
                break;
        }
    }

    contains(userId1, userId2) {
        return this._isUserBblockedByUserA(userId1, userId2) || this._isUserBblockedByUserA(userId2, userId1);
    }

    getBidirectional(userId1, userId2) {
        return this.get(userId1, userId2) || this.get(userId2, userId1);
    }

    get(userId1, userId2) {
        return this._isUserBblockedByUserA(userId1, userId2) ? this._get(userId1, userId2) : false;
    }

    _get(userId1, userId2) {
        return this._block[userId1][userId2];
    }

    _merge(userId1, userId2, value) {
        this._block[userId1] = (userId1 in this._block) ? this._block[userId1] : [];
        this._block[userId1][userId2] = value;
    }

    _isUserBblockedByUserA(userA, userB) {
        return userA in this._block && (userB in this._block[userA]);
    }
}

export default new BlockStore();