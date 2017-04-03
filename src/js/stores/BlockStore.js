import { waitFor } from '../dispatcher/Dispatcher';
import UserStore from '../stores/UserStore';
import ActionTypes from '../constants/ActionTypes';
import selectn from 'selectn';
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
                this.merge(from, to, null);
                this.emitChange();
                break;
            case ActionTypes.UNBLOCK_USER:
                this.merge(from, to, null);
                this.emitChange();
                break;
            case ActionTypes.BLOCK_USER_SUCCESS:
                this.merge(from, to, true);
                this.emitChange();
                break;
            case ActionTypes.UNBLOCK_USER_SUCCESS:
                this.merge(from, to, false);
                this.emitChange();
                break;
            case ActionTypes.REQUEST_BLOCK_USER_SUCCESS:
                const block = selectn('response.result', action) ? 1 : 0;
                this.merge(from, to, block);
                this.emitChange();
                break;
        }
    }

    contains(userId1, userId2) {
        return (userId1 in this._block && (userId2 in this._block[userId1])) ||
            (userId2 in this._block && (userId1 in this._block[userId2]));
    }

    get(userId1, userId2) {
        if (userId1 in this._block && (userId2 in this._block[userId1])) {
            return this._block[userId1][userId2];
        } else if (userId2 in this._block && (userId1 in this._block[userId2])) {
            return this._block[userId2][userId1];
        } else {
            return 0;
        }
    }

    merge(userId1, userId2, value) {
        this._block[userId1] = (userId1 in this._block) ? this._block[userId1] : [];
        this._block[userId1][userId2] = value;
    }
}

export default new BlockStore();