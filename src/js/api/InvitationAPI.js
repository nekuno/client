import { API_URLS } from '../constants/Constants';
import { getData } from '../utils/APIUtils';

export function getInvitations(url = API_URLS.INVITATIONS){
    return getData(url);
}

