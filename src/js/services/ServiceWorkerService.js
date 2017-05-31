import NotificationActionCreators from '../actions/NotificationActionCreators';
import RouterContainer from './RouterContainer';
import Bluebird from 'bluebird';
Bluebird.config({
    cancellation: true
});
import { FIREBASE_SCRIPT, FCM_URL, FCM_API_KEY, FCM_AUTH_DOMAIN, FCM_PROJECT_ID, FCM_SENDER_ID, PUSH_PUBLIC_KEY } from '../constants/Constants';


class ServiceWorkerService {

    init() {
        if (window.cordova) {
            // Device is native
            let push = PushNotification.init({
                android: {
                    senderID: FCM_SENDER_ID,
                    applicationServerKey: PUSH_PUBLIC_KEY
                },
                browser: {
                    pushServiceURL: FCM_URL
                },
                ios: {
                    alert: "true",
                    badge: "true",
                    sound: "true"
                }
            });

            push.on('registration', (data) => {
                console.log('User IS subscribed with registration_id: ' + data.registrationId);
                const subscriptionData = {
                    endpoint: FCM_URL + data.registrationId
                };
                this.updateSubscriptionOnServer(subscriptionData);
            });

            push.on('notification', (data) => {
                // data.message,
                // data.title,
                // data.count,
                // data.sound,
                // data.image,
                // data.additionalData
                console.log('Notification clicked or received in foreground');
                const onClickPath = data.additionalData ? data.additionalData['on_click_path'] : null;
                const notification = {
                    title: data.title,
                    body: data.message,
                    icon: data.image,
                    on_click_path: onClickPath,
                    force_show: data.additionalData.force_show
                };
                setTimeout(NotificationActionCreators.notify(notification));

                // This is for iOS. notId must be sent
                push.finish(function() {
                    console.log("processing of push data is finished");
                }, function() {
                    console.log("something went wrong with push.finish for ID = " + data.additionalData.notId)
                }, data.additionalData.notId);
            });

            push.on('error', (e) => {
                console.log('Notification error');
                console.log(e);
            });

        } else if ('serviceWorker' in navigator && 'PushManager' in window) {
            // It's is a browser and Push is supported
            this.loadScript(FIREBASE_SCRIPT, this.onFirebaseLoaded);
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
        const messaging = firebase.messaging();

        requestPermission();
        // [START refresh_token]
        // Callback fired if Instance ID token is updated.
        messaging.onTokenRefresh(() => {
            messaging.getToken()
                .then(function(refreshedToken) {
                    console.log('Token refreshed.');
                    // Indicate that the new Instance ID token has not yet been sent to the
                    // app server.
                    setTokenSentToServer(false);
                    // Send Instance ID token to app server.
                    sendTokenToServer(refreshedToken);
                })
                .catch(function(err) {
                    console.log('Unable to retrieve refreshed token ', err);
                });
        });
        // [END refresh_token]
        // [START receive_message]
        // Handle incoming messages. Called when:
        // - a message is received while the app has focus
        // - the user clicks on an app notification created by a sevice worker
        //   `messaging.setBackgroundMessageHandler` handler.
        messaging.onMessage(function(payload) {
            console.log("Message received. ", payload);
            const data = payload.data;

            NotificationActionCreators.notify(data);
        });
        // [END receive_message]
        function getToken() {
            // [START get_token]
            // Get Instance ID token. Initially this makes a network call, once retrieved
            // subsequent calls to getToken will return from cache.
            return messaging.getToken()
                .then(function(currentToken) {
                    if (currentToken) {
                        sendTokenToServer(currentToken);
                    } else {
                        // Show permission request.
                        console.log('No Instance ID token available. Request permission to generate one.');
                        // Show permission UI.
                        setTokenSentToServer(false);
                    }
                })
                .catch(function(err) {
                    console.log('An error occurred while retrieving token. ', err);
                    setTokenSentToServer(false);
                });
        }
        // [END get_token]
        // Send the Instance ID token your application server, so that it can:
        // - send messages back to this app
        // - subscribe/unsubscribe the token from topics
        function sendTokenToServer(currentToken) {
            if (isTokenSentToServer()) {
                console.log('Sending token to server...');
                NotificationActionCreators.subscribe({
                    endpoint: FCM_URL + currentToken,
                    platform: 'Web'
                });
                setTokenSentToServer(true);
            } else {
                console.log('Token already sent to server so won\'t send it again ' +
                    'unless it changes');
            }
        }
        function isTokenSentToServer() {
            return window.localStorage.getItem('sentToServer') == 1;
        }
        function setTokenSentToServer(sent) {
            window.localStorage.setItem('sentToServer', sent ? 1 : 0);
        }
        function requestPermission() {
            console.log('Requesting permission...');
            // [START request_permission]
            return messaging.requestPermission()
                .then(() => {
                    console.log('Notification permission granted.');
                    // TODO(developer): Retrieve an Instance ID token for use with FCM.
                    // [START_EXCLUDE]
                    // In many cases once an app has been granted notification permission, it
                    // should update its UI reflecting this.
                    getToken();
                    // [END_EXCLUDE]
                })
                .catch(function(err) {
                    console.log('Unable to get permission to notify.', err);
                });
            // [END request_permission]
        }
    }

    updateSubscriptionOnServer(subscriptionData) {
        if (subscriptionData) {
            subscriptionData.platform = typeof device == 'undefined' || !device.platform ? 'Web' : device.platform;
            NotificationActionCreators.subscribe(subscriptionData);
        } else {
            console.log('Not subscribed');
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

export default new ServiceWorkerService();