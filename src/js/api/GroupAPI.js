import { API_URLS } from '../constants/Constants';
import { getData, postData, deleteData } from '../utils/APIUtils';

export function requestGroup(groupId){
    let url = API_URLS.REQUEST_GROUP.replace('{groupId}', groupId);
    return getData(url);
}

export function joinGroup(groupId){
    let url = API_URLS.JOIN_GROUP.replace('{groupId}', groupId);
    return postData(url);
}

export function createGroup(data){
    return postData(API_URLS.CREATE_GROUP, data);
}

export function leaveGroup(groupId){
    let url = API_URLS.LEAVE_GROUP.replace('{groupId}', groupId);
    return deleteData(url);
}

export function requestGroupMembers(groupId, url){
    url = null !== url ? url : API_URLS.REQUEST_GROUP_MEMBERS.replace('{groupId}', groupId);
    return getData(url);
}

export function requestGroupContents(groupId, url){
    url = null !== url ? url : API_URLS.REQUEST_GROUP_CONTENTS.replace('{groupId}', groupId);
    return getData(url);
}