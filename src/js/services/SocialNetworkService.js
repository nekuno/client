import GeocoderService from './GeocoderService';

class SocialNetworkService {

    constructor() {
        this._accessTokens = {};
        this._expireTime = {};
        this._resourceIds = {};
        this._scopes = {};
        this._profiles = {};
        this._users = {};
    }

    login(resource, scope) {
        if (this.isLoggedIn(resource, scope)) { 
            return new Promise(function (resolve) {return resolve(true)});
        }
        this._scopes[resource] = scope;
        return hello(resource).login({scope: scope}).then(
            (response) => this._setResourceData(resource, response), 
            (error) => { console.log(error) }
        );
    }
    
    isLoggedIn(resource, scope) {
        return this._accessTokens[resource] && (!scope || this._scopes[resource] == scope);
    }

    getDataFromUrl(resource, scope, url, method, data) {
        if (!this._accessTokens[resource]) {
            this.login(resource, scope);
        }
        return hello(resource).api(url, method, data);
    }
    
    getAccessToken(resource) {
        return this._accessTokens[resource] || null;
    }

    getResourceId(resource) {
        return this._resourceIds[resource] || null;
    }

    getProfile(resource) {
        return this._profiles[resource] || null;
    }
    
    getUser(resource) {
        return this._users[resource] || null;
    }
    
    getExpireTime(resource) {
        return this._expireTime[resource] || null;
    }

    _setResourceData(resource, response) {
        console.log(resource, response);
        this._accessTokens[resource] = response.authResponse.access_token;
        this._expireTime[resource] = Math.floor(response.authResponse.expires);
        return hello(resource).api('me').then(
            (status) => {
                this._resourceIds[resource] = status.id.toString();
                GeocoderService.getLocationFromAddress(status.location).then(
                    (location) => { this._setUserAndProfile(resource, status, location) }, 
                    (error) => { this._setUserAndProfile(resource, status, null) }
                );
            }, (error) => { console.log(error) }
        );
    }
    
    _setUserAndProfile(resource, status, location) {
        this._users[resource] = {
            username     : status.username || null,
            email        : status.email || null,
            picture      : status.picture || null
        };
        this._profiles[resource] = {
            birthday: status.birthday || null,
            location: location,
            gender  : status.gender || null
        };
    }
}

export default new SocialNetworkService();
