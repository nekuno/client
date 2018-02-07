import { GOOGLE_RECAPTCHA_URL } from '../constants/Constants';

class RecaptchaService {
    init() {
        let _self = this;

        if (window.cordova) {
            document.addEventListener('deviceready', onDeviceReady, false);
            function onDeviceReady() {
                _self.loadScript(GOOGLE_RECAPTCHA_URL);
            }
        } else {
            _self.loadScript(GOOGLE_RECAPTCHA_URL);
        }
    }

    loadScript = function (url) {
        let head = document.getElementsByTagName('head')[0];
        let script = document.createElement('script');
        script.type = 'text/javascript';
        script.src = url;

        // Fire the loading
        head.appendChild(script);
    }

}

export default new RecaptchaService();