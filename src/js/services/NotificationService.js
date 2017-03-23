import RouterContainer from './RouterContainer';
import en from '../i18n/en';
import es from '../i18n/es';
import LocaleStore from '../stores/LocaleStore';

const locales = {en, es};

class NotificationService {

    notify(data) {
        const {type} = data;
        const lang = this._localeToLang(LocaleStore.locale);
        switch (type) {
            case 'message':
                this.notifyMessage(data, lang);
                break;
            case 'process_finish':
                this.notifyProcessFinish(data, lang);
                break;
            case 'user_liked':
                this.notifyUserLiked(data, lang);
                break;
            default:
                this.notifyGeneric(data, lang);
        }
    }

    notifyMessage(data, lang) {
        const {slug, username, photo} = data;
        const url = `/conversations/${slug}`;
        const icon = this._getUserThumbnail(photo);
        const strings = locales[LocaleStore.locale]['NotificationService']['Message'];
        this.showNotification(strings.title, strings.body.replace('%username%', username), lang, icon, url);
    }

    notifyProcessFinish(data, lang) {
        const {resource} = data;
        const url = `/social-networks`;
        const strings = locales[LocaleStore.locale]['NotificationService']['ProcessFinish'];
        this.showNotification(strings.title, strings.body.replace('%resource%', resource), lang, null, url);
    }

    notifyUserLiked(data, lang) {
        const {slug, username, photo} = data;
        const url = `/p/${slug}`;
        const icon = this._getUserThumbnail(photo);
        const strings = locales[LocaleStore.locale]['NotificationService']['UserLiked'];
        this.showNotification(strings.title, strings.body.replace('%username%', username), lang, icon, url);
    }

    notifyGeneric(data, lang) {
        const {title, body, icon} = data;
        if (title && body) {
            this.showNotification(title, body, lang, icon, null);
        }
    }

    showNotification(title, body, lang, icon, url) {
        icon = this._iconOrDefaultIcon(icon);
        let options = {
            body: body,
            icon: icon,
            lang: lang
        };

        this._grant().then(() => {
            let notification = new Notification(title, options);
            notification.onclick = function () {
                window.focus();
                if (url && url !== RouterContainer.get().getCurrentLocation().pathname) {
                    setTimeout(RouterContainer.get().push(url), 0);
                }
            };
        }).catch((error) => {
            console.log(error)
        });
    }

    _grant = function () {
        let resolve = new Promise((resolve) => { resolve(true) });
        if (!("Notification" in window)) {
            return new Promise((resolve, reject) => { reject('notifications not supported') });
        }

        // Let's check whether notification permissions have already been granted
        else if (Notification.permission === "granted") {
            return resolve;
        }

        // Otherwise, we need to ask the user for permission
        else if (Notification.permission !== 'denied') {
            return Notification.requestPermission((permission) => {
                if (permission === "granted") {
                    return resolve;
                }
            });
        }

        else {
            return new Promise((resolve, reject) => { reject('notifications not granted') });
        }
    };

    _localeToLang = function (locale) {
        let lang = "en-US";
        if (locale && locale.indexOf("es") !== -1) {
            lang = "es-ES";
        }

        return lang;
    };

    _getUserThumbnail = function (photo) {
        return photo && photo.thumbnail && photo.thumbnail.small ?
            photo.thumbnail.small : photo && photo.url ? photo.url : null;
    };

    _iconOrDefaultIcon = function (icon) {
        return typeof icon !== 'undefined' && icon ? icon : 'https://nekuno.com/favicon-64.png';
    };

}

export default new NotificationService();