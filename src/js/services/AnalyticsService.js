import { TRACKER_ID_WEB, TRACKER_ID_APP, VERSION } from '../constants/Constants';

class AnalyticsService {

    init() {

        if (window.cordova && TRACKER_ID_APP) {

            document.addEventListener('deviceready', onDeviceReady, false);

            function onDeviceReady() {
                console.log('Tracking APP with...' + TRACKER_ID_APP);
                window.ga.startTrackerWithId(TRACKER_ID_APP);
                window.ga.trackView('Home');
                window.ga.setAppVersion(VERSION);
            }

        } else if (TRACKER_ID_WEB) {

            console.log('Tracking WEB with...' + TRACKER_ID_WEB);
            (function(i, s, o, g, r, a, m) {
                i['GoogleAnalyticsObject'] = r;
                i[r] = i[r] || function() {
                        (i[r].q = i[r].q || []).push(arguments)
                    }, i[r].l = 1 * new Date();
                a = s.createElement(o),
                    m = s.getElementsByTagName(o)[0];
                a.async = 1;
                a.src = g;
                m.parentNode.insertBefore(a, m)
            })(window, document, 'script', 'https://www.google-analytics.com/analytics.js', 'ga');

            ga('create', TRACKER_ID_WEB, 'auto');
            ga('send', 'pageview');

        }

    }

    setUserId(userId) {
        if (window.cordova && TRACKER_ID_APP) {
            console.log('Setting APP userId ' + userId);
            window.ga.setUserId(userId);
            window.ga.addCustomDimension(1, userId);
        } else if (TRACKER_ID_WEB) {
            console.log('Setting WEB userId ' + userId);
            ga('set', 'userId', userId);
            ga('set', 'dimension1', userId);
        }
    }

    trackEvent(category, action, tag = null) {
        if (window.cordova && TRACKER_ID_APP) {
            console.log('Tracking APP event ' + category + ' ' + action);
            window.ga.trackEvent(category, action, tag);
        } else if (TRACKER_ID_WEB) {
            console.log('Tracking WEB event ' + category + ' ' + action);
            ga('send', 'event', category, action, tag);
        }
    }
}

export default new AnalyticsService();