import { API_URLS } from '../constants/Constants';
import { getData, putData } from '../utils/APIUtils';

export function getOwnInterests(url) {
    return getData(url);
}

export function getComparedInterests(url) {
    return getData(url);
}

export function checkImages(urls, url = API_URLS.CHECK_IMAGES) {
    const data = {'urls': urls};
    return putData(url, data);
}
