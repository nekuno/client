import { dispatchAsync, dispatch } from '../dispatcher/Dispatcher';
import ActionTypes from '../constants/ActionTypes';
import * as TagSuggestionsAPI from '../api/TagSuggestionsAPI';
import TagSuggestionService from '../services/TagSuggestionService';

export function requestContentTagSuggestions(search) {
    dispatchAsync(TagSuggestionsAPI.getContentTagSuggestions(search), {
        request: ActionTypes.REQUEST_TAG_SUGGESTIONS,
        success: ActionTypes.REQUEST_TAG_SUGGESTIONS_SUCCESS,
        failure: ActionTypes.REQUEST_TAG_SUGGESTIONS_ERROR
    }, {search});
}

export function requestProfileTagSuggestions(search, tagType) {
    return dispatchAsync(TagSuggestionsAPI.getProfileTagSuggestions(search, tagType), {
        request: ActionTypes.REQUEST_TAG_SUGGESTIONS,
        success: ActionTypes.REQUEST_TAG_SUGGESTIONS_SUCCESS,
        failure: ActionTypes.REQUEST_TAG_SUGGESTIONS_ERROR
    }, {search, tagType});
}

export function requestGoogleTagSuggestions(search, tagType, language){
    const types = [tagType];
    const languages = [language];

    dispatchAsync(TagSuggestionService.requestGoogleTag(search, languages, types), {
        request: ActionTypes.REQUEST_TAG_GOOGLE_SUGGESTIONS,
        success: ActionTypes.REQUEST_TAG_GOOGLE_SUGGESTIONS_SUCCESS,
        failure: ActionTypes.REQUEST_TAG_GOOGLE_SUGGESTIONS_ERROR
    }, {search, tagType, language})
}

export function resetTagSuggestions() {
    dispatch(ActionTypes.RESET_TAG_SUGGESTIONS, {});
}
