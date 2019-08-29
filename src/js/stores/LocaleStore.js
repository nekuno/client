import ActionTypes from '../constants/ActionTypes';
import BaseStore from './BaseStore';
import ProfileStore from './ProfileStore';
import LoginStore from './LoginStore';
import LocalStorageService from '../services/LocalStorageService';
import moment from 'moment';

class LocaleStore extends BaseStore {

    setInitial() {
        this._locale = 'es';
        let locale = null; //LocalStorageService.get('locale');
        if (locale) {
            this._locale = locale;
        } else if (LoginStore.user && ProfileStore.contains(LoginStore.user.slug) && ProfileStore.get(LoginStore.user.slug).interfaceLanguage) {
            this.locale = ProfileStore.get(LoginStore.user.slug).interfaceLanguage;
        //} else if (navigator.languages && navigator.languages.length > 0) {
        //    this.locale = navigator.languages[0];
        //} else if (navigator.language) {
        //    this.locale = navigator.language;
        }
    }

    _registerToActions(action) {
        super._registerToActions(action);

        switch (action.type) {

            case ActionTypes.CHANGE_LOCALE:
                this._locale = action.locale;
                LocalStorageService.set('locale', this._locale);
                moment.locale(this._locale);
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
        if (['es', 'an', 'ca', 'eu', 'gl'].some(current => locale.startsWith(current))) {
            this._locale = 'es';
        }
    }

    isCurrentLocale(locale) {
        return locale === this._locale;
    }

    getLanguage() {
        const locale = this.locale;
        let lang = "en-US";
        if (locale && locale.indexOf("es") !== -1) {
            lang = "es-ES";
        }

        return lang;
    };

}

export default new LocaleStore();
