import { dispatchAsync, dispatch } from '../dispatcher/Dispatcher';
import ActionTypes from '../constants/ActionTypes';
import * as UserAPI from '../api/UserAPI';
import UserStore from '../stores/UserStore';
import RecommendationsByThreadStore from '../stores/RecommendationsByThreadStore';
import ThreadsByUserStore from '../stores/ThreadsByUserStore';
import ThreadStore from '../stores/ThreadStore';
import ProfileStore from '../stores/ProfileStore';

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

export function editProfile(data) {
    return dispatchAsync(UserAPI.editProfile(data), {
        request: ActionTypes.EDIT_PROFILE,
        success: ActionTypes.EDIT_PROFILE_SUCCESS,
        failure: ActionTypes.EDIT_PROFILE_ERROR
    }, {data})
}

export function requestMetadata() {

    if (!ProfileStore.getMetadata()) {
        dispatchAsync(UserAPI.getMetadata(), {
            request: ActionTypes.REQUEST_METADATA,
            success: ActionTypes.REQUEST_METADATA_SUCCESS,
            failure: ActionTypes.REQUEST_METADATA_ERROR
        });
    }
}

export function requestThreadPage(userId) {
    if (!UserStore.contains(userId)) {
        this.requestUser(userId, null);
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

    dispatchAsync(threads, {
        request: ActionTypes.REQUEST_THREADS,
        success: ActionTypes.REQUEST_THREADS_SUCCESS,
        failure: ActionTypes.REQUEST_THREADS_ERROR
    }, {userId})
}

export function createThread(userId, data) {
    dispatchAsync(UserAPI.createThread(data),{
        request: ActionTypes.CREATE_THREAD,
        success: ActionTypes.CREATE_THREAD_SUCCESS,
        failure: ActionTypes.CREATE_THREAD_ERROR
    }, data)
}

export function requestRecommendationPage(userId, threadId) {

    if (!ThreadStore.contains(threadId)) {
        this.requestThreads(userId);
    }

    if (!UserStore.contains(userId)) {
        this.requestUser(userId, null);
    }

    requestRecommendation(threadId);

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
    dispatchAsync(UserAPI.getStats(), {
        request: ActionTypes.REQUEST_STATS,
        success: ActionTypes.REQUEST_STATS_SUCCESS,
        failure: ActionTypes.REQUEST_STATS_ERROR
    }, {userId})
}

export function requestComparedStats(userId1, userId2) {
    dispatchAsync(UserAPI.getComparedStats(userId2), {
        request: ActionTypes.REQUEST_COMPARED_STATS,
        success: ActionTypes.REQUEST_COMPARED_STATS_SUCCESS,
        failure: ActionTypes.REQUEST_COMPARED_STATS_ERROR
    }, {userId1, userId2})
}

export function requestMatching(userId1, userId2) {
    dispatchAsync(UserAPI.getMatching(userId2), {
        request: ActionTypes.REQUEST_MATCHING,
        success: ActionTypes.REQUEST_MATCHING_SUCCESS,
        failure: ActionTypes.REQUEST_MATCHING_ERROR
    }, {userId1, userId2})
}

export function requestSimilarity(userId1, userId2) {
    dispatchAsync(UserAPI.getSimilarity(userId2), {
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

    if (RecommendationsByThreadStore.getPosition(threadId) === ( RecommendationsByThreadStore.getIds(threadId).length - 15)) {
        const nextUrl = RecommendationsByThreadStore.getNextPageUrl(threadId);
        if (nextUrl) {
            requestRecommendation(threadId, nextUrl);
        }
    }
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

export function blockUser(from, to) {
    dispatchAsync(UserAPI.setBlockUser(to), {
        request: ActionTypes.BLOCK_USER,
        success: ActionTypes.BLOCK_USER_SUCCESS,
        failure: ActionTypes.BLOCK_USER_ERROR
    }, {from, to});
}

export function deleteBlockUser(from, to) {
    dispatchAsync(UserAPI.unsetBlockUser(to), {
        request: ActionTypes.UNBLOCK_USER,
        success: ActionTypes.UNBLOCK_USER_SUCCESS,
        failure: ActionTypes.UNBLOCK_USER_ERROR
    }, {from, to});
}

export function likeUser(from, to) {
    dispatchAsync(UserAPI.setLikeUser(to), {
        request: ActionTypes.LIKE_USER,
        success: ActionTypes.LIKE_USER_SUCCESS,
        failure: ActionTypes.LIKE_USER_ERROR
    }, {from, to});
}

export function deleteLikeUser(from, to) {
    dispatchAsync(UserAPI.unsetLikeUser(to), {
        request: ActionTypes.UNLIKE_USER,
        success: ActionTypes.UNLIKE_USER_SUCCESS,
        failure: ActionTypes.UNLIKE_USER_ERROR
    }, {from, to});
}

export function likeContent(from, to) {
    dispatchAsync(UserAPI.setLikeContent(to), {
        request: ActionTypes.LIKE_CONTENT,
        success: ActionTypes.LIKE_CONTENT_SUCCESS,
        failure: ActionTypes.LIKE_CONTENT_ERROR
    }, {from, to});
}

export function deleteLikeContent(from, to) {
    dispatchAsync(UserAPI.unsetLikeContent(to), {
        request: ActionTypes.UNLIKE_CONTENT,
        success: ActionTypes.UNLIKE_CONTENT_SUCCESS,
        failure: ActionTypes.UNLIKE_CONTENT_ERROR
    }, {from, to});
}

export function requestBlockUser(from, to) {
    dispatchAsync(UserAPI.getBlockUser(to), {
        request: ActionTypes.REQUEST_BLOCK_USER,
        success: ActionTypes.REQUEST_BLOCK_USER_SUCCESS,
        failure: ActionTypes.REQUEST_BLOCK_USER_ERROR
    }, {from, to});
}

export function requestLikeUser(from, to) {
    dispatchAsync(UserAPI.getLikeUser(to), {
        request: ActionTypes.REQUEST_LIKE_USER,
        success: ActionTypes.REQUEST_LIKE_USER_SUCCESS,
        failure: ActionTypes.REQUEST_LIKE_USER_ERROR
    }, {from, to});
}
