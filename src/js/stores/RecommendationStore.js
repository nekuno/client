import { THREAD_TYPES } from '../constants/Constants';
import { register, waitFor } from '../dispatcher/Dispatcher';
import { createStore } from '../utils/StoreUtils';
import selectn from 'selectn';
import ActionTypes from '../constants/ActionTypes';
import ThreadStore from '../stores/ThreadStore'

let _recommendations = [];
let _nextUrl = [];
let _replaced = [];
let _prevRecommendations = [];
let _prevNextUrl = [];
let _savedIndex = 0;
let _loadingRecommendations = {};

const RecommendationStore = createStore({

    contains(threadId) {
        return (threadId in _recommendations);
    },

    get(threadId) {
        if (!this.contains(threadId)) {
            return null;
        }
        return _recommendations[threadId];
    },

    getLength(threadId) {
        if (!this.contains(threadId)) {
            return 0;
        }
        return _recommendations[threadId].length;
    },

    getAll() {
        return _recommendations;
    },

    getNextUrl(threadId) {
        return _loadingRecommendations[threadId] ? null : _nextUrl[threadId];
    },

    getType(recommendation) {
        if (recommendation && recommendation.content) {
            return THREAD_TYPES.THREAD_CONTENTS;
        }
        return THREAD_TYPES.THREAD_USERS
    },

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
    },

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
    },

    isEmpty(threadId) {
        return !this.contains(threadId) || this.get(threadId).length == 0;
    },

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
    },

    arePopularRecommendations(threadId) {
        const recommendations = this.get(threadId) || [];
        return !recommendations.some(recommendation => RecommendationStore.getValue(recommendation))
    },

    areBetter(threadId, recommendations) {
        if (_recommendations[threadId].length == 0) {
            return true;
        }
        return recommendations.length > 0 &&
            this.getValue(recommendations[0]) > this.getValue(_recommendations[threadId][0]);
    },

    replaced(threadId) {
        const replaced = _replaced[threadId] || false;
        _replaced[threadId] = false;
        return replaced;
    },

    getSavedIndex() {
        const savedIndex = _savedIndex;
        _savedIndex = 0;
        return savedIndex;
    },

    isLoadingRecommendations(threadId) {
        return _loadingRecommendations[threadId];
    }
});

