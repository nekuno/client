import ActionTypes from '../constants/ActionTypes';
import BaseStore from './BaseStore';
import RouterContainer from '../services/RouterContainer';
import {DO_NOT_BACK_ROUTES} from '../constants/Constants';
import LoginStore from "./LoginStore";

class RouterStore extends BaseStore {

    setInitial() {
        this._nextPath = null;
        this._routes = [];
    }

    _registerToActions(action) {
        super._registerToActions(action);
        let router = RouterContainer.get();
        switch (action.type) {

            case ActionTypes.ROUTER_NEXT_TRANSITION_PATH:
                this._nextPath = action.path;
                break;

            case ActionTypes.NEXT_ROUTE:
                this._routes.push(action.route);
                this.emitChange();
                break;

            case ActionTypes.REPLACE_ROUTE:
                this._routes.pop();
                setTimeout(router.replace(action.path), 0);
                this.emitChange();
                break;

            case ActionTypes.PREVIOUS_ROUTE:
                this._routes.pop();

                if (this._routes.length > 0) {
                    const lastRoute = this._routes[this._routes.length - 1];
                    if (action.route === lastRoute) {
                        const userSlug = LoginStore.user.slug;
                        const defaultRoute = 'p/'+userSlug;
                        setTimeout(router.replace(defaultRoute), 0);
                    } else if (DO_NOT_BACK_ROUTES.some(route => route === lastRoute)) {
                        const userSlug = LoginStore.user.slug;
                        const defaultRoute = 'p/'+userSlug;
                        setTimeout(router.replace(defaultRoute), 0);
                    } else {
                        router.goBack();
                    }
                } else {
                    const userSlug = LoginStore.user.slug;
                    const defaultRoute = 'p/'+userSlug;
                    setTimeout(router.replace(defaultRoute), 0);
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
