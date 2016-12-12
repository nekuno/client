import ActionTypes from '../constants/ActionTypes';
import { register } from '../dispatcher/Dispatcher';
import { createStore, mergeIntoBag, isInBag } from '../utils/StoreUtils';
import selectn from 'selectn';

let _interests = {};
let _noInterests = {};
let _pagination = {};
let _loadingComparedInterests = null;
let _loadingOwnInterests = null;

const InterestStore = createStore({
    contains(id, fields) {
        return isInBag(_interests, id, fields);
    },

    get(id) {
        return _interests[id];
    },

    noInterests(id) {
        return _noInterests[id];
    },

    getPagination(userId) {
        return _pagination[userId];
    },

    getAll() {
        return _interests;
    },

    isLoadingComparedInterests() {
        return _loadingComparedInterests;
    },

    isLoadingOwnInterests() {
        return _loadingOwnInterests;
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
        _noInterests[currentUserId] = _interests[currentUserId].length === 0;
        _loadingComparedInterests = false;
        _loadingOwnInterests = false;
        InterestStore.emitChange();
    }

    if (action.type === 'REQUEST_COMPARED_INTERESTS') {
        _loadingComparedInterests = true;
        InterestStore.emitChange();
    }
    if (action.type === 'REQUEST_OWN_INTERESTS') {
        _loadingOwnInterests = true;
        InterestStore.emitChange();
    }

    if (action.type === 'CHECK_IMAGES_SUCCESS') {
        const currentInterests = _interests[currentUserId];

        Object.keys(action.response).forEach((key) => {
            const newInterest = action.response[key];

            Object.keys(currentInterests).forEach((key) => {
                const currentInterest = currentInterests[key];

                if (currentInterest.url == newInterest.url){
                    if (newInterest.processed == 1){
                        const currentRate = currentInterests[key].rate;
                        const currentUserRates = currentInterests[key].user_rates;
                        currentInterests[key] = newInterest;
                        currentInterests[key].rate = currentRate;
                        currentInterests[key].user_rates = currentUserRates;
                    } else {
                        delete currentInterests[key];
                    }
                }
            });
        });

        InterestStore.emitChange();
    }

    if (action.type === 'LIKE_CONTENT' || action.type === 'DISLIKE_CONTENT' || action.type === 'UNRATE_CONTENT') {
        const { from, to } = action;
        Object.keys(_interests).forEach(userId => _interests[userId].forEach((interest, index) => { if (interest.id == to) { _interests[userId][index].rate = null; } }));
        InterestStore.emitChange();
    }
    if (action.type === 'LIKE_CONTENT_SUCCESS' || action.type === 'DISLIKE_CONTENT_SUCCESS' || action.type === 'UNRATE_CONTENT_SUCCESS') {
        const { from, to } = action;
        const rate = action.type === 'LIKE_CONTENT_SUCCESS' ? 1 : action.type === 'DISLIKE_CONTENT_SUCCESS' ? -1 : 0;
        Object.keys(_interests).forEach(userId => _interests[userId].forEach((interest, index) => { if (interest.id == to) { _interests[userId][index].rate = rate; } }));
        InterestStore.emitChange();
    }
    if (action.type == ActionTypes.LOGOUT_USER){
        _interests = {};
        _pagination = {};
    }
});

export default InterestStore;
