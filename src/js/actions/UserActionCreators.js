import { dispatchAsync, dispatch } from '../dispatcher/Dispatcher';
import ActionTypes from '../constants/ActionTypes';
import * as UserAPI from '../api/UserAPI';
import * as InterestsActionCreators from './InterestsActionCreators';
import RouterActionCreators from "./RouterActionCreators";
import UserStore from '../stores/UserStore';
import ProfileStore from '../stores/ProfileStore';
import LocaleStore from '../stores/LocaleStore';
import InterestStore from '../stores/InterestStore';
import Framework7Service from '../services/Framework7Service';

export function validateUsername(username) {
    return dispatchAsync(UserAPI.validateUsername(username), {
        request: ActionTypes.REQUEST_VALIDATE_USERNAME,
        success: ActionTypes.REQUEST_VALIDATE_USERNAME_SUCCESS,
        failure: ActionTypes.REQUEST_VALIDATE_USERNAME_ERROR
    }, {username});
}

export function requestAutologinData() {
    return dispatchAsync(UserAPI.getAutologinData(), {
        request: ActionTypes.REQUEST_AUTOLOGIN,
        success: ActionTypes.REQUEST_AUTOLOGIN_SUCCESS,
        failure: ActionTypes.REQUEST_AUTOLOGIN_ERROR
    });
}

export function requestOwnUser() {
    return dispatchAsync(UserAPI.getOwnUser(), {
        request: ActionTypes.REQUEST_OWN_USER,
        success: ActionTypes.REQUEST_OWN_USER_SUCCESS,
        failure: ActionTypes.REQUEST_OWN_USER_ERROR
    });
}

export function requestUser(userSlug, fields) {
    // Exit early if we know enough about this user
    if (UserStore.containsSlug(userSlug, fields)) {
        return new Promise((resolve) => {
            resolve(true)
        });
    }

    return dispatchAsync(UserAPI.getUser(userSlug), {
        request: ActionTypes.REQUEST_USER,
        success: ActionTypes.REQUEST_USER_SUCCESS,
        failure: ActionTypes.REQUEST_USER_ERROR
    }, {userSlug})
        .catch((status) => {
            if (status.error) {
                Framework7Service.nekunoApp().alert(status.error, () => {
                    const path = '/discover';
                    console.log('Redirecting to path', path);
                    RouterActionCreators.replaceRoute(path);
                });
            }
            throw status;
        });
}

export function setOwnEnabled(enabled) {
    return dispatchAsync(UserAPI.setOwnEnabled(enabled), {
        request: ActionTypes.SET_ENABLED,
        success: ActionTypes.SET_ENABLED_SUCCESS,
        failure: ActionTypes.SET_ENABLED_ERROR
    }, {enabled});
}

export function editUser(data) {
    return dispatchAsync(UserAPI.editUser(data), {
        request: ActionTypes.EDIT_USER,
        success: ActionTypes.EDIT_USER_SUCCESS,
        failure: ActionTypes.EDIT_USER_ERROR
    });
}

export function requestOwnProfile(slug) {
    return dispatchAsync(UserAPI.getOwnProfile(), {
        request: ActionTypes.REQUEST_OWN_PROFILE,
        success: ActionTypes.REQUEST_OWN_PROFILE_SUCCESS,
        failure: ActionTypes.REQUEST_OWN_PROFILE_ERROR
    }, {slug})
        .then(() => {
            let profile = ProfileStore.get(slug);
            checkLocale(profile.interfaceLanguage);
            return null;
        }, () => {
            return null;
        });
}

export function requestProfile(slug, fields) {
    // Exit early if we know enough about this user
    if (ProfileStore.contains(slug, fields)) {
        return;
    }

    dispatchAsync(UserAPI.getProfile(slug), {
        request: ActionTypes.REQUEST_PROFILE,
        success: ActionTypes.REQUEST_PROFILE_SUCCESS,
        failure: ActionTypes.REQUEST_PROFILE_ERROR
    }, {slug});
}

export function requestSharedUser(slug) {
    if (UserStore.containsSlug(slug)){
        return;
    }
    dispatchAsync(UserAPI.getPublicUser(slug), {
        request: ActionTypes.REQUEST_PUBLIC_USER,
        success: ActionTypes.REQUEST_PUBLIC_USER_SUCCESS,
        failure: ActionTypes.REQUEST_PUBLIC_USER_ERROR
    }, {slug});
}

export function editProfile(data, oldProfile) {
    return dispatchAsync(UserAPI.editProfile(data), {
        request: ActionTypes.EDIT_PROFILE,
        success: ActionTypes.EDIT_PROFILE_SUCCESS,
        failure: ActionTypes.EDIT_PROFILE_ERROR
    }, {data, oldProfile})
        .then(function(response) {
            checkLocale(response.interfaceLanguage);
            return null;
        }, () => {
            return null;
        });
}

export function changeLocale(locale) {
    dispatch(ActionTypes.CHANGE_LOCALE, {locale});
}

