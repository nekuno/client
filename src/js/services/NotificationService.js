import RouterContainer from './RouterContainer';
import LocaleStore from '../stores/LocaleStore';

class NotificationService {

    notify(data) {
        const {title, body, icon, on_click_path} = data;
        if (title && body) {
            this.showNotification(title, body, icon, on_click_path);
        }
    }

    showNotification(title, body, icon, path) {
        const lang = LocaleStore.getLanguage();
        let options = {
            body: body,
            icon: this._iconOrDefaultIcon(icon),
            lang: lang
        };
        let notification = new Notification(title, options);
        notification.addEventListener('click', () => {
            this._onClickAction(notification, path);
        });
    }

    _iconOrDefaultIcon = function(icon) {
        return typeof icon !== 'undefined' && icon ? icon : 'https://nekuno.com/favicon-64.png';
    };

    _onClickAction = function(notification, url) {
        window.focus();
        if (url && url !== RouterContainer.get().getCurrentLocation().pathname) {
            setTimeout(RouterContainer.get().push(url), 0);
        }
        setTimeout(() => {
            notification.close();
        }, 100);
    };
}

export default new NotificationService();