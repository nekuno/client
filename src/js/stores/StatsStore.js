import ActionTypes from '../constants/ActionTypes';
import BaseStore from './BaseStore';
import { register, waitFor } from '../dispatcher/Dispatcher';
import { createStore, mergeIntoBag, isInBag } from '../utils/StoreUtils';
import UserStore from '../stores/UserStore'
import selectn from 'selectn';

class StatsStore extends BaseStore {

    setInitial() {
        this._stats = null;
    }

    get stats() {
        return this._stats;
    }

    getGroups() {
        return this.stats ? this.stats.groupsBelonged : null;
    }

    _registerToActions(action) {
        waitFor([UserStore.dispatchToken]);
        super._registerToActions(action);

        switch (action.type) {

            case ActionTypes.REQUEST_STATS:
                this.setInitial();
                this.emitChange();
                break;

            case ActionTypes.REQUEST_STATS_SUCCESS:
                this._error = null;
                //const responseStats = action.response;
                this._stats = action.response;
                //Object.assign(this._stats, responseStats);
                this.emitChange();
                break;

            case ActionTypes.REQUEST_STATS_ERROR:
                this._error = action.error;
                this._stats = null;
                this.emitChange();
                break;

            default:
                break;
        }
    }
}

export default new StatsStore();