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
    if (typeof _interests[userId] === "undefined") {
        _interests[userId] = [];
    }
    if (typeof _pagination[userId] === "undefined") {
        _pagination[userId] = {};
    }
    if (action.type === 'RESET_OWN_INTERESTS') {
        _interests[userId] = [];
    }

    if (interests && action.type === 'REQUEST_OWN_INTERESTS_SUCCESS') {
        let ids = Object.keys(_interests[userId]);
        let lastId = ids.length > 0 ? parseInt(ids[ids.length - 1]) : 0;
        let orderedInterests = [];
        for (let key in interests) {
            if (interests.hasOwnProperty(key)) {
                orderedInterests[parseInt(key) + lastId] = interests[key];
                if (!orderedInterests[parseInt(key) + lastId].hasOwnProperty('contentId')) {
                    orderedInterests[parseInt(key) + lastId]['contentId'] = interests[key].id;
                }
            }
        }

        mergeIntoBag(_interests[userId], orderedInterests);
        _pagination[userId] = pagination;
        InterestStore.emitChange();
    }
});

export default InterestStore;
