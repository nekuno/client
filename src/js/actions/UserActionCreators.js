import { dispatchAsync, dispatch } from '../dispatcher/Dispatcher';
import ActionTypes from '../constants/ActionTypes';
import * as UserAPI from '../api/UserAPI';
import UserStore from '../stores/UserStore';
import RecommendationsByThreadStore from '../stores/RecommendationsByThreadStore';
import ThreadStore from '../stores/ThreadStore';
import ProfileStore from '../stores/ProfileStore';
import QuestionStore from '../stores/QuestionStore';

export function requestUser(userId, fields) {
    // Exit early if we know enough about this user
    if (UserStore.contains(userId, fields)) {
        return;
    }

    dispatchAsync(UserAPI.getUser(userId), {
        request: ActionTypes.REQUEST_USER,
        success: ActionTypes.REQUEST_USER_SUCCESS,
        failure: ActionTypes.REQUEST_USER_ERROR
    }, {userId});
}

export function requestProfile(userId, fields) {
    // Exit early if we know enough about this user
    if (ProfileStore.contains(userId, fields)) {
        return;
    }

    dispatchAsync(UserAPI.getProfile(userId), {
        request: ActionTypes.REQUEST_PROFILE,
        success: ActionTypes.REQUEST_PROFILE_SUCCESS,
        failure: ActionTypes.REQUEST_PROFILE_ERROR
    }, {userId});
}

export function requestMetadata(userId){

    if (!ProfileStore.getMetadata()){
        dispatchAsync(UserAPI.getMetadata(userId), {
            request: ActionTypes.REQUEST_METADATA,
            success: ActionTypes.REQUEST_METADATA_SUCCESS,
            failure: ActionTypes.REQUEST_METADATA_ERROR
        }, {userId});
    }

}

export function requestThreads(userId) {

    dispatchAsync(UserAPI.getThreads(userId), {
        request: ActionTypes.REQUEST_THREADS,
        success: ActionTypes.REQUEST_THREADS_SUCCESS,
        failure: ActionTypes.REQUEST_THREADS_ERROR
    }, {userId})
}

export function requestRecommendationPage(userId, threadId) {

    if (!ThreadStore.contains(threadId)) {
        this.requestThreads(userId);
    }
    requestRecommendation(threadId);

    dispatch(ActionTypes.REQUEST_RECOMMENDATIONS_PAGE);
}

export function requestRecommendation(threadId, url = null) {

    let recommendation = {};
    if (url) {
        recommendation = UserAPI.getRecommendation(threadId, url);
    } else {
        recommendation = UserAPI.getRecommendation(threadId);
    }

    dispatchAsync((recommendation), {
        request: ActionTypes.REQUEST_RECOMMENDATIONS,
        success: ActionTypes.REQUEST_RECOMMENDATIONS_SUCCESS,
        failure: ActionTypes.REQUEST_RECOMMENDATIONS_ERROR
    }, {threadId})
}

export function requestStats(userId) {
    dispatchAsync(UserAPI.getStats(userId), {
        request: ActionTypes.REQUEST_STATS,
        success: ActionTypes.REQUEST_STATS_SUCCESS,
        failure: ActionTypes.REQUEST_STATS_ERROR
    }, {userId})
}

export function requestMatching(userId1, userId2) {
    dispatchAsync(UserAPI.getMatching(userId1, userId2), {
        request: ActionTypes.REQUEST_MATCHING,
        success: ActionTypes.REQUEST_MATCHING_SUCCESS,
        failure: ActionTypes.REQUEST_MATCHING_ERROR
    }, {userId1, userId2})
}

export function requestSimilarity(userId1, userId2) {
    dispatchAsync(UserAPI.getSimilarity(userId1, userId2), {
        request: ActionTypes.REQUEST_SIMILARITY,
        success: ActionTypes.REQUEST_SIMILARITY_SUCCESS,
        failure: ActionTypes.REQUEST_SIMILARITY_ERROR
    }, {userId1, userId2})
}

export function recommendationsBack() {
    dispatch(ActionTypes.RECOMMENDATIONS_PREV);
}

export function recommendationsNext(threadId) {

    dispatch(ActionTypes.RECOMMENDATIONS_NEXT, {threadId});

    if (RecommendationsByThreadStore.getPosition(threadId) >= ( RecommendationsByThreadStore.getIds(threadId).length - 3)) {
        const nextUrl = RecommendationsByThreadStore.getNextPageUrl(threadId);
        if (nextUrl) {
            requestRecommendation(threadId, nextUrl);
        }
    }
}

export function requestQuestions(userId, fields) {
    // Exit early if we know enough about this user
    if (QuestionStore.contains(userId, fields)) {
        return;
    }

    dispatchAsync(UserAPI.getQuestions(userId), {
        request: ActionTypes.REQUEST_QUESTIONS,
        success: ActionTypes.REQUEST_QUESTIONS_SUCCESS,
        failure: ActionTypes.REQUEST_QUESTIONS_ERROR
    }, {userId});
}

export function likeUser(from, to) {
    dispatchAsync(UserAPI.setLikeUser(from, to), {
        request: ActionTypes.LIKE_USER,
        success: ActionTypes.LIKE_USER_SUCCESS,
        failure: ActionTypes.LIKE_USER_ERROR
    }, {from, to});
}

export function deleteLikeUser(from, to) {
    dispatchAsync(UserAPI.unsetLikeUser(from, to), {
        request: ActionTypes.UNLIKE_USER,
        success: ActionTypes.UNLIKE_USER_SUCCESS,
        failure: ActionTypes.UNLIKE_USER_ERROR
    }, {from, to});
}

export function likeContent(from, to) {
    dispatchAsync(UserAPI.setLikeContent(from, to), {
        request: ActionTypes.LIKE_CONTENT,
        success: ActionTypes.LIKE_CONTENT_SUCCESS,
        failure: ActionTypes.LIKE_CONTENT_ERROR
    }, {from, to});
}

export function deleteLikeContent(from, to) {
    dispatchAsync(UserAPI.unsetLikeContent(from, to), {
        request: ActionTypes.UNLIKE_CONTENT,
        success: ActionTypes.UNLIKE_CONTENT_SUCCESS,
        failure: ActionTypes.UNLIKE_CONTENT_ERROR
    }, {from, to});
}