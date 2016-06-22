import { dispatch, dispatchAsync } from '../dispatcher/Dispatcher';
import ActionTypes from '../constants/ActionTypes';
import * as GalleryPhotosAPI from '../api/GalleryPhotosAPI';

export default {

    getPhotos(userId) {
        return dispatchAsync(GalleryPhotosAPI.getPhotos(), {
            request: ActionTypes.REQUEST_PHOTOS,
            success: ActionTypes.REQUEST_PHOTOS_SUCCESS,
            failure: ActionTypes.REQUEST_PHOTOS_ERROR
        }, {userId});
    },

    getOtherPhotos(userId) {
        return dispatchAsync(GalleryPhotosAPI.getOtherPhotos(userId), {
            request: ActionTypes.REQUEST_PHOTOS,
            success: ActionTypes.REQUEST_PHOTOS_SUCCESS,
            failure: ActionTypes.REQUEST_PHOTOS_ERROR
        }, {userId});
    },

    selectPhoto(photo) {
        dispatch(ActionTypes.SELECT_PHOTO, {
            response : photo
        });
    },
    
    postPhoto(userId, data) {
        return dispatchAsync(GalleryPhotosAPI.postPhoto(data), {
            request: ActionTypes.UPLOAD_PHOTO,
            success: ActionTypes.UPLOAD_PHOTO_SUCCESS,
            failure: ActionTypes.UPLOAD_PHOTO_ERROR
        }, {userId, data});
    },

    deletePhoto(data) {
        return dispatchAsync(GalleryPhotosAPI.deletePhoto(data), {
            request: ActionTypes.DELETE_PHOTO,
            success: ActionTypes.DELETE_PHOTO_SUCCESS,
            failure: ActionTypes.DELETE_PHOTO_ERROR
        }, {data});
    },

    setAsProfilePhoto(photoId) {
        return dispatchAsync(GalleryPhotosAPI.setAsProfilePhoto(photoId), {
            request: ActionTypes.REQUEST_SET_PROFILE_PHOTO,
            success: ActionTypes.REQUEST_SET_PROFILE_PHOTO_SUCCESS,
            failure: ActionTypes.REQUEST_SET_PROFILE_PHOTO_ERROR
        }, {photoId});
    }
}
