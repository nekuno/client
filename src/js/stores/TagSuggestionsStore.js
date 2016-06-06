import ActionTypes from '../constants/ActionTypes';
import BaseStore from './BaseStore';

class TagSuggestionsStore extends BaseStore {

    setInitial() {
        this._tags = [];
    }

    _registerToActions(action) {
        super._registerToActions(action);

        switch (action.type) {
            case ActionTypes.REQUEST_TAG_SUGGESTIONS_SUCCESS:
                this._tags = action.response.items;
                this.emitChange();
                break;
            case ActionTypes.RESET_TAG_SUGGESTIONS:
                this.setInitial();
                this.emitChange();
                break;
            default:
                break;
        }
    }

    get tags() {
        return this._tags || [];
    }
}

export default new TagSuggestionsStore();