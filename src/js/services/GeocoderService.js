import Bluebird from 'bluebird';

class GeocoderService {
    constructor() {
        this._geocoder = new google.maps.Geocoder();
    }

    getLocation(address) {
        return new Bluebird((resolve, reject) => {
            this._geocoder.geocode({'address': address}, function(results, status) {
                if (status === google.maps.GeocoderStatus.OK) {
                    if (typeof results[0].address_components == 'undefined') {
                        return reject();
                    }
                    var components = {};
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
}

export default new GeocoderService();