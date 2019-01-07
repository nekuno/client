import ActionTypes from '../constants/ActionTypes';
import { waitFor } from '../dispatcher/Dispatcher';
import BaseStore from './BaseStore';
import UserStore from '../stores/UserStore'
import LoginStore from "./LoginStore";

class SimilarityStore extends BaseStore {

    setInitial() {
        this._similarity = {};
    }

    _registerToActions(action) {
        waitFor([UserStore.dispatchToken]);
        super._registerToActions(action);

        switch (action.type) {
            case ActionTypes.REQUEST_SIMILARITY:
            case ActionTypes.REQUEST_SIMILARITY_ERROR:
                break;
            case ActionTypes.REQUEST_SIMILARITY_SUCCESS:
                const {userId1, userId2} = action;
                this.merge(userId1, userId2, action.response.similarity);
                this.emitChange();
                break;
            case ActionTypes.REQUEST_OTHER_USER_SUCCESS:
                const loggedUserId = LoginStore.user.id;
                const otherUserId = UserStore.getBySlug(action.slug).id;

                this.merge(loggedUserId, otherUserId, action.response.similarity);
                this.emitChange();
                break;
        }
    }

    contains(userId1, userId2) {

        return (userId1 in this._similarity && (userId2 in this._similarity[userId1])) ||
            (userId2 in this._similarity && (userId1 in this._similarity[userId2]));
    }

    get(userId1, userId2) {

        if (userId1 in this._similarity && (userId2 in this._similarity[userId1])){
            return this._similarity[userId1][userId2];
        } else if (userId2 in this._similarity && (userId1 in this._similarity[userId2])) {
            return this._similarity[userId2][userId1];
        } else {
            return null;
        }
    }

    merge(userId1, userId2, value){
        this._similarity[userId1] = (userId1 in this._similarity) ? this._similarity[userId1] : [];
        this._similarity[userId1][userId2] = value;
    }
}

export default new SimilarityStore();