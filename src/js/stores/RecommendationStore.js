import { THREAD_TYPES, API_URLS } from '../constants/Constants';
import { waitFor } from '../dispatcher/Dispatcher';
import selectn from 'selectn';
import ActionTypes from '../constants/ActionTypes';
import BaseStore from './BaseStore';
import ThreadStore from '../stores/ThreadStore';

class RecommendationStore extends BaseStore {

    setInitial() {
        super.setInitial();
        this._recommendations = [];
        this._nextUrl = [];
        this._replaced = [];
        this._prevRecommendations = [];
        this._prevNextUrl = [];
        this._savedIndex = [];
        this._loadingRecommendations = [];
        this._initialPaginationUrl = API_URLS.RECOMMENDATIONS;
    }

    _registerToActions(action) {
        waitFor([ThreadStore.dispatchToken]);
        super._registerToActions(action);

        const {to} = action;
        const recommendations = selectn('response.items', action);

        switch (action.type) {
            case ActionTypes.LIKE_USER:
                this.setSavingUserLike(to, this._recommendations);
                this.emitChange();
                break;
            case ActionTypes.DISLIKE_USER:
                this.setSavingUserLike(to, this._recommendations);
                this.emitChange();
                break;
            case ActionTypes.IGNORE_USER:
                this.emitChange();
                break;
            case ActionTypes.UNLIKE_USER:
                this.setSavingUserLike(to, this._recommendations);
                this.emitChange();
                break;
            case ActionTypes.LIKE_CONTENT:
                this.setSavingContentLike(to, this._recommendations);
                this.emitChange();
                break;
            case ActionTypes.DISLIKE_CONTENT:
                this.setSavingContentLike(to, this._recommendations);
                this.emitChange();
                break;
            case ActionTypes.UNRATE_CONTENT:
                this.setSavingContentLike(to, this._recommendations);
                this.emitChange();
                break;
            case ActionTypes.IGNORE_CONTENT:
                this.emitChange();
                break;
            case ActionTypes.LIKE_USER_SUCCESS:
                this.setLikedUser(to, this._recommendations);
                this.emitChange();
                break;
            case ActionTypes.UNLIKE_USER_SUCCESS:
                this.deleteRatedUser(to, this._recommendations);
                this.emitChange();
                break;
            case ActionTypes.DISLIKE_USER_SUCCESS:
                this.setDislikedUser(to, this._recommendations);
                this.emitChange();
                break;
            case ActionTypes.IGNORE_USER_SUCCESS:
                this.emitChange();
                break;
            case ActionTypes.LIKE_CONTENT_SUCCESS:
                this.setLikedContent(to, this._recommendations);
                this.emitChange();
                break;
            case ActionTypes.DISLIKE_CONTENT_SUCCESS:
                this.setDislikedContent(to, this._recommendations);
                this.emitChange();
                break;
            case ActionTypes.IGNORE_CONTENT_SUCCESS:
                this.emitChange();
                break;
            case ActionTypes.UNRATE_CONTENT_SUCCESS:
                this.deleteRatedContent(to, this._recommendations);
                this.emitChange();
                break;
            case ActionTypes.UPDATE_THREAD_SUCCESS:
                const {threadId} = action;
                delete this._recommendations[threadId];
                this._pagination = {};
                this.emitChange();
                break;
            case ActionTypes.REQUEST_THREADS_SUCCESS:
                const responseThreads = action.response.items;
                Object.keys(responseThreads).forEach((key) => {
                    const thread = responseThreads[key];
                    // let recommendations = [];
                    // let cached = null;
                    // Object.keys(thread.cached).forEach((key) => {
                    //     cached = thread.cached[key];
                    //     const elementId = this.getRecommendationId(cached, thread.category);
                    //     recommendations[elementId] = cached;
                    // });
                    // const _recommendations = thread.category == 'ThreadContent' ? _contentRecommendations : _userRecommendations;
                    // if (this.recommendationsMustBeReplaced(_recommendations, thread.category)) {
                    //     replaceRecommendations(recommendations, _recommendations);
                    // } else {
                    //     mergeAndGetRecommendations(recommendations, _recommendations);
                    // }
                    this._recommendations[thread.id] = [];
                });
                this.emitChange();
                break;
            case ActionTypes.LOGOUT_USER:
                this._recommendations = [];
                this.emitChange();
                break;
            case ActionTypes.ADD_PREV_RECOMMENDATIONS:
                this._replaced[action.threadId] = false;
                this._recommendations[action.threadId] = [];
                this._recommendations[action.threadId] = this.mergeRecommendations(this._prevRecommendations[action.threadId], this._recommendations[action.threadId]);
                this._nextUrl[action.threadId] = this._prevNextUrl[action.threadId];
                this.emitChange();
                break;
            case ActionTypes.REQUEST_NEXT_RECOMMENDATIONS:
                this._loadingRecommendations[action.threadId] = true;
                this.emitChange();
                break;
            case ActionTypes.REQUEST_NEXT_RECOMMENDATIONS_SUCCESS:
                this._recommendations[action.threadId] = this.mergeRecommendations(recommendations, this._recommendations[action.threadId]);
                this._nextUrl[action.threadId] = action.response.pagination.nextLink;
                this._pagination[action.threadId] = action.response.pagination;
                this._loadingRecommendations[action.threadId] = false;
                this.emitChange();
                break;
            case ActionTypes.REQUEST_NEXT_RECOMMENDATIONS_ERROR:
                this._loadingRecommendations[action.threadId] = false;
                this.emitChange();
                break;
            case ActionTypes.REQUEST_RECOMMENDATIONS:
                this._loadingRecommendations[action.threadId] = true;
                this.emitChange();
                break;
            case ActionTypes.REQUEST_RECOMMENDATIONS_SUCCESS:
                this._recommendations[action.threadId] = this._recommendations[action.threadId] || [];
                this._loadingRecommendations[action.threadId] = false;
                // if (this.areBetter(action.threadId, recommendations)) {
                //     if (this._recommendations[action.threadId].length > 0) {
                //         this._prevRecommendations[action.threadId] = [];
                //         this._prevRecommendations[action.threadId] = this.mergeRecommendations(this._recommendations[action.threadId], this._prevRecommendations[action.threadId]);
                //         this._recommendations[action.threadId] = [];
                //         this._replaced[action.threadId] = true;
                //         this._prevNextUrl[action.threadId] = this._nextUrl[action.threadId];
                //     }
                this._recommendations[action.threadId] = this.mergeRecommendations(recommendations, this._recommendations[action.threadId]);
                this._nextUrl[action.threadId] = action.response.pagination.nextLink;
                this._pagination[action.threadId] = action.response.pagination;
                // }
                this.emitChange();
                break;
            case ActionTypes.SAVE_RECOMMENDATIONS_INDEX:
                this._savedIndex = action.index;
                this.emitChange();
        }
    }

