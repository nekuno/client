import ActionTypes from '../constants/ActionTypes';
import BaseStore from './BaseStore';

class RouterStore extends BaseStore {

    setInitial() {
        this._nextPath = null;
    }

    _registerToActions(action) {
        super._registerToActions(action);
        switch (action.type) {

            case ActionTypes.ROUTER_NEXT_TRANSITION_PATH:
                this._nextPath = action.path;
                break;

            default:
                break;
        }
    }

    hasNextTransitionPath() {
        return !!this._nextPath;
    }

    get nextTransitionPath() {
        let nextPath = this._nextPath;
        this._nextPath = null;
        return nextPath;
    }
}

export default new RouterStore();
