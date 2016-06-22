import ActionTypes from '../constants/ActionTypes';
import BaseStore from './BaseStore';

class GalleryPhotoStore extends BaseStore {

    setInitial() {
        this._photos = {};
        this._noPhotos = {};
        this._error = false;
        this._selectedPhoto = null;
    }

    _registerToActions(action) {
        let userId;
        super._registerToActions(action);
        switch (action.type) {
            case ActionTypes.REQUEST_PHOTOS_SUCCESS:
                userId = action.userId;
                this._photos[userId] = action.response;
                this._noPhotos[userId] = this._photos.length === 0;
                this.emitChange();
                break;
            case ActionTypes.UPLOAD_PHOTO_SUCCESS:
                userId = action.userId;
                this._photos[userId].push(action.response);
                this._noPhotos[userId] = this._photos.length === 0;
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

    get(userId) {
        return this._photos[userId] || [];
    }
    
    noPhotos(userId) {
        return this._noPhotos[userId];
    }
    
    getSelectedPhoto() {
        return this._selectedPhoto;
    }
}

export default new GalleryPhotoStore();