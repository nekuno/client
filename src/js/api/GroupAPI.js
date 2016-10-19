import { API_URLS } from '../constants/Constants';
import { postData, fetchComparedInterests } from '../utils/APIUtils';

export function joinGroup(groupId){
    let url = API_URLS.JOIN_GROUP.replace('{groupId}', groupId);
    return postData(url);
}

export function createGroup(data){
    return postData(API_URLS.CREATE_GROUP, data);
}