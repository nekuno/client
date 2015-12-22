import { dispatchAsync, dispatch } from '../dispatcher/Dispatcher';
import ActionTypes from '../constants/ActionTypes';
import * as UserAPI from '../api/UserAPI';
import UserStore from '../stores/UserStore';
import RecommendationsByThreadStore from '../stores/RecommendationsByThreadStore';
import ThreadStore from '../stores/ThreadStore';
import ProfileStore from '../stores/ProfileStore';

export function requestUser(login, fields) {
    // Exit early if we know enough about this user
    if (UserStore.contains(login, fields)) {
        return;
    }

    dispatchAsync(UserAPI.getUser(login), {
        request: ActionTypes.REQUEST_USER,
        success: ActionTypes.REQUEST_USER_SUCCESS,
        failure: ActionTypes.REQUEST_USER_ERROR
    }, {login});
}

export function requestProfile(login, fields) {
    // Exit early if we know enough about this user
    if (ProfileStore.contains(login, fields)) {
        return;
    }

    dispatchAsync(UserAPI.getProfile(login), {
        request: ActionTypes.REQUEST_PROFILE,
        success: ActionTypes.REQUEST_PROFILE_SUCCESS,
        failure: ActionTypes.REQUEST_PROFILE_ERROR
    }, {login});
}

export function requestThreads(login) {

    dispatchAsync(UserAPI.getThreads(login), {
        request: ActionTypes.REQUEST_THREADS,
        success: ActionTypes.REQUEST_THREADS_SUCCESS,
        failure: ActionTypes.REQUEST_THREADS_ERROR
    }, {login})
}

export function requestRecommendationPage(login,threadId){
    if (!ThreadStore.contains(threadId)){
        this.requestThreads(login);
    }
    requestRecommendation(threadId);

    dispatch(ActionTypes.REQUEST_RECOMMENDATIONS_PAGE);
}

export function requestRecommendation(threadId, url = null) {

    let recommendation = {};
    if (url){
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
export function recommendationsBack() {
    dispatch (ActionTypes.RECOMMENDATIONS_PREV);
}

export function recommendationsNext(threadId) {

    dispatch (ActionTypes.RECOMMENDATIONS_NEXT, {threadId});

    if (RecommendationsByThreadStore.getPosition(threadId) >= ( RecommendationsByThreadStore.getIds(threadId).length - 3) ){
        const nextUrl = RecommendationsByThreadStore.getNextPageUrl(threadId);
        if (nextUrl) {
            requestRecommendation(threadId, nextUrl);
        }
    }
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
