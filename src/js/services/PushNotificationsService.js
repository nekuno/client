import NotificationActionCreators from '../actions/NotificationActionCreators';
import NotificationService from './NotificationService';
import LocalStorageService from './LocalStorageService';
import { FIREBASE_SCRIPT, FCM_API_KEY, FCM_AUTH_DOMAIN, FCM_PROJECT_ID, FCM_SENDER_ID, PUSH_PUBLIC_KEY } from '../constants/Constants';

class PushNotificationsService {

    constructor() {
        this._push = null; // Native
        this._messaging = null; // Web
        this._subscriptionData = null;
    }

    init() {
        if (window.cordova) {
            // Device is native
            this._push = PushNotification.init({
                android: {
                    senderID: FCM_SENDER_ID,
                    applicationServerKey: PUSH_PUBLIC_KEY
                },
                ios: {
                    alert: "true",
                    badge: "true",
                    sound: "true"
                }
            });

            this._push.on('registration', (data) => {
                console.log('User IS subscribed with registration_id: ' + data.registrationId);
                const subscriptionData = {
                    registrationId: data.registrationId,
                    platform: device.platform
                };
                this.updateSubscriptionOnServer(subscriptionData);
            });

            this._push.on('notification', (data) => {
                // data.message,
                // data.title,
                // data.count,
                // data.sound,
                // data.image,
                // data.additionalData
                const isForeground = data.additionalData.foreground;
                const onClickPath = data.additionalData.on_click_path;
                const notification = {
                    title: data.title,
                    body: data.message,
                    image: data.image,
                    on_click_path: onClickPath,
                    force_show: data.additionalData.force_show
                };
                if (isForeground) {
                    console.log('Notification received in foreground');
                    setTimeout(NotificationActionCreators.notify(notification));
                } else {
                    console.log('Background notification clicked');
                    setTimeout(NotificationService.onClickAction(notification, onClickPath));
                }

                // This is for iOS. notId must be sent
                this._push.finish(function() {
                    console.log("processing of push data is finished");
                }, function() {
                    console.log("something went wrong with push.finish for ID = " + data.additionalData.notId)
                }, data.additionalData.notId);
            });

            this._push.on('error', (e) => {
                console.log('Notification error');
                console.log(e);
            });

        } else if ('serviceWorker' in navigator && 'PushManager' in window) {
            // It's is a browser and Push is supported
            this.loadScript(FIREBASE_SCRIPT, () => this.onFirebaseLoaded());
        }

        return false;
    }

    onFirebaseLoaded() {
        // Initialize Firebase
        let config = {
            apiKey: FCM_API_KEY,
            authDomain: FCM_AUTH_DOMAIN,
            projectId: FCM_PROJECT_ID,
            messagingSenderId: FCM_SENDER_ID
        };
        firebase.initializeApp(config);
        this._messaging = firebase.messaging();

        this.requestPermission();

        // Callback fired if Instance ID token is updated.
        this._messaging.onTokenRefresh(() => {
            this._messaging.getToken()
                .then((refreshedToken) => {
                    console.log('Token refreshed.');
                    NotificationActionCreators.unSubscribe(this._subscriptionData).then(() => {
                        // Send Instance ID token to app server.
                        this.sendTokenToServer(refreshedToken);
                    }, () => console.log('Error unsubscribing user'));
                })
                .catch(function(err) {
                    console.log('Unable to retrieve refreshed token ', err);
                });
        });

        // Handle incoming messages. Called when:
        // - a message is received while the app has focus
        // - the user clicks on an app notification created by a sevice worker
        //   `messaging.setBackgroundMessageHandler` handler.
        this._messaging.onMessage(function(payload) {
            console.log("Message received. ", payload);
            const data = payload.data;
            // This prevents to show one notification for each tab
            setTimeout(() => {
                if (LocalStorageService.get('lastNotificationId') != parseInt(data.notId)) {
                    LocalStorageService.set('lastNotificationId', parseInt(data.notId));
                    NotificationActionCreators.notify(data);
                }
            }, Math.random() * 1000);
        });
    }

    requestPermission() {
        console.log('Requesting permission...');
        return this._messaging.requestPermission()
            .then(() => {
                console.log('Notification permission granted.');
                this.getToken();
            })
            .catch(function(err) {
                console.log('Unable to get permission to notify.', err);
            });
    }

    getToken() {
        // Get Instance ID token. Initially this makes a network call, once retrieved
        // subsequent calls to getToken will return from cache.
        return this._messaging.getToken()
            .then((currentToken) => {
                if (currentToken) {
                    this.sendTokenToServer(currentToken);
                } else {
                    console.log('No Instance ID token available. Request permission to generate one.');
                }
            })
            .catch(function(err) {
                console.log('An error occurred while retrieving token. ', err);
            });
    }

    sendTokenToServer(currentToken) {
        const subscriptionData = {
            registrationId: currentToken,
            platform: 'Web'
        };

        this.updateSubscriptionOnServer(subscriptionData);
    }

    updateSubscriptionOnServer(subscriptionData) {
        if (subscriptionData) {
            this._subscriptionData = Object.assign({}, subscriptionData);
            NotificationActionCreators.subscribe(subscriptionData);
        } else {
            console.log('Not subscribed');
        }
    }

    unSubscribe() {
        if (window.cordova) {
            return new Promise((resolve, reject) => {
                if (!this._push) {
                    reject('No subscription');
                }
                this._push.unregister(() => {
                    console.log('User unregistered from push notifications.');
                    resolve(NotificationActionCreators.unSubscribe(this._subscriptionData));
                }, () => {
                    console.log('Error unregistering user from push notifications.');
                    reject(error)
                });
            });

        } else {
            if (!this._messaging) {
                return new Promise(function(resolve, reject) {
                    reject('No subscription')
                });
            }
            return this._messaging.getToken()
                .then((currentToken) => {
                    return this._messaging.deleteToken(currentToken)
                        .then(() => {
                            console.log('Token deleted.');
                            return NotificationActionCreators.unSubscribe(this._subscriptionData);
                        })
                        .catch(function(err) {
                            console.log('Unable to delete token. ', err);
                            return new Promise(function(resolve, reject) {
                                reject(error)
                            });
                        });
                })
                .catch(function(err) {
                    console.log('Error retrieving Instance ID token. ', err);
                    return new Promise(function(resolve, reject) {
                        reject(error)
                    });
                });
        }
    }

    loadScript = function (url, callback) {
        let head = document.getElementsByTagName('head')[0];
        let script = document.createElement('script');
        script.type = 'text/javascript';
        script.src = url;

        script.onload = callback;

        // Fire the loading
        head.appendChild(script);
    }

}

export default new PushNotificationsService();