// Give the service worker access to Firebase Messaging.
// Note that you can only use Firebase Messaging here, other Firebase libraries
// are not available in the service worker.
importScripts('https://www.gstatic.com/firebasejs/4.0.0/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/4.0.0/firebase-messaging.js');

// Initialize the Firebase app in the service worker by passing in the
// messagingSenderId.
firebase.initializeApp({
    'messagingSenderId': '345837503310'
});

// Retrieve an instance of Firebase Messaging so that it can handle background
// messages.
const messaging = firebase.messaging();

messaging.setBackgroundMessageHandler(function(payload) {
    console.log('[firebase-messaging-sw.js] Received background message ', payload);
    // Customize notification here
    const {data} = payload;
    const notificationOptions = {
        body: data.body,
        icon: data.image,
        data: {
            action: data.on_click_path || null
        }
    };

    return self.registration.showNotification(data.title, notificationOptions);
});

self.addEventListener('notificationclick', function(event) {
    event.notification.close();
    const baseUrl = location.protocol+'//'+ location.hostname + '/#';
    const path = event.notification.data.action ? '/#' + event.notification.data.action : null;
    const url = baseUrl + event.notification.data.action;

    // This looks to see if the current is already open and
    // focuses if it is
    event.waitUntil(clients.matchAll({includeUncontrolled: true, type: 'window'}).then(function(clientList) {
        for (let i = 0; i < clientList.length; i++) {
            let client = clientList[i];
            if (client.url == url && 'focus' in client || !path && client.url.substring(0, baseUrl.length) === baseUrl)
                return client.focus();
        }
        if (clients.openWindow) {
            return path ? clients.openWindow(path) : clients.openWindow(baseUrl + '/');
        }
    }));
});
