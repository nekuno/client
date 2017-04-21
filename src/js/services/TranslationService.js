import en from '../i18n/en';
import es from '../i18n/es';
import LocaleStore from '../stores/LocaleStore';

class TranslationService {

    constructor() {
        this._locales = {en, es};
    }

    _getLocale(locale) {
        return this._locales.hasOwnProperty(locale) ? this._locales[locale] : {};
    }

    getCategoryStrings(locale, category) {
        const localeStrings = this._getLocale(locale);
        return localeStrings.hasOwnProperty(category) ? localeStrings[category] : {};
    }

    getTranslatedString(category, key)
    {
        const currentLocale = LocaleStore.locale;
        const strings = this.getCategoryStrings(currentLocale, category);
        return strings.hasOwnProperty(key) ? strings[key] : null;
    }
}

export default new TranslationService();