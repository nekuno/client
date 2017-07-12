import ActionTypes from '../constants/ActionTypes';
import { EventEmitter } from 'events';
import { register } from '../dispatcher/Dispatcher';

const CHANGE_EVENT = 'change';

export default class BaseStore extends EventEmitter {

    constructor() {
        super();
        this.subscribe(() => this._registerToActions.bind(this));
        this.setInitial();
    }

    subscribe(actionSubscribe) {
        this._dispatchToken = register(actionSubscribe());
    }

    get dispatchToken() {
        return this._dispatchToken;
    }

    setInitial() {
        this._pagination = {};
    };

    getPaginationUrl(userId, initialUrl) {
        const hasReceivedPagination = this._pagination.hasOwnProperty(userId);

        return !hasReceivedPagination ? initialUrl :
            this._pagination[userId].nextLink ? this._pagination[userId].nextLink : '';
    }

    _registerToActions(action) {
        switch (action.type) {
            case ActionTypes.LOGOUT_USER:
                this.setInitial();
                this.emitChange();
                break;
            default:
                break;
        }
    }

    emitChange() {
        setTimeout(() => {this.emit(CHANGE_EVENT)}, 0);
    }

    addChangeListener(cb) {
        this.on(CHANGE_EVENT, cb)
    }

    removeChangeListener(cb) {
        this.removeListener(CHANGE_EVENT, cb);
    }
}
