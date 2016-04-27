import { getData } from '../utils/APIUtils';
import { API_URLS } from '../constants/Constants';

export function getContentTagSuggestions(search, url = API_URLS.CONTENT_TAG_SUGGESTIONS.replace('{search}', search)) {
    return getData(url);
}

export function getProfileTagSuggestions(search, type, url = API_URLS.PROFILE_TAG_SUGGESTIONS.replace('{type}', type).replace('{search}', search)) {
    return getData(url);
}