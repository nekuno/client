import {IMAGINE_ROOT} from '../constants/Constants';

class OptionImageService {

    getThumbnailRound(url) {
        return IMAGINE_ROOT + 'profile_option_small' + '?url=' + encodeURIComponent(url);
    }

}

export default new OptionImageService();