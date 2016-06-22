import { getData, postData, deleteData } from '../utils/APIUtils';
import { API_URLS } from '../constants/Constants';

export function getPhotos(url = API_URLS.GALLERY_PHOTOS) {
    return getData(url);
}

export function getOtherPhotos(userId, url = API_URLS.OTHER_GALLERY_PHOTOS.replace('{id}', userId)) {
    return getData(url);
}

export function postPhoto(data, url = API_URLS.GALLERY_PHOTOS) {
    return postData(url, data);
}

export function deletePhoto(id, url = API_URLS.GALLERY_PHOTO.replace('{id}', id)) {
    return deleteData(url);
}

export function setAsProfilePhoto(id, url = API_URLS.GALLERY_PHOTO_PROFILE.replace('{id}', id)) {
    return postData(url);
}