import {IMAGINE_ROOT} from '../constants/Constants';

class LinkImageService {
    imageExtensions = ['jpg', 'jpeg', 'tif', 'tiff', 'gif', 'png', 'bmp', 'pbm', 'pgm', 'ppm', 'webp', 'hdr', 'heif', 'heic', 'bpg', 'ico', 'cgm', 'svg', 'gbm'];

    getThumbnail = function(url, size) {
        return IMAGINE_ROOT + `link_${size}/` + this.getUrlHash(url) + '?url=' + encodeURIComponent(url);
    };

    // https://stackoverflow.com/questions/7616461/generate-a-hash-from-string-in-javascript-jquery
    getUrlHash = function(url) {
        let hash = 0;
        if (url.length == 0) return 'uploads/links/' + hash + '.' + this.getExtension(url);
        for (let i = 0; i < url.length; i++) {
            const char = url.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash; // Convert to 32bit integer
        }
        hash = hash.toString().substr(0, 4) + '/' + hash.toString().substr(4, 4) + '/' +  hash.toString().substr(8);

        return 'uploads/links/' + hash + '.' + this.getExtension(url);
    };

    getExtension = function(url) {
        if (url.indexOf('?') !== -1) {
            url = url.substr(0, url.indexOf('?'));
        }

        let extension = url.split('.').pop();
        const isValidExtension = this.imageExtensions.some(imageExtension => imageExtension === extension);

        return isValidExtension ? extension : 'png';
    };
}

export default new LinkImageService();