    contains(threadId) {
        return (threadId in this._recommendations);
    }

    get(threadId) {
        if (!this.contains(threadId)) {
            return null;
        }
        return this._recommendations[threadId];
    }

    getLength(threadId) {
        if (!this.contains(threadId)) {
            return 0;
        }
        return this._recommendations[threadId].length;
    }

    getAll() {
        return this._recommendations;
    }

    getNextUrl(threadId) {
        return this._loadingRecommendations[threadId] ? null : this._nextUrl[threadId];
    }

    getType(recommendation) {
        if (recommendation && recommendation.content) {
            return THREAD_TYPES.THREAD_CONTENTS;
        }
        return THREAD_TYPES.THREAD_USERS
    }

    getRecommendationUrl(threadId) {
        let url = this.getPaginationUrl(threadId, this._initialPaginationUrl);
        url = url.replace('{threadId}', threadId);
        return url;
    }

    getId(recommendation) {
        let id = null;
        switch (this.getType(recommendation)) {
            case THREAD_TYPES.THREAD_CONTENTS:
                id = recommendation.content.id;
                break;
            case THREAD_TYPES.THREAD_USERS:
                id = recommendation.id;
                break;
        }

        return id;
    }

    getValue(recommendation) {
        let value = null;
        switch (this.getType(recommendation)) {
            case THREAD_TYPES.THREAD_CONTENTS:
                value = recommendation.match;
                break;
            case THREAD_TYPES.THREAD_USERS:
                value = recommendation.similarity;
                break;
        }

        return value;
    }

