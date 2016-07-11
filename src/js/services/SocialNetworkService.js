class SocialNetworkService {

    constructor() {
        this._accessTokens = {};
        this._resourceIds = {};
        this._scopes = {};
        this._profiles = {};
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

    _setResourceData(resource, response) {
        console.log(resource, response);
        this._accessTokens[resource] = response.authResponse.access_token;
        return hello(resource).api('me').then(
            (status) => {
                console.log(status);
                this._resourceIds[resource] = status.id.toString();
                this._profiles[resource] = {
                    picture : status.picture,
                    username: status.username,
                    email   : status.email,
                    birthday: status.birthday,
                    location: status.location,
                    gender  : status.gender
                };
            }, (error) => { console.log(error) }
        );
    }
}

export default new SocialNetworkService();
