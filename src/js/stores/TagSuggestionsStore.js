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
            case ActionTypes.REQUEST_TAG_GOOGLE_SUGGESTIONS_SUCCESS:
                const response = JSON.parse(action.response);
                const responseItems = response['itemListElement'];

                const items = responseItems.map(responseItem => {
                    const name = responseItem.result.name;
                    const googleGraphId = responseItem.result.id;

                    return {name, googleGraphId}
                });

                this._tags = items;
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