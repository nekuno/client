import { fetchUserDataStatus } from '../utils/APIUtils';
import { API_URLS } from '../constants/Constants';

export function getUserDataStatus(url = API_URLS.USER_DATA_STATUS) {
    return fetchUserDataStatus(url);
}