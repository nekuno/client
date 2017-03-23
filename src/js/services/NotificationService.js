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

        this._grant().then(() => {
            let notification = new Notification(title, options);
            notification.onclick = function () {
                window.focus();
                if (url !== RouterContainer.get().getCurrentLocation().pathname) {
                    setTimeout(RouterContainer.get().push(url), 0);
                }
            };
            setTimeout(notification.close.bind(notification), 5000);
        }).catch((error) => {
            console.log(error)
        });
    }

    _grant = function() {
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

}

export default new NotificationService();