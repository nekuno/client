import { dispatchAsync, dispatch } from '../dispatcher/Dispatcher';
import ActionTypes from '../constants/ActionTypes';
import * as UserAPI from '../api/UserAPI';
import UserStore from '../stores/UserStore';
import RecommendationStore from '../stores/RecommendationStore';
import ThreadStore from '../stores/ThreadStore';

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

export function requestRecommendationPage(login,threadId){
    if (!ThreadStore.contains(threadId)){
        this.requestThreads(login);
    }
    requestRecommendation(threadId);

    dispatch(ActionTypes.REQUEST_RECOMMENDATIONS_PAGE);
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
    /*if (RecommendationStore.getPosition() >= (UserRecommendationStore.getCount() - 3) ){
        console.log('request more!');
        //requestRecommendation(threadId);
    }*/
    dispatch (ActionTypes.RECOMMENDATIONS_NEXT);
}
