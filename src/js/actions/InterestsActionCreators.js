import { dispatchAsync, dispatch } from '../dispatcher/Dispatcher';
import ActionTypes from '../constants/ActionTypes';
import * as InterestsAPI from '../api/InterestsAPI';
import InterestStore from '../stores/InterestStore';
import LoginStore from '../stores/LoginStore';

export function requestOwnInterests(userId, link) {
    const isLoading = InterestStore.isLoadingOwnInterests();
    if (isLoading) {
        return Promise.resolve();
    }

    return dispatchAsync(InterestsAPI.getOwnInterests(link), {
        request: ActionTypes.REQUEST_OWN_INTERESTS,
        success: ActionTypes.REQUEST_OWN_INTERESTS_SUCCESS,
        failure: ActionTypes.REQUEST_OWN_INTERESTS_ERROR
    }, {userId})
        .then((data) => {
            const urls = Object.keys(data.result.items).map((key) => {
                return data.result.items[key].url;
            });
            checkImages(userId, urls);
            return data;
        })
        .catch((error) => {
            return error;
        });
}

function checkImages(userId, urls) {
    dispatchAsync(InterestsAPI.checkImages(urls), {
        request: ActionTypes.CHECK_IMAGES,
        success: ActionTypes.CHECK_IMAGES_SUCCESS,
        failure: ActionTypes.CHECK_IMAGES_ERROR
    }, {userId});
}

export function resetInterests(userId) {
    dispatch(ActionTypes.RESET_INTERESTS, {userId});
}

export function setType(contentType, userId = null) {
    userId = userId ? userId : LoginStore.user.id;

    dispatch(ActionTypes.SET_CONTENTS_TYPE, {userId, contentType});
}

export function setShowOnlyCommon(showOnlyCommon, userId) {
    dispatch(ActionTypes.SET_CONTENTS_SHOWONLYCOMMON, {userId, showOnlyCommon})
}

export function requestComparedInterests(userId, otherUserId, link) {
    const isLoading = InterestStore.isLoadingComparedInterests();
    if (isLoading) {
        return Promise.resolve();
    }

    return dispatchAsync(InterestsAPI.getComparedInterests(link), {
        request: ActionTypes.REQUEST_COMPARED_INTERESTS,
        success: ActionTypes.REQUEST_COMPARED_INTERESTS_SUCCESS,
        failure: ActionTypes.REQUEST_COMPARED_INTERESTS_ERROR
    }, {userId, otherUserId})
        .then((data) => {
            const urls = Object.keys(data.result.items).map((key) => {
                const link = data.result.items[key];
                return link.url;
            });
            checkImages(otherUserId, urls);
            return data;
        })
        .catch((error) => {
            return error;
        });
}