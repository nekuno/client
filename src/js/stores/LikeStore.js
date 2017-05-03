import { waitFor } from '../dispatcher/Dispatcher';
import UserStore from '../stores/UserStore';
import ActionTypes from '../constants/ActionTypes';
import selectn from 'selectn';
import BaseStore from './BaseStore';

class LikeStore extends BaseStore {
    setInitial() {
        this. _likes = [];
    }

    _registerToActions(action) {
        waitFor([UserStore.dispatchToken]);
        super._registerToActions(action);
        const {from, to} = action;
        switch (action.type) {
            case ActionTypes.LIKE_USER:
            case ActionTypes.UNLIKE_USER:
            case ActionTypes.DISLIKE_USER:
                this.merge(from, to, null);
                this.emitChange();
                break;
            case ActionTypes.IGNORE_USER:
                this.emitChange();
                break;
            case ActionTypes.LIKE_USER_SUCCESS:
                this.merge(from, to, 1);
                this.emitChange();
                break;
            case ActionTypes.UNLIKE_USER_SUCCESS:
            case ActionTypes.BLOCK_USER_SUCCESS:
                this.merge(from, to, 0);
                this.emitChange();
                break;
            case ActionTypes.DISLIKE_USER_SUCCESS:
                this.merge(from, to, -1);
                this.emitChange();
                break;
            case ActionTypes.IGNORE_USER_SUCCESS:
                this.emitChange();
                break;
            case ActionTypes.REQUEST_LIKE_USER_SUCCESS:
                const like = Object.keys(action.response).length === 0 ? 0 : 1;
                this.merge(from, to, like);
                this.emitChange();
                break;
        }
    }

    contains(userId1, userId2) {
        return this._likes.some(like => like.from == userId1 && like.to == userId2);
    }

    get(userId1, userId2) {
        const like = this._likes.find(like => like.to == userId2 && like.from == userId1) || {value: 0};
        return like.value;
    }

    merge(userId1, userId2, value) {
        const index = this._likes.findIndex(like => like.to == userId2 && like.from == userId1);
        if (index !== -1) {
            this._likes[index] = {from: userId1, to: userId2, value: value};
        } else {
            this._likes.push({from: userId1, to: userId2, value: value});
        }
    }
}

export default new LikeStore();