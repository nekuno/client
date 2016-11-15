import ActionTypes from '../constants/ActionTypes';
import { register, waitFor } from '../dispatcher/Dispatcher';
import { createStore } from '../utils/StoreUtils';
import UserStore from '../stores/UserStore'
import selectn from 'selectn';

let _comparedStats = {};

const ComparedStatsStore = createStore({
    contains(userId1, userId2) {

        return (userId1 in _comparedStats && (userId2 in _comparedStats[userId1])) ||
            (userId2 in _comparedStats && (userId1 in _comparedStats[userId2]));
    },

    get(userId1, userId2) {
        if (userId1 in _comparedStats && (userId2 in _comparedStats[userId1])){
            return _comparedStats[userId1][userId2];
        } else if (userId2 in _comparedStats && (userId1 in _comparedStats[userId2])) {
            return _comparedStats[userId2][userId1];
        } else {
            return null;
        }
    },

    merge(userId1, userId2, value){
        _comparedStats[userId1] = (userId1 in _comparedStats) ? _comparedStats[userId1] : [];
        _comparedStats[userId1][userId2] = value;
    }
});

ComparedStatsStore.dispatchToken = register(action => {
    waitFor([UserStore.dispatchToken]);
    const responseComparedStats = selectn('response.entities.comparedStats', action);
    if (responseComparedStats) {
        const {userId1, userId2} = action;

        if (!ComparedStatsStore.contains(userId1, userId2)){
            ComparedStatsStore.merge(userId1, userId2, responseComparedStats.undefined);
            ComparedStatsStore.emitChange();
        }

    }

    if (action.type == ActionTypes.LOGOUT_USER){
        _comparedStats = {};
    }
});

export default ComparedStatsStore;