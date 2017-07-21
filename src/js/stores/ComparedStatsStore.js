import ActionTypes from '../constants/ActionTypes';
import { waitFor } from '../dispatcher/Dispatcher';
import BaseStore from './BaseStore';
import UserStore from '../stores/UserStore';
import selectn from 'selectn';

class ComparedStatsStore extends BaseStore {

    setInitial() {
        this._comparedStats = {};
        this._isLoadingComparedStats = false;
    }

    _registerToActions(action) {
        waitFor([UserStore.dispatchToken]);
        super._registerToActions(action);

        switch (action.type) {

            case ActionTypes.REQUEST_COMPARED_STATS:
                this._isLoadingComparedStats = true;
                this.emitChange();
                break;
            case ActionTypes.REQUEST_COMPARED_STATS_ERROR:
                this._isLoadingComparedStats = false;
                this.emitChange();
                break;
            case ActionTypes.REQUEST_COMPARED_STATS_SUCCESS:
                this._isLoadingComparedStats = false;
                const responseComparedStats = action.response;
                const {userId1, userId2} = action;
                this.merge(userId1, userId2, responseComparedStats);
                this.emitChange();
                break;
            default:
                break;
        }
    }

    contains(userId1, userId2) {

        return (userId1 in this._comparedStats && (userId2 in this._comparedStats[userId1])) ||
            (userId2 in this._comparedStats && (userId1 in this._comparedStats[userId2]));
    }

    get(userId1, userId2) {
        if (userId1 in this._comparedStats && (userId2 in this._comparedStats[userId1])){
            return this._comparedStats[userId1][userId2];
        } else if (userId2 in this._comparedStats && (userId1 in this._comparedStats[userId2])) {
            return this._comparedStats[userId2][userId1];
        } else {
            return null;
        }
    }

    isLoadingComparedStats() {
        return this._isLoadingComparedStats;
    }

    merge(userId1, userId2, value){
        this._comparedStats[userId1] = (userId1 in this._comparedStats) ? this._comparedStats[userId1] : [];
        this._comparedStats[userId1][userId2] = value;
    }
}

export default new ComparedStatsStore();