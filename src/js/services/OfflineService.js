import { OFFLINE_CHECK_IMAGE } from '../constants/Constants';
import TranslationService from './TranslationService';

class OfflineService {
    check() {
        let i = new Image();
        i.onload = doConnectFunction;
        i.onerror = doNotConnectFunction;

        i.src = OFFLINE_CHECK_IMAGE.replace('%timestamp%', new Date());

        function doConnectFunction() {
            console.log('Connected to Internet');
        }
        function doNotConnectFunction() {
            nekunoApp.alert(TranslationService.getTranslatedString('OfflineService', 'isOffline'));
        }
    }
}

export default new OfflineService();