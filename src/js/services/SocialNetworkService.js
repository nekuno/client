import {FACEBOOK_SCOPE, TWITTER_SCOPE, GOOGLE_SCOPE, SPOTIFY_SCOPE} from '../constants/Constants';

class SocialNetworkService {

    constructor() {
        this._accessTokens = {};
        this._resourceIds = {};
        this._scopes = {};
    }

    login(resource, scope) {
        if (!scope) {
            scope = this._getDefaultScope(resource);
        }
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

    getDataFromUrl(resource, url, method, data) {
        if (!this._accessTokens[resource]) {
            this.login(resource)
        }
        return hello(resource).api(url, method, data);
    }
    
    getAccessToken(resource) {
        return this._accessTokens[resource] || null;
    }

    getResourceId(resource) {
        return this._resourceIds[resource] || null;
    }

    _setResourceData(resource, response) {
        this._accessTokens[resource] = response.authResponse.access_token;
        return hello(resource).api('me').then(
            (status) => this._resourceIds[resource] = status.id.toString(),
            (error) => { console.log(error) }
        );
    }
    
    _getDefaultScope(resource) {
        switch(resource) {
            case 'facebook':
                return FACEBOOK_SCOPE;
            case 'twitter':
                return TWITTER_SCOPE;
            case 'spotify':
                return SPOTIFY_SCOPE;
            case 'google':
                return GOOGLE_SCOPE;
            default:
                return null;
        }
    }
}

export default new SocialNetworkService();
