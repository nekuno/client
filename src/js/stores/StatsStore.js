import { register, waitFor } from '../dispatcher/Dispatcher';
import { createStore, mergeIntoBag, isInBag } from '../utils/StoreUtils';
import UserStore from '../stores/UserStore'
import selectn from 'selectn';

const _stats = {};

const StatsStore = createStore({
    contains(userId, fields) {
        return isInBag(_stats, userId, fields);
    },

    get(userId) {
        return _stats[userId];
    }
});

StatsStore.dispatchToken = register(action => {
    waitFor([UserStore.dispatchToken]);
    const responseStats = selectn('response.entities.stats', action);

    if (responseStats) {

        const {userId} = action;

        //undefined comes from not id selected on normalizr
        responseStats[userId] = responseStats.undefined;
        delete responseStats.undefined;

        mergeIntoBag(_stats, responseStats);
        StatsStore.emitChange();
    }
});

export default StatsStore;