export function checkLocale(locale) {
    if (!locale) {
        return false;
    }

    if (!LocaleStore.isCurrentLocale(locale)) {
        changeLocale(locale);
        dispatchAsync(UserAPI.getMetadata(), {
            request: ActionTypes.REQUEST_METADATA,
            success: ActionTypes.REQUEST_METADATA_SUCCESS,
            failure: ActionTypes.REQUEST_METADATA_ERROR
        });
        dispatchAsync(UserAPI.getCategories(), {
            request: ActionTypes.REQUEST_CATEGORIES,
            success: ActionTypes.REQUEST_CATEGORIES_SUCCESS,
            failure: ActionTypes.REQUEST_CATEGORIES_ERROR
        });
        dispatchAsync(UserAPI.getFilters(), {
            request: ActionTypes.REQUEST_FILTERS,
            success: ActionTypes.REQUEST_FILTERS_SUCCESS,
            failure: ActionTypes.REQUEST_FILTERS_ERROR
        });
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
    if (!ProfileStore.getCategories() && !ProfileStore.isLoadingCategories()) {
        dispatchAsync(UserAPI.getCategories(), {
            request: ActionTypes.REQUEST_CATEGORIES,
            success: ActionTypes.REQUEST_CATEGORIES_SUCCESS,
            failure: ActionTypes.REQUEST_CATEGORIES_ERROR
        });
    }
}

export function requestStats(userId) {
    return dispatchAsync(UserAPI.getStats(), {
        request: ActionTypes.REQUEST_STATS,
        success: ActionTypes.REQUEST_STATS_SUCCESS,
        failure: ActionTypes.REQUEST_STATS_ERROR
    }, {userId})
}

export function requestComparedStats(userId1, userId2) {
    return dispatchAsync(UserAPI.getComparedStats(userId2), {
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

export function likeUser(from, to, originContext, originName) {
    dispatchAsync(UserAPI.setLikeUser(to, originContext, originName), {
        request: ActionTypes.LIKE_USER,
        success: ActionTypes.LIKE_USER_SUCCESS,
        failure: ActionTypes.LIKE_USER_ERROR
    }, {from, to});
}

export function dislikeUser(from, to, originContext, originName) {
    dispatchAsync(UserAPI.setDislikeUser(to, originContext, originName), {
        request: ActionTypes.DISLIKE_USER,
        success: ActionTypes.DISLIKE_USER_SUCCESS,
        failure: ActionTypes.DISLIKE_USER_ERROR
    }, {from, to});
}

export function requestOwnLiked(url) {
    return dispatchAsync(UserAPI.requestOwnLiked(url), {
        request: ActionTypes.REQUEST_OWN_LIKED_USERS,
        success: ActionTypes.REQUEST_OWN_LIKED_USERS_SUCCESS,
        failure: ActionTypes.REQUEST_OWN_LIKED_USERS_ERROR
    });
}

export function ignoreUser(from, to, originContext, originName) {
    dispatchAsync(UserAPI.setIgnoreUser(to, originContext, originName), {
        request: ActionTypes.IGNORE_USER,
        success: ActionTypes.IGNORE_USER_SUCCESS,
        failure: ActionTypes.IGNORE_USER_ERROR
    }, {from, to});
}

export function deleteLikeUser(from, to) {
    dispatchAsync(UserAPI.unsetRateUser(to), {
        request: ActionTypes.UNLIKE_USER,
        success: ActionTypes.UNLIKE_USER_SUCCESS,
        failure: ActionTypes.UNLIKE_USER_ERROR
    }, {from, to});
}

export function reportUser(from, to, data) {
    dispatchAsync(UserAPI.reportUser(to, data), {
        request: ActionTypes.REPORT_USER,
        success: ActionTypes.REPORT_USER_SUCCESS,
        failure: ActionTypes.REPORT_USER_ERROR
    }, {from, to, data});
}

export function likeContent(from, to, originContext, originName) {
    dispatchAsync(UserAPI.setLikeContent(to, originContext, originName), {
        request: ActionTypes.LIKE_CONTENT,
        success: ActionTypes.LIKE_CONTENT_SUCCESS,
        failure: ActionTypes.LIKE_CONTENT_ERROR
    }, {from, to});
    InterestsActionCreators.resetInterests(from);
    // InterestsActionCreators.requestOwnInterests(from);
}

export function dislikeContent(from, to, originContext, originName) {
    dispatchAsync(UserAPI.setDislikeContent(to, originContext, originName), {
        request: ActionTypes.DISLIKE_CONTENT,
        success: ActionTypes.DISLIKE_CONTENT_SUCCESS,
        failure: ActionTypes.DISLIKE_CONTENT_ERROR
    }, {from, to});
    InterestsActionCreators.resetInterests(from);
    // InterestsActionCreators.requestOwnInterests(from);
}

export function ignoreContent(from, to, originContext, originName) {
    dispatchAsync(UserAPI.setIgnoreContent(to, originContext, originName), {
        request: ActionTypes.IGNORE_CONTENT,
        success: ActionTypes.IGNORE_CONTENT_SUCCESS,
        failure: ActionTypes.IGNORE_CONTENT_ERROR
    }, {from, to});
}

export function deleteRateContent(from, to) {
    dispatchAsync(UserAPI.unsetRateContent(to), {
        request: ActionTypes.UNRATE_CONTENT,
        success: ActionTypes.UNRATE_CONTENT_SUCCESS,
        failure: ActionTypes.UNRATE_CONTENT_ERROR
    }, {from, to});
    InterestsActionCreators.resetInterests(from);
    const interestUrl = InterestStore.getRequestInterestsUrl(from);
    InterestsActionCreators.requestOwnInterests(from, interestUrl);
}

export function reportContent(data) {
    return dispatchAsync(UserAPI.reportContent(data), {
        request: ActionTypes.REPORT_CONTENT,
        success: ActionTypes.REPORT_CONTENT_SUCCESS,
        failure: ActionTypes.REPORT_CONTENT_ERROR
    }, {data});
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
