import ActionTypes from '../constants/ActionTypes';
import { EventEmitter } from 'events';
import { register } from '../dispatcher/Dispatcher';

export default class BaseStore extends EventEmitter {

    _receiving = [];
    _received = [];
    _receivingClasses = [];

    constructor() {
        super();
        this.subscribe(() => this._registerToActions.bind(this));
        this.setInitial();
        this.setReceivingClasses();
    }

    subscribe(actionSubscribe) {
        this._dispatchToken = register(actionSubscribe());
    }

    get dispatchToken() {
        return this._dispatchToken;
    }

    setInitial() {
        this._receiving = [];
        this._received = [];
    };

    setReceivingClasses() {
    }

    setReceiving(action){};
    setReceivedSuccess(action){};
    setReceivedError(action){};

    _registerToActions(action) {
        switch (action.type) {
            case ActionTypes.LOGOUT_USER:
                this.setInitial();
                this.emitChange();
                break;
            default:
                break;
        }

        this.setReceiving(action);
        this.setReceivedSuccess(action);
        this.setReceivedError(action);
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
