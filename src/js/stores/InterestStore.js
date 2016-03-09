import { register } from '../dispatcher/Dispatcher';
import { createStore, mergeIntoBag, isInBag } from '../utils/StoreUtils';
import selectn from 'selectn';

const _interests = {};
const _pagination = {};

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
        let currentUserId = otherUserId ? otherUserId : userId;
        let ids = Object.keys(_interests[currentUserId]);
        let lastId = ids.length > 0 ? parseInt(ids[ids.length - 1]) : 0;
        let nextId = lastId + 1;
        let orderedInterests = [];
        for (let key in interests) {
            if (interests.hasOwnProperty(key)) {
                orderedInterests[parseInt(key) + nextId] = interests[key];
                if (!orderedInterests[parseInt(key) + nextId].hasOwnProperty('contentId')) {
                    orderedInterests[parseInt(key) + nextId]['contentId'] = interests[key].id;
                }
            }
        }

        mergeIntoBag(_interests[currentUserId], orderedInterests);
        _pagination[currentUserId] = pagination;
        InterestStore.emitChange();
    }
});

export default InterestStore;
