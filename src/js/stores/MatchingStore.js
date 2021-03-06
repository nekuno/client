import ActionTypes from '../constants/ActionTypes';
import { waitFor } from '../dispatcher/Dispatcher';
import UserStore from '../stores/UserStore';
import BaseStore from './BaseStore';
import LoginStore from './LoginStore';

class MatchingStore extends BaseStore {
    setInitial() {
        this._matching = {};
    }

    _registerToActions(action) {
        waitFor([UserStore.dispatchToken]);
        super._registerToActions(action);
        switch (action.type) {
            case ActionTypes.REQUEST_MATCHING:
            case ActionTypes.REQUEST_MATCHING_ERROR:
                break;
            case ActionTypes.REQUEST_MATCHING_SUCCESS:
                const {userId1, userId2} = action;
                if (!this.contains(userId1, userId2)){
                    this.merge(userId1, userId2, action.response.matching);
                    this.emitChange();
                }
                this.emitChange();
                break;
            case ActionTypes.REQUEST_OTHER_USER_SUCCESS:
                const loggedUserId = LoginStore.user.id;
                const otherUserId = UserStore.getBySlug(action.slug).id;

                this.merge(loggedUserId, otherUserId, action.response.matching);
                this.emitChange();
                break;
        }
    }

    contains(userId1, userId2) {
        return (userId1 in this._matching && (userId2 in this._matching[userId1])) ||
            (userId2 in this._matching && (userId1 in this._matching[userId2]));
    }

    get(userId1, userId2) {
        if (userId1 in this._matching && (userId2 in this._matching[userId1])){
            return this._matching[userId1][userId2];
        } else if (userId2 in this._matching && (userId1 in this._matching[userId2])) {
            return this._matching[userId2][userId1];
        } else {
            return null;
        }
    }

    getPercentage(userId1, userId2)
    {
        const matching = this.get(userId1, userId2);

        return matching*100;
    }

    merge(userId1, userId2, value){
        this._matching[userId1] = (userId1 in this._matching) ? this._matching[userId1] : [];
        this._matching[userId1][userId2] = value;
    }
}

export default new MatchingStore();