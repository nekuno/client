import ActionTypes from '../constants/ActionTypes';
import { register } from '../dispatcher/Dispatcher';
import { createStore, mergeIntoBag, isInBag } from '../utils/StoreUtils';
import selectn from 'selectn';

let _interests = {};
let _pagination = {};

const InterestStore = createStore({
    contains(id, fields) {
        return isInBag(_interests, id, fields);
    },

    get(id) {
        return _interests[id];
    },

    getPagination(userId) {
        return _pagination[userId];
    },

    getAll() {
        return _interests;
    }
});

InterestStore.dispatchToken = register(action => {
    const interests = selectn('response.result.items', action);
    const pagination = selectn('response.result.pagination', action);
    const userId = selectn('userId', action);
    const otherUserId = selectn('otherUserId', action);
    let currentUserId = otherUserId ? otherUserId : userId;
    if (typeof _interests[userId] === "undefined") {
        _interests[userId] = [];
    }
    if (typeof _pagination[userId] === "undefined") {
        _pagination[userId] = {};
    }
    if (action.type === 'RESET_INTERESTS') {
        _interests[userId] = [];
    }

    if (interests && action.type === 'REQUEST_OWN_INTERESTS_SUCCESS' || action.type === 'REQUEST_COMPARED_INTERESTS_SUCCESS') {
        let ids = Object.keys(_interests[currentUserId]);
        let lastId = ids.length > 0 ? parseInt(ids[ids.length - 1]) : 0;
        let nextId = lastId + 1;
        let orderedInterests = [];
        for (let key in interests) {
            if (interests.hasOwnProperty(key)) {
                orderedInterests[parseInt(key) + nextId] = interests[key];
                if (!orderedInterests[parseInt(key) + nextId].hasOwnProperty('contentId')) {
                    orderedInterests[parseInt(key) + nextId]['contentId'] = interests[key].id;
                    orderedInterests[parseInt(key) + nextId]['rate'] = interests[key].user_rates && interests[key].user_rates.some(user_rate => user_rate.rate == 'LIKES' && user_rate.user.id == userId) ? true : false;
                }
            }
        }

        mergeIntoBag(_interests[currentUserId], orderedInterests);
        _pagination[currentUserId] = pagination;
        InterestStore.emitChange();
    }

    if (action.type === 'LIKE_CONTENT_SUCCESS' || action.type === 'UNLIKE_CONTENT_SUCCESS') {
        const { from, to } = action;
        Object.keys(_interests[from]).forEach(key => { if (_interests[from][key].id == to) { _interests[from][key].rate = action.type === 'LIKE_CONTENT_SUCCESS'; } });
        InterestStore.emitChange();
    }
    if (action.type == ActionTypes.LOGOUT_USER){
        _interests = {};
        _pagination = {};
    }
});

export default InterestStore;
