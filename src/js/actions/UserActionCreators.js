import { dispatchAsync, dispatch } from '../dispatcher/Dispatcher';
import ActionTypes from '../constants/ActionTypes';
import * as UserAPI from '../api/UserAPI';
import UserStore from '../stores/UserStore';
import UserRecommendationStore from '../stores/UserRecommendationStore';

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

export function requestThreads(login) {

    dispatchAsync(UserAPI.getThreads(login), {
        request: ActionTypes.REQUEST_THREADS,
        success: ActionTypes.REQUEST_THREADS_SUCCESS,
        failure: ActionTypes.REQUEST_THREADS_ERROR
    }, {login})
}

export function requestRecommendation(threadId) {

    dispatchAsync(UserAPI.getRecommendation(threadId), {
        request: ActionTypes.REQUEST_RECOMMENDATIONS,
        success: ActionTypes.REQUEST_RECOMMENDATIONS_SUCCESS,
        failure: ActionTypes.REQUEST_RECOMMENDATIONS_ERROR
    }, {threadId})
}

export function recommendationsBack() {
    dispatch (ActionTypes.RECOMMENDATIONS_PREV);
}

export function recommendationsNext(threadId) {
    if (UserRecommendationStore.getPosition() >= (UserRecommendationStore.getCount() - 3) ){
        console.log('request more!');
        //requestRecommendation(threadId);
    }
    dispatch (ActionTypes.RECOMMENDATIONS_NEXT);
}
