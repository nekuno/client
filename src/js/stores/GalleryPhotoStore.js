import ActionTypes from '../constants/ActionTypes';
import BaseStore from './BaseStore';

class GalleryPhotoStore extends BaseStore {

    setInitial() {
        this._photos = [];
        this._noPhotos = false;
        this._error = false;
        this._selectedPhoto = null;
    }

    _registerToActions(action) {
        super._registerToActions(action);
        switch (action.type) {
            case ActionTypes.REQUEST_PHOTOS_SUCCESS:
                this._photos = action.response;
                this._noPhotos = this._photos.length === 0;
                this.emitChange();
                break;
            case ActionTypes.UPLOAD_PHOTO_SUCCESS:
                this._photos.push(action.response);
                this._noPhotos = this._photos.length === 0;
                this.emitChange();
                break;
            case ActionTypes.REQUEST_PHOTOS_ERROR:
                this._error = action.error;
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

    get photos() {
        return this._photos || [];
    }
    
    noPhotos() {
        return this._noPhotos;
    }
    
    getSelectedPhoto() {
        return this._selectedPhoto;
    }
}

export default new GalleryPhotoStore();