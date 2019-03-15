import ActionTypes from '../constants/ActionTypes';
import BaseStore from './BaseStore';
import { waitFor } from '../dispatcher/Dispatcher';
import UserStore from '../stores/UserStore'

class StatsStore extends BaseStore {

    setInitial() {
        this._stats = null;
        this._allNetworks = ['spotify', 'facebook', 'tumblr', 'twitter', 'google', 'linkedin', 'steam'];
    }

    get stats() {
        return this._stats;
    }

    getGroups() {
        return this.stats ? this.stats.groupsBelonged : null;
    }

    get networks() {
        return this.stats? this.stats.likesByTypeAndNetwork : {};
    }

    get unconnectedNetworks() {
        const networks = this.networks;

        return this._allNetworks.filter(function(i) {return Object.keys(networks).indexOf(i) < 0;});
    }

    _registerToActions(action) {
        waitFor([UserStore.dispatchToken]);
        super._registerToActions(action);

        switch (action.type) {

            case ActionTypes.REQUEST_STATS:
                this.emitChange();
                break;

            case ActionTypes.REQUEST_STATS_SUCCESS:
                this._error = null;
                this._stats = action.response;
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