import ActionTypes from '../constants/ActionTypes';
import BaseStore from './BaseStore';

class GalleryAlbumStore extends BaseStore {

    setInitial() {
        this._resource = null;
        this._scope = null;
        this._albums = [];
        this._noAlbums = false;
        this._albumName = null;
        this._albumPhotos = [];
        this._noPhotos = false;
    }

    _registerToActions(action) {
        super._registerToActions(action);

        switch (action.type) {
            case ActionTypes.REQUEST_ALBUMS_SUCCESS:
                this._resource = action.response.resource;
                this._scope = action.response.scope;
                this._albums = action.response.items;
                this._noAlbums = this._albums.length === 0;
                this.emitChange();
                break;
            case ActionTypes.REQUEST_ALBUM_SUCCESS:
                this._resource = action.response.resource;
                this._albumName = action.response.name;
                this._albumPhotos = action.response.items;
                this._noPhotos = this._albumPhotos.length === 0;
                this.emitChange();
                break;
            default:
                break;
        }
    }

    get albums() {
        return this._albums || [];
    }
    
    noAlbums() {
        return this._noAlbums;
    }
    
    getResource() {
        return this._resource;
    }

    getScope() {
        return this._scope;
    }
    
    getAlbumPhotos() {
        return this._albumPhotos;
    }
    
    getAlbumName() {
        return this._albumName;
    }

    noPhotos() {
        return this._noPhotos;
    }
}

export default new GalleryAlbumStore();