import ActionTypes from '../constants/ActionTypes';
import { waitFor } from '../dispatcher/Dispatcher';
import BaseStore from './BaseStore';
import UserStore from '../stores/UserStore';
import selectn from 'selectn';

class ComparedStatsStore extends BaseStore {

    setInitial() {
        this._comparedStats = {};
    }

    _registerToActions(action) {
        waitFor([UserStore.dispatchToken]);
        super._registerToActions(action);

        switch (action.type) {

            case ActionTypes.REQUEST_COMPARED_STATS:
            case ActionTypes.REQUEST_COMPARED_STATS_ERROR:
                break;
            case ActionTypes.REQUEST_COMPARED_STATS_SUCCESS:
                const responseComparedStats = selectn('response.entities.comparedStats', action);
                const {userId1, userId2} = action;
                this.merge(userId1, userId2, responseComparedStats.undefined);
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

    merge(userId1, userId2, value){
        this._comparedStats[userId1] = (userId1 in this._comparedStats) ? this._comparedStats[userId1] : [];
        this._comparedStats[userId1][userId2] = value;
    }
}

export default new ComparedStatsStore();