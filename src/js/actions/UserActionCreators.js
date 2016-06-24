import { dispatchAsync, dispatch } from '../dispatcher/Dispatcher';
import ActionTypes from '../constants/ActionTypes';
import * as UserAPI from '../api/UserAPI';
import * as ThreadActionCreators from './ThreadActionCreators';
import * as InterestsActionCreators from './InterestsActionCreators';
import UserStore from '../stores/UserStore';
import RecommendationsByThreadStore from '../stores/RecommendationsByThreadStore';
import ThreadsByUserStore from '../stores/ThreadsByUserStore';
import ThreadStore from '../stores/ThreadStore';
import ProfileStore from '../stores/ProfileStore';
import FilterStore from '../stores/FilterStore';
import LocaleStore from '../stores/LocaleStore';

export function requestOwnUser() {
    return dispatchAsync(UserAPI.getOwnUser(), {
        request: ActionTypes.REQUEST_OWN_USER,
        success: ActionTypes.REQUEST_OWN_USER_SUCCESS,
        failure: ActionTypes.REQUEST_OWN_USER_ERROR
    });
}

export function requestUser(userId, fields) {
    // Exit early if we know enough about this user
    if (UserStore.contains(userId, fields)) {
        return;
    }

    return dispatchAsync(UserAPI.getUser(userId), {
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
    }, {userId})
        .then(function (response) {
            checkLocale(response.interfaceLanguage);
            return null;
        })
}

export function editProfile(data) {
    return dispatchAsync(UserAPI.editProfile(data), {
        request: ActionTypes.EDIT_PROFILE,
        success: ActionTypes.EDIT_PROFILE_SUCCESS,
        failure: ActionTypes.EDIT_PROFILE_ERROR
    }, {data})
        .then(function (response) {
            checkLocale(response.interfaceLanguage);
            return null;
        }, (error) => {
            console.error(error);
        });
}

export function changeLocale(locale) {
    dispatch(ActionTypes.CHANGE_LOCALE, {locale})
}

export function checkLocale(locale){
    if (!locale){
        return false;
    }

    if (!LocaleStore.isCurrentLocale(locale)){
        changeLocale(locale);
        dispatchAsync(UserAPI.getMetadata(), {
            request: ActionTypes.REQUEST_METADATA,
            success: ActionTypes.REQUEST_METADATA_SUCCESS,
            failure: ActionTypes.REQUEST_METADATA_ERROR
        });
        dispatchAsync(UserAPI.getFilters(), {
            request: ActionTypes.REQUEST_FILTERS,
            success: ActionTypes.REQUEST_FILTERS_SUCCESS,
            failure: ActionTypes.REQUEST_FILTERS_ERROR
        })
    }
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
    InterestsActionCreators.resetInterests(from);
    InterestsActionCreators.requestOwnInterests(from);
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
