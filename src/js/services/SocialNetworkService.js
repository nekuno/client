import GeocoderService from './GeocoderService';
import { SOCIAL_NETWORKS_NAMES, FACEBOOK_ID } from '../constants/Constants';
import moment from 'moment';
import selectn from 'selectn';

class SocialNetworkService {

    constructor() {
        this._accessTokens = {};
        this._expireTime = {};
        this._resourceIds = {};
        this._refreshTokens = {};
        this._scopes = {};
        this._profiles = {};
        this._users = {};
        this._loggedInWithPlugin = false;
    }

    initFacebookSDK() {
        if (!window.cordova) {
            window.fbAsyncInit = function () {
                FB.init({
                    appId: FACEBOOK_ID,
                    xfbml: true,
                    version: 'v2.8'
                });
                FB.AppEvents.logPageView();
            };
            (function(d, s, id) {
                var js, fjs = d.getElementsByTagName(s)[0];
                if (d.getElementById(id)) return;
                js = d.createElement(s); js.id = id;
                js.src = "https://connect.facebook.net/es_ES/sdk.js#xfbml=1&version=v2.8";
                fjs.parentNode.insertBefore(js, fjs);
            }(document, 'script', 'facebook-jssdk'))
        }
    }

    login(resource, scope, force) {
        force = force || null;
        // FB and TW do not need force option to get the refresh token
        if (resource == SOCIAL_NETWORKS_NAMES.FACEBOOK || resource == SOCIAL_NETWORKS_NAMES.TWITTER) {
            force = null;
        }
        if (this.isLoggedIn(resource, scope)) { 
            return new Promise(function (resolve) {return resolve(true)});
        }
        this._scopes[resource] = scope;
        if (this._mustUseFacebookPlugin(resource)) {
            let promise = new Promise(function (resolve, reject) {
                facebookConnectPlugin.login(scope.split(','), function (response) { resolve(response) }, function(error) { reject(error) });
            });
            return promise.then(
                (response) => { this._setFacebookDataFromPlugin(response) },
                (error) => {
                    return hello(resource).login({scope: scope, force: force}).then(
                        (response) => this._setResourceData(resource, response),
                        (error) => {
                            console.log(error);
                            return Promise.reject(error);
                        }
                    );
                }
            );
        } else {
            return hello(resource).login({scope: scope, force: force}).then(
                (response) => this._setResourceData(resource, response),
                (error) => {
                    console.log(error);
                    return Promise.reject(error);
                }
            );
        }
    }
    
    isLoggedIn(resource, scope) {
        return this._accessTokens[resource] && (!scope || this._scopes[resource] == scope);
    }

