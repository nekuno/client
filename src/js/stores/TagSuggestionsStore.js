import ActionTypes from '../constants/ActionTypes';
import BaseStore from './BaseStore';

class TagSuggestionsStore extends BaseStore {

    constructor() {
        super();
        this.subscribe(() => this._registerToActions.bind(this));
        this._tags = [];
    }

    _registerToActions(action) {

        switch (action.type) {
            case ActionTypes.REQUEST_TAG_SUGGESTIONS_SUCCESS:
                this._tags = action.response.items;
                this.emitChange();
                break;
            case ActionTypes.RESET_TAG_SUGGESTIONS:
                this._tags = [];
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