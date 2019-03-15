import ActionTypes from '../constants/ActionTypes';
import BaseStore from './BaseStore';
import { getValidationErrors } from '../utils/StoreUtils';
import UserStore from "./UserStore";
import LoginStore from "./LoginStore";

class GalleryPhotoStore extends BaseStore {

    setInitial() {
        this._photos = {};
        this._noPhotos = {};
        this._errors = '';
        this._selectedPhoto = null;
        this._loadingPhoto = null;
        this._loadingPhotos = null;
    }

    _registerToActions(action) {
        let userId;
        super._registerToActions(action);
        switch (action.type) {
            case ActionTypes.REQUEST_PHOTOS:
                this._loadingPhotos = true;
                this.emitChange();
                break;
            case ActionTypes.REQUEST_PHOTOS_SUCCESS:
                userId = action.userId;
                this._photos[userId] = action.response;
                this._noPhotos[userId] = this._photos[userId].length === 0;
                this._loadingPhotos = false;
                this.emitChange();
                break;
            case ActionTypes.REQUEST_OTHER_USER_SUCCESS:
                userId = UserStore.getBySlug(action.slug).id;
                this._photos[userId] = action.response.photos;
                this._noPhotos[userId] = this._photos[userId].length === 0;
                break;
            case ActionTypes.REQUEST_OWN_USER_PAGE_SUCCESS:
                userId = LoginStore.user.id;
                this._photos[userId] = action.response.photos;
                this._noPhotos[userId] = this._photos[userId].length === 0;
                break;
            case ActionTypes.UPLOAD_PHOTO:
                this._loadingPhoto = true;
                this.emitChange();
                break;
            case ActionTypes.UPLOAD_PHOTO_SUCCESS:
                userId = action.userId;
                this._photos[userId].unshift(action.response);
                this._noPhotos[userId] = this._photos[userId].length === 0;
                this._loadingPhoto = false;
                this.emitChange();
                break;
            case ActionTypes.UPLOAD_PHOTO_ERROR:
                this._errors = getValidationErrors(action.error);
                this._loadingPhoto = false;
                this.emitChange();
                break;
            case ActionTypes.REQUEST_PHOTOS_ERROR:
                this._errors = getValidationErrors(action.error);
                this.emitChange();
                break;
            case ActionTypes.DELETE_PHOTO_SUCCESS:
                userId = action.userId;
                let index = this._photos[userId].findIndex(photo => photo.id === action.id);
                this._photos[userId].splice(index, 1);
                this._noPhotos[userId] = this._photos[userId].length === 0;
                this.emitChange();
                break;
            case ActionTypes.SELECT_PHOTO:
                this._selectedPhoto = action.response;
                this.emitChange();
                break;
            default:
                break;
        }
    }

    get(userId) {
        return this._photos[userId] || [];
    }
    
    noPhotos(userId) {
        return this._noPhotos[userId];
    }
    
    getSelectedPhoto() {
        return this._selectedPhoto;
    }

    getErrors() {
        const errors = this._errors;
        this._errors = '';
        return errors;
    }

    getLoadingPhoto() {
        return this._loadingPhoto;
    }

    getLoadingPhotos() {
        return this._loadingPhotos;
    }
}

export default new GalleryPhotoStore();