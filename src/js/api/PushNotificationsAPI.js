import { postData } from '../utils/APIUtils';
import { API_URLS } from '../constants/Constants';

export function sendSubscription(data, url = API_URLS.NOTIFICATIONS_SUBSCRIBE) {
    return postData(url, data);
}
