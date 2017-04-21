import RouterContainer from './RouterContainer';
import LocaleStore from '../stores/LocaleStore';
import TranslationService from './TranslationService';
import LoginStore from '../stores/LoginStore';
import ProfileStore from '../stores/ProfileStore';
import QuestionStore from '../stores/QuestionStore';

class NotificationService {

    notify(category, data) {
        switch (category) {
            case 'message':
                this.notifyMessage(data);
                break;
            case 'process_finish':
                this.notifyProcessFinish(data);
                break;
            case 'user_both_liked':
                this.notifyUserLiked(data);
                break;
            case 'generic':
                this.notifyGeneric(data);
                break;
        }
    }

    notifyMessage(data) {
        const {slug, username, photo, text} = data;
        const url = `/conversations/${slug}`;
        if (url !== RouterContainer.get().getCurrentLocation().pathname && this._userIsFullyComplete()) {
            const icon = this._getUserThumbnail(photo);
            const strings = TranslationService.getTranslatedString('NotificationService', 'Message');
            this.showNotification(strings.title.replace('%username%', username), text, icon, url);
        }
    }

    notifyProcessFinish(data) {
        const {resource} = data;
        let url = null;
        if (this._userIsFullyComplete()) {
            url = `/social-networks`;
        }
        const strings = TranslationService.getTranslatedString('NotificationService', 'ProcessFinish');
        this.showNotification(strings.title, strings.body.replace('%resource%', resource), null, url);
    }

    notifyUserLiked(data) {
        const {slug, username, photo} = data;
        const url = `/p/${slug}`;
        const icon = this._getUserThumbnail(photo);
        const strings = TranslationService.getTranslatedString('NotificationService', 'UserLiked');
        this.showNotification(strings.title, strings.body.replace('%username%', username), icon, url);
    }

    notifyGeneric(data) {
        const {title, body, icon} = data;
        if (title && body) {
            this.showNotification(title, body, icon, null);
        }
    }

    showNotification(title, body, icon, url) {
        icon = this._iconOrDefaultIcon(icon);

        this._grant().then(() => {
            if (window.cordova) {
                window.cordova.plugins.notification.local.schedule({
                    title: title,
                    text : body,
                    icon : icon
                });
                window.cordova.plugins.notification.local.on("click", (notification) => {
                    this._onClickAction(notification, url);
                });
            } else {
                const lang = LocaleStore.getLanguage();

                let options = {
                    body: body,
                    icon: icon,
                    lang: lang
                };
                let notification = new Notification(title, options);
                notification.addEventListener('click', () => {
                    this._onClickAction(notification, url);
                });
            }
        }).catch((error) => {
            console.log(error)
        });
    }

    _grant = function() {
        let resolve = new Promise((resolve) => {
            resolve(true)
        });
        if (window.cordova) {
            // No need to grant permission explicitly
            return resolve;
        } else {
            if (!("Notification" in window)) {
                return new Promise((resolve, reject) => {
                    reject('notifications not supported')
                });
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
                return new Promise((resolve, reject) => {
                    reject('notifications not granted')
                });
            }
        }
    };

    _getUserThumbnail = function(photo) {
        return photo && photo.thumbnail && photo.thumbnail.small ?
            photo.thumbnail.small : photo && photo.url ? photo.url : null;
    };

    _iconOrDefaultIcon = function(icon) {
        return typeof icon !== 'undefined' && icon ? icon : 'https://nekuno.com/favicon-64.png';
    };

    _onClickAction = function(notification, url) {
        window.focus();
        if (url && url !== RouterContainer.get().getCurrentLocation().pathname) {
            setTimeout(RouterContainer.get().push(url), 0);
        }
        setTimeout(notification.close.bind(notification), 100);
    };

    _userIsFullyComplete() {
        return LoginStore.isComplete() && ProfileStore.isComplete(LoginStore.user.id) && !QuestionStore.isJustRegistered(LoginStore.user.id);
    }

}

export default new NotificationService();