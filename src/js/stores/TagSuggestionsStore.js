import ActionTypes from '../constants/ActionTypes';
import BaseStore from './BaseStore';

class TagSuggestionsStore extends BaseStore {

    setInitial() {
        this._tags = [];
        this._tagType = '';
    }

    _registerToActions(action) {
        super._registerToActions(action);

        switch (action.type) {
            case ActionTypes.REQUEST_TAG_SUGGESTIONS:
                this._tagType = action.tagType;
                this.emitChange();
                break;
            case ActionTypes.REQUEST_TAG_SUGGESTIONS_SUCCESS:
                this._tags = action.response.items;
                this.emitChange();
                break;
            case ActionTypes.REQUEST_TAG_GOOGLE_SUGGESTIONS_SUCCESS:
                const response = JSON.parse(action.response);
                const responseItems = response['itemListElement'];

                let items = responseItems.map(responseItem => {
                    const name = responseItem.result.name;
                    const googleGraphId = responseItem.result['@id'];

                    return {name, googleGraphId}
                });

                items = items.filter(function(item, index, array) {
                    const hasName = item.name !== undefined;

                    const earlierItems = array.slice(0, index);
                    const isDuplicated = earlierItems.some(value => {return value.name === item.name});

                    return hasName && !isDuplicated;
                });

                items = items.slice(0, 3);

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

    get tagType() {
        return this._tagType || '';
    }
}

export default new TagSuggestionsStore();