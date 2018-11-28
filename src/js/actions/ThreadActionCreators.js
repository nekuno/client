import { dispatchAsync, dispatch } from '../dispatcher/Dispatcher';
import ActionTypes from '../constants/ActionTypes';
import * as UserAPI from '../api/UserAPI';
import RecommendationStore from '../stores/RecommendationStore';
import ThreadStore from '../stores/ThreadStore';
import ProfileStore from '../stores/ProfileStore';
import FilterStore from '../stores/FilterStore';
import LoginStore from '../stores/LoginStore';

export function requestThreadPage(userId, groupId = null) {
    // requestThreads(userId).then((action) => {
    //     const existsDefault = action.items.some(item => !!item.default);
    //     action.items.forEach(item => {
    //         if ((groupId && groupId === item.groupId) || !groupId && !item.groupId && (item.default || !existsDefault)) {
    //             this.requestRecommendations(item.id);
    //         }
    //     });
    // });
    return requestThreads(userId);
}

export function requestThreads(userId = null, url = null) {

    if (null === userId) {
        userId = LoginStore.user.id;
    }

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
    return dispatchAsync(UserAPI.createThread(data), {
        request: ActionTypes.CREATE_THREAD,
        success: ActionTypes.CREATE_THREAD_SUCCESS,
        failure: ActionTypes.CREATE_THREAD_ERROR
    }, {userId, data})
}

export function updateThread(threadId, data) {
    return dispatchAsync(UserAPI.updateThread(threadId, data), {
        request: ActionTypes.UPDATE_THREAD,
        success: ActionTypes.UPDATE_THREAD_SUCCESS,
        failure: ActionTypes.UPDATE_THREAD_ERROR
    }, {threadId, data})
}

export function deleteThread(threadId) {
    return dispatchAsync(UserAPI.removeThread(threadId), {
        request: ActionTypes.DELETE_THREAD,
        success: ActionTypes.DELETE_THREAD_SUCCESS,
        failure: ActionTypes.DELETE_THREAD_ERROR
    }, {threadId})
}

export function requestFilters(forceReload = false) {

    const isEmpty = FilterStore.filters === null && !FilterStore.isLoading();
    if (isEmpty || forceReload) {
        dispatchAsync(UserAPI.getFilters(), {
            request: ActionTypes.REQUEST_FILTERS,
            success: ActionTypes.REQUEST_FILTERS_SUCCESS,
            failure: ActionTypes.REQUEST_FILTERS_ERROR
        });
    }

    if (!ProfileStore.getCategories() && !ProfileStore.isLoadingCategories()) {
        dispatchAsync(UserAPI.getCategories(), {
            request: ActionTypes.REQUEST_CATEGORIES,
            success: ActionTypes.REQUEST_CATEGORIES_SUCCESS,
            failure: ActionTypes.REQUEST_CATEGORIES_ERROR
        });
    }
}

export function requestRecommendationPage(userId, threadId) {
    let promise = new Promise(function(resolve) {
        resolve(true);
    });
    if (!ThreadStore.contains(threadId)) {
        promise = promise.then(() => {
            this.requestThreads(userId);
        }, (error) => {
            console.log(error)
        });
    }

    promise.then(() => {
        requestRecommendations(threadId)
    }, (error) => {
        console.log(error)
    });

}

export function requestRecommendations(threadId, url) {
    return dispatchAsync((UserAPI.getRecommendations(threadId, url)), {
        request: ActionTypes.REQUEST_RECOMMENDATIONS,
        success: ActionTypes.REQUEST_RECOMMENDATIONS_SUCCESS,
        failure: ActionTypes.REQUEST_RECOMMENDATIONS_ERROR
    }, {threadId});
}

export function addPrevRecommendation(threadId) {
    dispatch(ActionTypes.ADD_PREV_RECOMMENDATIONS, {threadId});
}

export function recommendationsNext(threadId) {
    const nextUrl = RecommendationStore.getNextUrl(threadId);
    if (nextUrl && !RecommendationStore.isLoadingRecommendations(threadId)) {
        return dispatchAsync((UserAPI.getRecommendations(threadId, nextUrl)), {
            request: ActionTypes.REQUEST_NEXT_RECOMMENDATIONS,
            success: ActionTypes.REQUEST_NEXT_RECOMMENDATIONS_SUCCESS,
            failure: ActionTypes.REQUEST_NEXT_RECOMMENDATIONS_ERROR
        }, {threadId});
    }

    return Promise.resolve();
}

export function saveIndex(index) {
    dispatch(ActionTypes.SAVE_RECOMMENDATIONS_INDEX, {index});
}

export function requestDefaultRecommendations() {

    return this.requestThreads().then(() => {
            setTimeout(() => {
                const defaultThread = ThreadStore.getOwnDefault();
                if (null === defaultThread) {
                    return;
                }

                const defaultThreadId = defaultThread.id;
                this.requestRecommendations(defaultThreadId);
            }, 1);
        }
    );
}

