import ActionTypes from '../constants/ActionTypes';
import BaseStore from './BaseStore';

class LeftPanelStore extends BaseStore {

    setInitial() {
        this._isOpen = false;
    }

    _registerToActions(action) {
        super._registerToActions(action);

        switch (action.type) {

            case ActionTypes.LEFT_PANEL_OPEN:
                this._isOpen = true;
                this.emitChange();
                break;

            case ActionTypes.LEFT_PANEL_CLOSE:
                this._isOpen = false;
                this.emitChange();
                break;

            default:
                break;
        }
    }

    get isOpen() {
        return this._isOpen;
    }
}

export default new LeftPanelStore();
