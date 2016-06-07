import ActionTypes from '../constants/ActionTypes';
import { EventEmitter } from 'events';
import { register } from '../dispatcher/Dispatcher';

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

    setInitial() {};

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
        this.emit('CHANGE');
    }

    addChangeListener(cb) {
        this.on('CHANGE', cb)
    }

    removeChangeListener(cb) {
        this.removeListener('CHANGE', cb);
    }
}