    isEmpty(threadId) {
        return !this.contains(threadId) || this.get(threadId).length == 0;
    }

    getFirst(threadId, amount = 5) {
        if (!this.contains(threadId)) {
            return [];
        }

        let recommendations = [];
        this.get(threadId).forEach(value => {
            if (recommendations.length >= amount) {
                return recommendations;
            }
            recommendations.push(value);
        });

        return recommendations;
    }

    arePopularRecommendations(threadId) {
        const recommendations = this.get(threadId) || [];
        return !recommendations.some(recommendation => this.getValue(recommendation))
    }

    areBetter(threadId, recommendations) {
        if (this._recommendations[threadId].length == 0) {
            return true;
        }
        return recommendations.length > 0 &&
            this.getValue(recommendations[0]) > this.getValue(this._recommendations[threadId][0]);
    }

    replaced(threadId) {
        const replaced = this._replaced[threadId] || false;
        this._replaced[threadId] = false;
        return replaced;
    }

    getSavedIndex() {
        const savedIndex = this._savedIndex;
        this._savedIndex = 0;
        return savedIndex;
    }

    isLoadingRecommendations(threadId) {
        return this._loadingRecommendations[threadId];
    }

    mergeRecommendations(recommendations, _recommendations) {
        recommendations.forEach(recommendation => _recommendations.push(recommendation));
        return _recommendations;
    }

    setSavingUserLike(userId, _recommendations) {
        this.setUserLike(null, userId, _recommendations);
        return _recommendations;
    }

    setLikedUser(userId, _recommendations) {
        this.setUserLike(1, userId, _recommendations);
        return _recommendations;
    }

    setDislikedUser(userId, _recommendations) {
        this.setUserLike(-1, userId, _recommendations);
        return _recommendations;
    }

    deleteRatedUser(userId, _recommendations) {
        this.setUserLike(0, userId, _recommendations);
        return _recommendations;
    }

    setUserLike(like, userId, _recommendations) {
        _recommendations.forEach((recommendationsByThread, threadId) =>
            recommendationsByThread.forEach((recommendation, index) => {
                if (recommendation.id == userId) {
                    _recommendations[threadId][index]['like'] = like;
                }
            })
        );
        return _recommendations;
    }

    setSavingContentLike(contentId, _recommendations) {
        this.setContentLike(null, contentId, _recommendations);
        return _recommendations;
    }

    setLikedContent(contentId, _recommendations) {
        this.setContentLike(1, contentId, _recommendations);
        return _recommendations;
    }

    setDislikedContent(contentId, _recommendations) {
        this.setContentLike(-1, contentId, _recommendations);
        return _recommendations;
    }

    deleteRatedContent(contentId, _recommendations) {
        this.setContentLike(0, contentId, _recommendations);
        return _recommendations;
    }

    setContentLike(like, contentId, _recommendations) {
        _recommendations.forEach((recommendationsByThread, threadId) =>
            recommendationsByThread.forEach((recommendation, index) => {
                if (recommendation.content && recommendation.content.id == contentId) {
                    _recommendations[threadId][index]['rate'] = like;
                }
            })
        );
        return _recommendations;
    }

}

export default new RecommendationStore();