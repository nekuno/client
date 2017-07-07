import { API_URLS } from '../constants/Constants';
import * as APIUtils from '../utils/APIUtils';
import prune from 'json-prune';

class AuthService {

    validateInvitation(token) {

        return APIUtils.postData(API_URLS.VALIDATE_INVITATION_TOKEN + token);
    }

    login(username, password) {

        return APIUtils.postData(API_URLS.LOGIN, {username, password});
    }

    resourceOwnerLogin(resourceOwner, oauthToken, refreshToken) {

        return APIUtils.postData(API_URLS.LOGIN, {resourceOwner: resourceOwner, oauthToken: oauthToken, refreshToken: refreshToken});
    }

    register(user, profile, token, oauth) {
        const trackingData = this.getTrackingData();
        return APIUtils.postData(API_URLS.REGISTER, {
                user: user,
                profile: profile,
                token: token,
                oauth: oauth,
                trackingData: prune(trackingData)
            }).catch((error) => {
                throw error;
            });
    }

    connect(resource, accessToken, resourceId, expireTime, refreshToken) {
        return APIUtils.postData(API_URLS.CONNECT_ACCOUNT.replace('{resource}', resource), {oauthToken: accessToken, resourceId: resourceId, expireTime: expireTime, refreshToken: refreshToken});
    }

    reConnect(resource, accessToken, resourceId, expireTime, refreshToken) {
        return APIUtils.putData(API_URLS.CONNECT_ACCOUNT.replace('{resource}', resource), {oauthToken: accessToken, resourceId: resourceId, expireTime: expireTime, refreshToken: refreshToken});
    }

    getTrackingData() {
        let _navigator = {};
        let _screen = {};
        for (let i in navigator) _navigator[i] = navigator[i];
        delete _navigator.plugins;
        delete _navigator.mimeTypes;
        for (let i in window.screen) _screen[i] = window.screen[i];

        return {
            navigator: _navigator,
            screen: _screen,
            referrer: document.referrer
        };
    }

}

export default new AuthService();
