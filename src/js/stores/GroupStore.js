import ActionTypes from '../constants/ActionTypes';
import BaseStore from './BaseStore';
import selectn from 'selectn';

class GroupStore extends BaseStore {

    setInitial() {
        this._error = null;
        this._groups = [];
        this._contents = [];
        this._members = [];
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

            case ActionTypes.REQUEST_GROUP_CONTENTS_SUCCESS:
                const contents = action.response.items;
                this._contents[action.groupId] = this._contents[action.groupId] ? this._contents[action.groupId] : [];
                contents.forEach(content => {
                    this._contents[action.groupId][content.content.id] = content;
                });
                this.emitChange();
                break;

            case ActionTypes.REQUEST_GROUP_MEMBERS_SUCCESS:
                const members = action.response.items;
                this._members[action.groupId] = this._members[action.groupId] ? this._members[action.groupId] : [];
                members.forEach(member => {
                    this._members[action.groupId][member.id] = member;
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

    get contents() {
        return this._contents;
    }

    get members() {
        return this._members;
    }

    getGroup(groupId) {
        return this.groups[groupId] ? this.groups[groupId] : null;
    }

    getContents(groupId) {
        return this.contents[groupId] ? this.contents[groupId] : null;
    }

    getMembers(groupId) {
        return this.members[groupId] ? this.members[groupId] : null;
    }

}

export default new GroupStore();