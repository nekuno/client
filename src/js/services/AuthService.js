import { API_URLS } from '../constants/Constants';
import * as APIUtils from '../utils/APIUtils';

class AuthService {

    validateInvitation(token) {

        return APIUtils.postData(API_URLS.VALIDATE_INVITATION_TOKEN + token);
    }

    login(username, password) {

        return APIUtils.postData(API_URLS.LOGIN, {username, password});
    }

    resourceOwnerLogin(resourceOwner, accessToken) {

        return APIUtils.postData(API_URLS.LOGIN, {resourceOwner, accessToken});
    }

    register(user, profile, token, oauth) {
        return APIUtils.postData(API_URLS.REGISTER, {
                user: user,
                profile: profile,
                token: token,
                oauth: oauth
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

}

export default new AuthService();
