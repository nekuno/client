import Bluebird from 'bluebird';
import { GOOGLE_MAPS_URL } from '../constants/Constants';

class GeocoderService {
    init() {
        let _self = this;

        global.onMapsApiLoaded = function () {
            _self._geocoder = new google.maps.Geocoder();
        };

        if (window.cordova) {
            document.addEventListener('deviceready', onDeviceReady, false);
            function onDeviceReady() {
                _self.loadScript(GOOGLE_MAPS_URL, onMapsApiLoaded);
            }
        } else {
            _self.loadScript(GOOGLE_MAPS_URL, onMapsApiLoaded);
        }
    }

    getLocationFromAddress(address) {
        return new Bluebird((resolve, reject) => {
            if (!address) {
                return reject();
            }
            this._geocoder.geocode({'address': address}, function(results, status) {
                if (status === google.maps.GeocoderStatus.OK) {
                    if (typeof results[0].address_components == 'undefined') {
                        return reject();
                    }
                    let components = {};
                    results[0].address_components.forEach(v1 => {
                        v1.types.forEach(v2 => {
                            components[v2] = v1.long_name;
                        });
                    });
                    return resolve({
                        latitude: results[0].geometry.location.lat(),
                        longitude: results[0].geometry.location.lng(),
                        address: results[0].formatted_address,
                        locality: components.locality || 'N/A',
                        country: components.country || 'N/A'
                    });
                } else {
                    return reject(status);
                }
            });
        });
    }

    getLocationFromCoords(lat, lng) {
        return new Bluebird((resolve, reject) => {
            if (!lat || !lng) {
                return reject();
            }
            let latLng = new google.maps.LatLng(parseFloat(lat), parseFloat(lng));
            this._geocoder.geocode({
                'latLng': latLng
            }, function (results, status) {
                if (status === google.maps.GeocoderStatus.OK) {
                    if (typeof results[0].address_components == 'undefined') {
                        return reject();
                    }
                    let components = {};
                    results[0].address_components.forEach(v1 => {
                        v1.types.forEach(v2 => {
                            components[v2] = v1.long_name;
                        });
                    });

                    return resolve({
                        latitude: results[0].geometry.location.lat(),
                        longitude: results[0].geometry.location.lng(),
                        address: results[0].formatted_address,
                        locality: components.locality || 'N/A',
                        country: components.country || 'N/A'
                    });
                } else {
                    return reject(status);
                }
            });
        });
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

export default new GeocoderService();