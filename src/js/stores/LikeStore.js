import { waitFor } from '../dispatcher/Dispatcher';
import UserStore from '../stores/UserStore';
import ActionTypes from '../constants/ActionTypes';
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

    get(userSlug1, userSlug2) {
        const like = this._likes.find(like => like.from == userSlug1 && like.to == userSlug2) || {value: 0};
        return like.value;
    }

    merge(userSlug1, userSlug2, value) {
        const index = this._likes.findIndex(like => like.to == userSlug2 && like.from == userSlug1);
        if (index !== -1) {
            this._likes[index] = {from: userSlug1, to: userSlug2, value: value};
        } else {
            this._likes.push({from: userSlug1, to: userSlug2, value: value});
        }
    }
}

export default new LikeStore();