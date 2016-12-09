import { TRACKER_ID } from '../constants/Constants';

class AnalyticsService {

    init() {

        let trackerId = TRACKER_ID;

        if (!trackerId) {
            return;
        }

        if (window.cordova) {

            document.addEventListener('deviceready', onDeviceReady, false);

            function onDeviceReady() {
                window.ga.startTrackerWithId(trackerId);
                window.ga.trackView('Home');
            }

        } else {

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

            ga('create', trackerId, 'auto');
            ga('send', 'pageview');

        }

    }
}

export default new AnalyticsService();