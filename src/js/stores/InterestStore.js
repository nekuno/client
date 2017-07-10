import ActionTypes from '../constants/ActionTypes';
import { API_URLS } from '../constants/Constants';
import { isInBag } from '../utils/StoreUtils';
import BaseStore from './BaseStore';

class InterestStore extends BaseStore {
    setInitial() {
        super.setInitial();
        this._interests = {};
        this._noInterests = {};
        this._totals = {};
        this._type = {};
        this._showOnlyCommon = {};
        this._loadingComparedInterests = null;
        this._loadingOwnInterests = null;
        this._initialPaginationUrl = API_URLS.OWN_INTERESTS;
        this._initialComparedPaginationUrl = API_URLS.COMPARED_INTERESTS;
    }

    _registerToActions(action) {
        super._registerToActions(action);
        let newItems = {};
        let to, rate;
        switch (action.type) {
            case ActionTypes.REQUEST_OWN_INTERESTS:
                this._loadingOwnInterests = true;
                this.emitChange();
                break;
            case ActionTypes.REQUEST_COMPARED_INTERESTS:
                this._loadingComparedInterests = true;
                this.emitChange();
                break;
            case ActionTypes.SET_CONTENTS_TYPE:
                this.setType(action.userId, action.contentType);
                this._resetInterests(action.userId);
                this.emitChange();
                break;
            case ActionTypes.SET_CONTENTS_SHOWONLYCOMMON:
                this.setShowOnlyCommon(action.userId, action.showOnlyCommon);
                this._resetInterests(action.userId);
                this.emitChange();
                break;
            case ActionTypes.LIKE_CONTENT:
            case ActionTypes.DISLIKE_CONTENT:
            case ActionTypes.UNRATE_CONTENT:
                to = action.to;
                Object.keys(this._interests).forEach(userId => this._interests[userId].forEach((interest, index) => {
                    if (interest.id === to) {
                        this._interests[userId][index].rate = null;
                    }
                }));
                this.emitChange();
                break;
            case ActionTypes.RESET_INTERESTS:
                this._resetInterests(action.userId);
                this.emitChange();
                break;
            case ActionTypes.REPORT_CONTENT:
                to = action.data.contentId;
                Object.keys(this._interests).forEach(userId => this._interests[userId].forEach((interest, index) => {
                    if (interest.id === to) {
                        this._interests[userId].splice(index, 1)
                    }
                }));
                this.emitChange();
                break;
            case ActionTypes.REQUEST_OWN_INTERESTS_SUCCESS:
                newItems[action.userId] = action.response.items;
                this._interests[action.userId] = this._interests[action.userId] || [];
                newItems = this._setExtraFields(newItems, action.userId);
                Object.keys(newItems[action.userId]).forEach(index => this._interests[action.userId].push(newItems[action.userId][index]));

                this._totals[action.userId] = action.response.totals;
                this._pagination[action.userId] = action.response.pagination;
                this._noInterests[action.userId] = this._interests[action.userId].length === 0;
                this._loadingOwnInterests = false;
                this.emitChange();
                break;
            case ActionTypes.REQUEST_OWN_INTERESTS_ERROR:
                this._loadingOwnInterests = false;
                this.emitChange();
                break;
            case ActionTypes.REQUEST_COMPARED_INTERESTS_SUCCESS:
                newItems[action.otherUserId] = action.response.items;
                this._interests[action.otherUserId] = this._interests[action.otherUserId] || [];
                newItems = this._setExtraFields(newItems, action.otherUserId, action.userId);
                Object.keys(newItems[action.otherUserId]).forEach(index => this._interests[action.otherUserId].push(newItems[action.otherUserId][index]));

                this._totals[action.otherUserId] = action.response.totals;
                this._pagination[action.otherUserId] = action.response.pagination;
                this._noInterests[action.otherUserId] = this._interests[action.otherUserId].length === 0;
                this._loadingComparedInterests = false;
                this.emitChange();
                break;
            case ActionTypes.REQUEST_COMPARED_INTERESTS_ERROR:
                this._loadingComparedInterests = false;
                this.emitChange();
                break;
            case ActionTypes.LIKE_CONTENT_SUCCESS:
                to = action.to;
                rate = 1;
                Object.keys(this._interests).forEach(userId => this._interests[userId].forEach((interest, index) => {
                    if (interest.id === to) {
                        this._interests[userId][index].rate = rate;
                    }
                }));
                this.emitChange();
                break;
            case ActionTypes.DISLIKE_CONTENT_SUCCESS:
                to = action.to;
                rate = -1;
                Object.keys(this._interests).forEach(userId => this._interests[userId].forEach((interest, index) => {
                    if (interest.id === to) {
                        this._interests[userId][index].rate = rate;
                    }
                }));
                this.emitChange();
                break;
            case ActionTypes.UNRATE_CONTENT_SUCCESS:
                to = action.to;
                rate = 0;
                Object.keys(this._interests).forEach(userId => this._interests[userId].forEach((interest, index) => {
                    if (interest.id === to) {
                        this._interests[userId][index].rate = rate;
                    }
                }));
                this.emitChange();
                break;
            case ActionTypes.CHECK_IMAGES_SUCCESS:
                const currentUserId = typeof action.otherUserId !== 'undefined' ? action.otherUserId : action.userId;
                const currentInterests = this._interests[currentUserId];
                Object.keys(action.response).forEach((key) => {
                    const newInterest = action.response[key];
                    Object.keys(currentInterests).forEach((key2) => {
                        const currentInterest = currentInterests[key2];
                        if (currentInterest.url === newInterest.url) {
                            if (newInterest.processed === 1) {
                                const currentRate = currentInterests[key2].rate;
                                const currentUserRates = currentInterests[key2].user_rates;
                                currentInterests[key2] = newInterest;
                                currentInterests[key2].rate = currentRate;
                                currentInterests[key2].user_rates = currentUserRates;
                            } else {
                                delete currentInterests[key2];
                            }
                        }
                    });
                });
                this.emitChange();
                break;
        }
    }