RecommendationStore.dispatchToken = register(action => {

    waitFor([ThreadStore.dispatchToken]);

    const {to} = action;
    const recommendations = selectn('response.items', action);

    switch (action.type) {
        case ActionTypes.LIKE_USER:
            setSavingUserLike(to, _recommendations);
            RecommendationStore.emitChange();
            break;
        case ActionTypes.DISLIKE_USER:
            setSavingUserLike(to, _recommendations);
            RecommendationStore.emitChange();
            break;
        case ActionTypes.IGNORE_USER:
            RecommendationStore.emitChange();
            break;
        case ActionTypes.UNLIKE_USER:
            setSavingUserLike(to, _recommendations);
            RecommendationStore.emitChange();
            break;
        case ActionTypes.LIKE_CONTENT:
            setSavingContentLike(to, _recommendations);
            RecommendationStore.emitChange();
            break;
        case ActionTypes.DISLIKE_CONTENT:
            setSavingContentLike(to, _recommendations);
            RecommendationStore.emitChange();
            break;
        case ActionTypes.UNRATE_CONTENT:
            setSavingContentLike(to, _recommendations);
            RecommendationStore.emitChange();
            break;
        case ActionTypes.IGNORE_CONTENT:
            RecommendationStore.emitChange();
            break;
        case ActionTypes.LIKE_USER_SUCCESS:
            setLikedUser(to, _recommendations);
            RecommendationStore.emitChange();
            break;
        case ActionTypes.UNLIKE_USER_SUCCESS:
            deleteRatedUser(to, _recommendations);
            RecommendationStore.emitChange();
            break;
        case ActionTypes.DISLIKE_USER_SUCCESS:
            setDislikedUser(to, _recommendations);
            RecommendationStore.emitChange();
            break;
        case ActionTypes.IGNORE_USER_SUCCESS:
            RecommendationStore.emitChange();
            break;
        case ActionTypes.LIKE_CONTENT_SUCCESS:
            setLikedContent(to, _recommendations);
            RecommendationStore.emitChange();
            break;
        case ActionTypes.DISLIKE_CONTENT_SUCCESS:
            setDislikedContent(to, _recommendations);
            RecommendationStore.emitChange();
            break;
        case ActionTypes.IGNORE_CONTENT_SUCCESS:
            RecommendationStore.emitChange();
            break;
        case ActionTypes.UNRATE_CONTENT_SUCCESS:
            deleteRatedContent(to, _recommendations);
            RecommendationStore.emitChange();
            break;
        case ActionTypes.UPDATE_THREAD_SUCCESS:
            const {threadId} = action;
            delete _recommendations[threadId];
            RecommendationStore.emitChange();
            break;
        case ActionTypes.REQUEST_THREADS_SUCCESS:
            /*const responseThreads = selectn('response.entities.thread', action);
             let recommendation = null;
             Object.keys(responseThreads).forEach((key) => {
             const thread = responseThreads[key];
             let recommendations = [];
             let cached = null;
             Object.keys(thread.cached).forEach((key) => {
             cached = thread.cached[key];
             const elementId = RecommendationStore.getRecommendationId(cached, thread.category);
             recommendations[elementId] = cached;
             });
             const _recommendations = thread.category == 'ThreadContent' ? _contentRecommendations : _userRecommendations;
             if (RecommendationStore.recommendationsMustBeReplaced(_recommendations, thread.category)) {
             replaceRecommendations(recommendations, _recommendations);
             } else {
             mergeAndGetRecommendations(recommendations, _recommendations);
             }
             });
             RecommendationStore.emitChange();*/
            break;
        case ActionTypes.LOGOUT_USER:
            _recommendations = [];
            RecommendationStore.emitChange();
            break;
        case ActionTypes.ADD_PREV_RECOMMENDATIONS:
            _replaced[action.threadId] = false;
            _recommendations[action.threadId] = [];
            mergeRecommendations(_prevRecommendations[action.threadId], _recommendations[action.threadId]);
            _nextUrl[action.threadId] = _prevNextUrl[action.threadId];
            RecommendationStore.emitChange();
            break;
        case ActionTypes.REQUEST_NEXT_RECOMMENDATIONS:
            _loadingRecommendations[action.threadId] = true;
            RecommendationStore.emitChange();
            break;
        case ActionTypes.REQUEST_NEXT_RECOMMENDATIONS_SUCCESS:
            mergeRecommendations(recommendations, _recommendations[action.threadId]);
            _nextUrl[action.threadId] = action.response.pagination.nextLink;
            _loadingRecommendations[action.threadId] = false;
            RecommendationStore.emitChange();
            break;
        case ActionTypes.REQUEST_NEXT_RECOMMENDATIONS_ERROR:
            _loadingRecommendations[action.threadId] = false;
            RecommendationStore.emitChange();
            break;
        case ActionTypes.REQUEST_RECOMMENDATIONS:
            _loadingRecommendations[action.threadId] = true;
            break;
        case ActionTypes.REQUEST_RECOMMENDATIONS_SUCCESS:
            _recommendations[action.threadId] = _recommendations[action.threadId] || [];
            _loadingRecommendations[action.threadId] = false;
            if (RecommendationStore.areBetter(action.threadId, recommendations)) {
                if (_recommendations[action.threadId].length > 0) {
                    _prevRecommendations[action.threadId] = [];
                    mergeRecommendations(_recommendations[action.threadId], _prevRecommendations[action.threadId]);
                    _recommendations[action.threadId] = [];
                    _replaced[action.threadId] = true;
                    _prevNextUrl[action.threadId] = _nextUrl[action.threadId];
                }
                mergeRecommendations(recommendations, _recommendations[action.threadId]);
                _nextUrl[action.threadId] = action.response.pagination.nextLink;
            }
            RecommendationStore.emitChange();
            break;
        case ActionTypes.SAVE_RECOMMENDATIONS_INDEX:
            _savedIndex = action.index;
            RecommendationStore.emitChange();
    }

    function mergeRecommendations(recommendations, _recommendations) {
        recommendations.forEach(recommendation => _recommendations.push(recommendation));
    }

    function setSavingUserLike(userId, _recommendations) {
        setUserLike(null, userId, _recommendations);
        return _recommendations;
    }

    function setLikedUser(userId, _recommendations) {
        setUserLike(1, userId, _recommendations);
        return _recommendations;
    }

    function setDislikedUser(userId, _recommendations) {
        setUserLike(-1, userId, _recommendations);
        return _recommendations;
    }

    function deleteRatedUser(userId, _recommendations) {
        setUserLike(0, userId, _recommendations);
        return _recommendations;
    }

    function setUserLike(like, userId, _recommendations) {
        _recommendations.forEach((recommendationsByThread, threadId) =>
            recommendationsByThread.forEach((recommendation, index) => {
                if (recommendation.id == userId) {
                    _recommendations[threadId][index]['like'] = like;
                }
            })
        );
        return _recommendations;
    }

    function setSavingContentLike(contentId, _recommendations) {
        setContentLike(null, contentId, _recommendations);
        return _recommendations;
    }

    function setLikedContent(contentId, _recommendations) {
        setContentLike(1, contentId, _recommendations);
        return _recommendations;
    }

    function setDislikedContent(contentId, _recommendations) {
        setContentLike(-1, contentId, _recommendations);
        return _recommendations;
    }

    function deleteRatedContent(contentId, _recommendations) {
        setContentLike(0, contentId, _recommendations);
        return _recommendations;
    }

    function setContentLike(like, contentId, _recommendations) {
        _recommendations.forEach((recommendationsByThread, threadId) =>
            recommendationsByThread.forEach((recommendation, index) => {
                if (recommendation.content && recommendation.content.id == contentId) {
                    _recommendations[threadId][index]['rate'] = like;
                }
            })
        );
        return _recommendations;
    }
});

export default RecommendationStore;