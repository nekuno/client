import RouterContainer from './RouterContainer';

class NotificationService {

    notifyMessage(slug, title, body, lang, icon) {
        const url = `/conversations/${slug}`;
        this.notify(title, body, lang, icon, url);
    }

    notify(title, body, lang, icon, url) {
        let options = {
            body: body,
            icon: icon,
            lang: lang
        };

        if(this._grant()) {
            let notification = new Notification(title, options);
            notification.onclick = function() {
                window.focus();
                if(url !== RouterContainer.get().getCurrentLocation().pathname) {
                    setTimeout(RouterContainer.get().push(url), 0);
                }
            };
            setTimeout(notification.close.bind(notification), 5000);
        }
    }

    _grant = function() {
        if (!("Notification" in window)) {
            return false;
        }

        // Let's check whether notification permissions have already been granted
        else if (Notification.permission === "granted") {
            return true;
        }

        // Otherwise, we need to ask the user for permission
        else if (Notification.permission !== 'denied') {
            Notification.requestPermission((permission) => {
                if (permission === "granted") {
                    return true;
                }
            });
        }

        return false;
    };

}

export default new NotificationService();