import { dispatchAsync, dispatch } from '../dispatcher/Dispatcher';
import ActionTypes from '../constants/ActionTypes';
import * as TagSuggestionsAPI from '../api/TagSuggestionsAPI';

export function requestContentTagSuggestions(search) {
    dispatchAsync(TagSuggestionsAPI.getContentTagSuggestions(search), {
        request: ActionTypes.REQUEST_TAG_SUGGESTIONS,
        success: ActionTypes.REQUEST_TAG_SUGGESTIONS_SUCCESS,
        failure: ActionTypes.REQUEST_TAG_SUGGESTIONS_ERROR
    }, {search});
}

export function requestProfileTagSuggestions(search, type) {
    dispatchAsync(TagSuggestionsAPI.getProfileTagSuggestions(search, type), {
        request: ActionTypes.REQUEST_TAG_SUGGESTIONS,
        success: ActionTypes.REQUEST_TAG_SUGGESTIONS_SUCCESS,
        failure: ActionTypes.REQUEST_TAG_SUGGESTIONS_ERROR
    }, {search, type});
}

export function resetTagSuggestions() {
    dispatch(ActionTypes.RESET_TAG_SUGGESTIONS, {});
}
