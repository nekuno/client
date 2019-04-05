import ActionTypes from '../constants/ActionTypes';
import BaseStore from './BaseStore';
import RouterContainer from '../services/RouterContainer';
import {DO_NOT_BACK_ROUTES} from '../constants/Constants';
import LoginStore from "./LoginStore";

class RouterStore extends BaseStore {

    setInitial() {
        this._nextPath = null;
        this._routes = [];
        this._routesBackedFrom = [];
        this._isOnlyGoingBack = false;
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
                this._clearLoopCheck();
                this.emitChange();
                break;

            case ActionTypes.REPLACE_ROUTE:
                this._routes.pop();
                setTimeout(router.replace(action.path), 0);
                this.emitChange();
                break;

            case ActionTypes.PREVIOUS_ROUTE:
                this._routes.pop();

                const defaultRoute = this._getDefaultRoute(action);

                const noBackRoutes = this._routes.length === 0;
                if (noBackRoutes){
                    setTimeout(router.replace(defaultRoute), 0);
                    this.emitChange();
                    break;
                }

                const lastRoute = this._routes[this._routes.length - 1];
                const isForbiddenBack = DO_NOT_BACK_ROUTES.some(route => route === lastRoute);
                if (isForbiddenBack){
                    setTimeout(router.replace(defaultRoute), 0);
                    this.emitChange();
                    break;
                }

                const currentRoute = action.route;
                const isRepeatingRoute = lastRoute === currentRoute;
                const isInLoop = this._checkLoop(currentRoute);
                if (isInLoop || isRepeatingRoute){
                    setTimeout(router.replace(defaultRoute), 0);
                    this.emitChange();
                    break;
                }

                this._routesBackedFrom.push(currentRoute);
                router.goBack();
                this.emitChange();
                break;

            default:
                break;
        }
    }

    _getDefaultRoute(action){
        const userSlug = LoginStore.slug;
        const profileDefaultRoute = '/p/'+userSlug;
        const proposalsDefaultRoute = '/proposals';

        console.log(action.route);
        console.log(profileDefaultRoute);
        if (action.route === profileDefaultRoute || this._routesBackedFrom.indexOf(profileDefaultRoute)!== -1 ){
            return proposalsDefaultRoute;
        }

        return profileDefaultRoute;
    }

    _clearLoopCheck(){
        this._isOnlyGoingBack = false;
        this._routesBackedFrom = [];
    }

    _checkLoop(route) {
        this._routesBackedFrom.push(route);
        const isInLoop= this._isOnlyGoingBack && this._routes.indexOf((route)) !== -1;

        return isInLoop;
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
