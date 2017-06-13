import ActionTypes from '../constants/ActionTypes';
import BaseStore from './BaseStore';
import RouterContainer from '../services/RouterContainer';

class RouterStore extends BaseStore {

    setInitial() {
        this._nextPath = null;
        this._routes = [];
    }

    _registerToActions(action) {
        super._registerToActions(action);
        switch (action.type) {

            case ActionTypes.ROUTER_NEXT_TRANSITION_PATH:
                this._nextPath = action.path;
                break;

            case ActionTypes.NEXT_ROUTE:
                this._routes.push(action.route);
                this.emitChange();
                break;

            case ActionTypes.REMOVE_PREV_ROUTE:
                this._routes.pop();
                this.emitChange();
                break;

            case ActionTypes.PREVIOUS_ROUTE:
                this._routes.pop();
                let router = RouterContainer.get();
                if (this._routes.length > 0) {
                    const lastRoute = this._routes[this._routes.length - 1];
                    if (action.route === lastRoute) {
                        setTimeout(router.replace('discover'), 0);
                    } else {
                        router.goBack();
                    }
                } else {
                    setTimeout(router.replace('discover'), 0);
                }
                this.emitChange();
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
