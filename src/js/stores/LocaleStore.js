import ActionTypes from '../constants/ActionTypes';
import BaseStore from './BaseStore';

class LocaleStore extends BaseStore {

    constructor() {
        super();
        this.subscribe(() => this._registerToActions.bind(this));
        this._locale = 'en';
        let locale = localStorage.getItem('locale');
        if (locale) {
            this._locale = locale;
        }
    }

    _registerToActions(action) {

        switch (action.type) {

            case ActionTypes.CHANGE_LOCALE:
                this._locale = action.locale;
                localStorage.setItem('locale', this._locale);
                this.emitChange();
                break;

            default:
                break;
        }
    }

    get locale() {
        return this._locale;
    }

}

export default new LocaleStore();
