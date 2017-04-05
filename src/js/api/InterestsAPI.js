import { API_URLS } from '../constants/Constants';
import { getData, putData } from '../utils/APIUtils';

export function getOwnInterests(type = 'Link', url = API_URLS.OWN_INTERESTS.replace('{type}', type)){
    return getData(url);
}

export function getComparedInterests(userId, type = 'Link', showOnlyCommon = 0, url = API_URLS.COMPARED_INTERESTS.replace('{userId}', userId).replace('{type}', type).replace('{showOnlyCommon}', showOnlyCommon)){
    return getData(url);
}

export function checkImages(urls, url = API_URLS.CHECK_IMAGES) {
    const data = {'urls': urls};
    return putData(url, data);
}
