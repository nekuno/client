import RouterContainer from './RouterContainer';
import RouterActionCreators from '../actions/RouterActionCreators';
import LocaleStore from '../stores/LocaleStore';

class NotificationService {

    notify(data) {
        const {title, body, image, on_click_path, force_show} = data;
        if (title && body) {
            this.showNotification(title, body, image, on_click_path, force_show);
        }
    }

    showNotification(title, body, image, path, force_show) {
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
                icon: this._getDefaultIcon()
            });
            window.cordova.plugins.notification.local.on("click", (notification) => {
                this.onClickAction(notification, path);
            });
        } else {
            const lang = LocaleStore.getLanguage();
            let options = {
                body: body,
                icon: this._getDefaultIcon(),
                image: image,
                lang: lang
            };
            try {
                let notification = new Notification(title, options);
                notification.addEventListener('click', () => {
                    this.onClickAction(notification, path);
                });
            } catch (e) {
                // TODO: We may show an alert instead
                console.log('new Notification not supported.')
            }
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

    _getDefaultIcon = function() {
        return 'img/icons/192 - xxxhpdi.png';
    };
}

export default new NotificationService();