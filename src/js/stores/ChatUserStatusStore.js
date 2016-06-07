import ActionTypes from '../constants/ActionTypes';
import BaseStore from './BaseStore';

class ChatUserStatusStore extends BaseStore {

    setInitial() {
        this._users = {};
    }

    _registerToActions(action) {
        super._registerToActions(action);

        switch (action.type) {

            case ActionTypes.CHAT_USER_STATUS:
                this._users[action.user.id] = action.status;
                this.emitChange();
                break;

            default:
                break;
        }
    }

    isOnline(id) {
        return this._users[id] && this._users[id] === 'online';
    }

}

export default new ChatUserStatusStore();