    contains(id, fields) {
        return isInBag(this._interests, id, fields);
    }

    get(id) {
        return this._interests[id];
    }

    noInterests(id) {
        return this._noInterests[id];
    }

    getPagination(userId) {
        return this._pagination[userId];
    }

    getType(userId) {
        return this._type.hasOwnProperty(userId) ? this._type[userId] : '';
    }

    setType(userId, type) {
        this._type[userId] = type;
    }

    getShowOnlyCommon(userId) {
        return this._showOnlyCommon.hasOwnProperty(userId) ? this._showOnlyCommon[userId] : 1;
    }

    setShowOnlyCommon(userId, showOnlyCommon) {
        this._showOnlyCommon[userId] = showOnlyCommon;
    }

    getRequestInterestsUrl(userId) {
        let url = this.getPaginationUrl(userId, this._initialPaginationUrl);
        if (url === this._initialPaginationUrl){
            url = this._formatInterestUrl(url, userId);
        }

        return url;
    }

    getRequestComparedInterestsUrl(userId) {
        let url = this.getPaginationUrl(userId, this._initialComparedPaginationUrl);
        if (url === this._initialComparedPaginationUrl) {
            url = this._formatInterestUrl(url, userId);
        }
        return url;
    }

    _formatInterestUrl(url, userId) {
        url = url.replace('{userId}', userId);
        url = url.replace('{type}', this.getType(userId));
        url = url.replace('{showOnlyCommon}', this.getShowOnlyCommon(userId));

        return url;
    }

    _resetInterests(userId) {
        this._interests[userId] = [];
        delete this._pagination[userId];
    }

    getTotals(userId) {
        return this._totals[userId];
    }

    getAll() {
        return this._interests;
    }

    isLoadingComparedInterests() {
        return this._loadingComparedInterests;
    }

    isLoadingOwnInterests() {
        return this._loadingOwnInterests;
    }

    _setExtraFields(items, userId, ownUserId = userId) {
        Object.keys(items[userId]).forEach(index => {
            items[userId][index].contentId = items[userId][index].id;
            items[userId][index].rate = items[userId][index].user_rates
                && items[userId][index].user_rates.some(user_rate => user_rate.rate == 'LIKES' && user_rate.user.id == ownUserId);
        });

        return items;
    }
}

export default new InterestStore();
