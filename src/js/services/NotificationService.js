import RouterContainer from './RouterContainer';
import RouterActionCreators from '../actions/RouterActionCreators';
import LocaleStore from '../stores/LocaleStore';

class NotificationService {

    notify(data) {
        const {title, body, icon, on_click_path, force_show} = data;
        if (title && body) {
            this.showNotification(title, body, icon, on_click_path, force_show);
        }
    }

    showNotification(title, body, icon, path, force_show) {
        force_show = parseInt(force_show);
        const isSamePath = this._isSamePath(path);
        if (!force_show && isSamePath) {
            console.log("Notification won't be displayed");
            return false;
        }

        if (window.cordova) {
            window.cordova.plugins.notification.local.schedule({
                title: title,
                text : body,
                icon : icon
            });
            window.cordova.plugins.notification.local.on("click", (notification) => {
                this.onClickAction(notification, path);
            });
        } else {
            const lang = LocaleStore.getLanguage();
            let options = {
                body: body,
                icon: this._iconOrDefaultIcon(icon),
                lang: lang
            };
            let notification = new Notification(title, options);
            notification.addEventListener('click', () => {
                this.onClickAction(notification, path);
            });
        }
    }

    _isSamePath(path) {
        return path && path === RouterContainer.get().getCurrentLocation().pathname;
    }

    onClickAction(notification, path) {
        window.focus();
        if (!this._isSamePath(path)) {
            RouterActionCreators.storeRouterTransitionPath(path);
            setTimeout(RouterContainer.get().push(path), 0);
        }
        setTimeout(() => {
            if (typeof notification.close !== 'undefined') {
                notification.close();
            }
        }, 100);
    }

    _iconOrDefaultIcon = function(icon) {
        return typeof icon !== 'undefined' && icon ? icon : 'https://nekuno.com/favicon-64.png';
    };
}

export default new NotificationService();