    getDataFromUrl(resource, scope, url, method, data) {
        if (!this._accessTokens[resource]) {
            this.login(resource, scope);
        }
        if (this._mustUseFacebookPlugin(resource)) {
            const pluginUrl = this._getAnalogPluginUrl(url, data);
            let promise = new Promise(function(resolve, reject) {
                facebookConnectPlugin.api(pluginUrl, ['user_photos'], function (response) { resolve(response) }, function(error) { reject(error) });
            });

            return promise.then(
                (status) => {
                    return status;
                }, (error) => { console.log(error) }
            );
        } else {
            return hello(resource).api(url, method, data);
        }
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

    getRefreshToken(resource) {
        return this._refreshTokens[resource] || null;
    }

    buildOauthData(resource) {
        return {
            resourceOwner: resource,
            oauthToken   : this.getAccessToken(resource),
            resourceId   : this.getResourceId(resource),
            expireTime   : this.getExpireTime(resource),
            refreshToken : this.getRefreshToken(resource)
        }
    }

    _mustUseFacebookPlugin(resource) {
        if (this.isLoggedIn(resource)) {
            return this._loggedInWithPlugin;
        } else {
            return resource == SOCIAL_NETWORKS_NAMES.FACEBOOK && typeof facebookConnectPlugin !== 'undefined';
        }
    }

    _getAnalogPluginUrl = function(url, data) {
        let analogUrl = null;
        switch(url) {
            case 'me':
                analogUrl = 'me?fields=email,first_name,last_name,name,timezone,verified';
                break;
            case 'me/friends':
                analogUrl = 'me/friends';
                break;
            case 'me/following':
                analogUrl = 'me/friends';
                break;
            case 'me/followers':
                analogUrl = 'me/friends';
                break;
            case 'me/share':
                analogUrl = 'me/feed';
                break;
            case 'me/like':
                analogUrl = 'me/likes';
                break;
            case 'me/files':
                analogUrl = 'me/albums';
                break;
            case 'me/albums':
                analogUrl = 'me/albums?fields=cover_photo,name,picture';
                break;
            case 'me/album':
                analogUrl = '@{id}/photos?fields=picture&type=album';
                break;
            case 'me/photos':
                analogUrl = 'me/photos';
                break;
            case 'me/photo':
                analogUrl = '@{id}';
                break;
            case 'friend/albums':
                analogUrl = '@{id}/albums';
                break;
            case 'friend/photos':
                analogUrl = '@{id}/photos';
                break;
            default:
                break;
        }

        return data && data.id ? analogUrl.replace('@{id}', data.id) : analogUrl;
    };
    
    _setResourceData(resource, response) {
        console.log(resource, response);
        this._accessTokens[resource] = response.authResponse.access_token;
        this._expireTime[resource] = Math.floor(response.authResponse.expires);
        this._refreshTokens[resource] = response.authResponse.refresh_token || null;

        return hello(resource).api('me').then(
            (status) => {
                console.log('hellojs api(\'me\')', status);
                this._resourceIds[resource] = status.id.toString();
                GeocoderService.getLocationFromAddress(status.location).then(
                    (location) => { this._setUserAndProfile(resource, status, location) },
                    (error) => { this._setUserAndProfile(resource, status, null) }
                );
            }, (error) => { console.log(error) }
        );
    }

    _setFacebookDataFromPlugin(response) {
        console.log(SOCIAL_NETWORKS_NAMES.FACEBOOK, response);
        this._accessTokens[SOCIAL_NETWORKS_NAMES.FACEBOOK] = response.authResponse.accessToken;
        this._resourceIds[SOCIAL_NETWORKS_NAMES.FACEBOOK] = response.authResponse.userID.toString();
        const resourceId = this._resourceIds[SOCIAL_NETWORKS_NAMES.FACEBOOK];

        let mePromise = new Promise(function(resolve, reject) {
            facebookConnectPlugin.api(resourceId + '/?fields=picture.height(480),email,birthday,location,gender', [], function (response) { resolve(response) }, function(error) { reject(error) });
        });

        return mePromise.then(
            (status) => {
                console.log('facebookConnectPlugin api(\'me\')', status);
                let data = {
                    username: status.username || null,
                    email: status.email || null,
                    picture: selectn('data.url', status.picture) ? status.picture.data.url : null,
                    birthday: moment(status.birthday).format('YYYY-MM-DD') || null,
                    location: status.location ? status.location.name : null,
                    gender: status.gender || null
                };

                GeocoderService.getLocationFromAddress(data.location).then(
                    (location) => { this._setUserAndProfile(SOCIAL_NETWORKS_NAMES.FACEBOOK, data, location) },
                    (error) => { this._setUserAndProfile(SOCIAL_NETWORKS_NAMES.FACEBOOK, data, null) }
                );

                this._loggedInWithPlugin = true;
            }, (error) => { console.log(error) }
        );
    }

    _setUserAndProfile(resource, status, location) {
        // age must be greater than 14
        const birthday = status.birthday && (new Date().getTime() - new Date(status.birthday).getTime() > 441796964000) ? status.birthday : null;
        const gender = status.gender == "male" || status.gender == "female" ? status.gender : null;
        location = location && location.latitude && location.longitude && location.address && location.locality && location.country ? location : null;
        this._users[resource] = {
            username     : status.username || null,
            email        : status.email || null,
            photo        : status.picture || null
        };
        this._profiles[resource] = {
            birthday: birthday,
            location: location,
            gender  : gender
        };
    }
}

export default new SocialNetworkService();
