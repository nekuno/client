import ActionTypes from '../constants/ActionTypes';
import BaseStore from './BaseStore';
import ProfileStore from './ProfileStore';
import LoginStore from './LoginStore';

class LocaleStore extends BaseStore {

    constructor() {
        super();
        this.subscribe(() => this._registerToActions.bind(this));
        this._locale = 'en';
        let locale = localStorage.getItem('locale');
        if (locale) {
            this._locale = locale;
        } else if (LoginStore.user && ProfileStore.contains(LoginStore.user.id) && ProfileStore.get(LoginStore.user.id).interfaceLanguage) {
            this.locale = ProfileStore.get(LoginStore.user.id).interfaceLanguage;
        } else if (navigator.languages && navigator.languages.length > 0) {
            this.locale = navigator.languages[0];
        } else if (navigator.language) {
            this.locale = navigator.language;
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

    set locale(locale) {
        if (locale.startsWith('es')) {
            this._locale = 'es';
        }
    }

    isCurrentLocale(locale) {
        return locale === this._locale;
    }

}

export default new LocaleStore();
