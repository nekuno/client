import { dispatchAsync, dispatch } from '../dispatcher/Dispatcher';
import ActionTypes from '../constants/ActionTypes';
import * as UserActionCreators from './UserActionCreators';
import * as UserAPI from '../api/UserAPI';
import UserStore from '../stores/UserStore';
import RecommendationsByThreadStore from '../stores/RecommendationsByThreadStore';
import ThreadsByUserStore from '../stores/ThreadsByUserStore';
import ThreadStore from '../stores/ThreadStore';
import ProfileStore from '../stores/ProfileStore';
import FilterStore from '../stores/FilterStore';

export function requestThreadPage(userId) {
    if (!UserStore.contains(userId)) {
        UserActionCreators.requestUser(userId, null);
    }

    requestThreads(userId);
}

export function requestThreads(userId, url = null) {

    let threads = {};
    if (url) {
        threads = UserAPI.getThreads(url);
    } else {
        threads = UserAPI.getThreads();
    }

    return dispatchAsync(threads, {
        request: ActionTypes.REQUEST_THREADS,
        success: ActionTypes.REQUEST_THREADS_SUCCESS,
        failure: ActionTypes.REQUEST_THREADS_ERROR
    }, {userId})
}

export function createThread(userId, data) {
    return dispatchAsync(UserAPI.createThread(data),{
        request: ActionTypes.CREATE_THREAD,
        success: ActionTypes.CREATE_THREAD_SUCCESS,
        failure: ActionTypes.CREATE_THREAD_ERROR
    }, {userId, data})
}

export function createDefaultThreads() {
    return dispatchAsync(UserAPI.createDefaultThreads(), {
        request: ActionTypes.CREATE_DEFAULT_THREADS,
        success: ActionTypes.CREATE_DEFAULT_THREADS_SUCCESS,
        failure: ActionTypes.CREATE_DEFAULT_THREADS_ERROR
    })
}

export function updateThread(threadId, data) {
    return dispatchAsync(UserAPI.updateThread(threadId, data), {
        request: ActionTypes.UPDATE_THREAD,
        success: ActionTypes.UPDATE_THREAD_SUCCESS,
        failure: ActionTypes.UPDATE_THREAD_ERROR
    }, {threadId})
}

export function deleteThread(threadId) {
    return dispatchAsync(UserAPI.removeThread(threadId), {
        request: ActionTypes.DELETE_THREAD,
        success: ActionTypes.DELETE_THREAD_SUCCESS,
        failure: ActionTypes.DELETE_THREAD_ERROR
    }, {threadId})
}

export function threadsNext(userId) {

    dispatch(ActionTypes.THREADS_NEXT, {userId});

    if (ThreadsByUserStore.getPosition(userId) >= ( ThreadsByUserStore.getIds(userId).length - 3)) {
        const nextUrl = ThreadsByUserStore.getNextPageUrl(userId);
        if (nextUrl) {
            requestThreads(userId, nextUrl);
        }
    }
}

export function requestFilters() {
    if (FilterStore.filters != null){
        return;
    }

    dispatchAsync(UserAPI.getFilters(), {
        request: ActionTypes.REQUEST_FILTERS,
        success: ActionTypes.REQUEST_FILTERS_SUCCESS,
        failure: ActionTypes.REQUEST_FILTERS_ERROR
    })
}

export function requestRecommendationPage(userId, threadId) {

    let _self = this;
    let promise = new Promise(function (resolve) {
        resolve(true);
    });
    if (!ThreadStore.contains(threadId)) {
        promise = promise.then(function () { return _self.requestThreads(userId); });
    }

    promise.then(function () { requestRecommendation(threadId) });

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

export function recommendationsBack() {
    dispatch(ActionTypes.RECOMMENDATIONS_PREV);
}

export function recommendationsNext(threadId) {

    dispatch(ActionTypes.RECOMMENDATIONS_NEXT, {threadId});

    if (RecommendationsByThreadStore.getPosition(threadId) === ( RecommendationsByThreadStore.getRecommendationsFromThread(threadId).length - 15)) {
        const nextUrl = RecommendationsByThreadStore.getNextPageUrl(threadId);
        if (nextUrl) {
            requestRecommendation(threadId, nextUrl);
        }
    }
}

