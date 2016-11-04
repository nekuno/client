import ActionTypes from '../constants/ActionTypes';
import BaseStore from './BaseStore';
import selectn from 'selectn';

class GroupStore extends BaseStore {

    setInitial() {
        this._error = null;
        this._groups = [];
    }

    _registerToActions(action) {
        super._registerToActions(action);

        switch (action.type) {

            case ActionTypes.REQUEST_GROUP:
            case ActionTypes.CREATE_GROUP:
            case ActionTypes.JOIN_GROUP:
                this._error = null;
                this.emitChange();
                break;

            case ActionTypes.REQUEST_GROUP_SUCCESS:
            case ActionTypes.CREATE_GROUP_SUCCESS:
            case ActionTypes.JOIN_GROUP_SUCCESS:
                this._error = null;
                this._groups[action.groupId] = action.response;
                this.emitChange();
                break;

            case ActionTypes.REQUEST_GROUP_ERROR:
            case ActionTypes.CREATE_GROUP_ERROR:
            case ActionTypes.JOIN_GROUP_ERROR:
                this._error = action.error;
                this._groups[action.groupId] = null;
                this.emitChange();
                break;

            case ActionTypes.REQUEST_STATS_SUCCESS:
                const groups = action.response.groupsBelonged;
                if (null == groups){
                    break;
                }
                groups.forEach(group => {
                    if (! (group.id in this.groups)){
                        this._groups[group.id] = group;
                    }
                });
                this.emitChange();
                break;

            default:
                break;
        }
    }

    get error() {
        return this._error;
    }

    get groups() {
        return this._groups;
    }

    getGroup(groupId) {
        return this.groups[groupId] ? this.groups[groupId] : null;
    }

}

export default new GroupStore();