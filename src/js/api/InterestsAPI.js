import { API_URLS } from '../constants/Constants';
import { fetchOwnInterests, fetchComparedInterests } from '../utils/APIUtils';

export function getOwnInterests(type = '', url = API_URLS.OWN_INTERESTS.replace('{type}', type)){
    return fetchOwnInterests(url);
}

export function getComparedInterests(userId, type = '', showOnlyCommon = 0, url = API_URLS.COMPARED_INTERESTS.replace({userId}, userId).replace('{type}', type).replace('{showOnlyCommon}', showOnlyCommon)){
    return fetchComparedInterests(url);
}
