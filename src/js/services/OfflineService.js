import { API_URLS } from '../constants/Constants';
import TranslationService from './TranslationService';
import Framework7Service from './Framework7Service';
import Url from 'url';
import request from 'request';
import Bluebird from 'bluebird';
Bluebird.config({
    cancellation: true
});

class OfflineService {

    constructor() {
        this._alertPresent = false;
    }

    check() {
        return new Bluebird((resolve, reject, onCancel) => {
            let promise = request(
                {
                    method  : 'GET',
                    protocol: Url.parse(API_URLS.CONNECTION_STATUS).protocol,
                    url     : API_URLS.CONNECTION_STATUS,
                    json    : true
                },
                (err, response, body) => {
                    Framework7Service.nekunoApp().hideProgressbar();
                    if (err) {
                        this.alertOffline();
                        return reject(err);
                    }
                    if (response.statusCode >= 400) {
                        this.alertOffline();
                        return reject(body);
                    }
                    return resolve(body);
                }
            );

            onCancel(() => {
                this.alertOffline();
                promise.abort();
            });
        });
    }

    alertOffline() {
        if (!this._alertPresent) {
            const title = TranslationService.getTranslatedString('Framework7', 'modalTitle');
            Framework7Service.nekunoApp().alert(TranslationService.getTranslatedString('OfflineService', 'isOffline'), title ,() => {
                this._alertPresent = false;
                location.reload();
            });
            this._alertPresent = true;
        }
    }
}

export default new OfflineService();