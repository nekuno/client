import Url from 'url';
import request from 'request';
import Bluebird from 'bluebird';
import { API_URLS } from '../constants/Constants';
import * as APIUtils from '../utils/APIUtils';

class AuthService {

    constructor() {
        this._invitationPromise = null;
        this._usernamePromise = null;
    }

    validateInvitation(token) {

        nekunoApp.showProgressbar();

        return new Bluebird((resolve, reject) => {

            if (this._invitationPromise) {
                this._invitationPromise.abort();
            }
            this._invitationPromise = request.post(
                {
                    protocol: Url.parse(API_URLS.VALIDATE_INVITATION_TOKEN + token).protocol,
                    url     : API_URLS.VALIDATE_INVITATION_TOKEN + token,
                    body    : {},
                    json    : true
                },
                (err, response, body) => {
                    nekunoApp.hideProgressbar();
                    if (err) {
                        return reject(err);
                    }
                    if (response.statusCode >= 400) {
                        return reject(body);
                    }
                    return resolve(body);
                }
            );
        });
    }

    validateUsername(username) {

        nekunoApp.showProgressbar();

        return new Bluebird((resolve, reject) => {

            if (this._usernamePromise) {
                this._usernamePromise.abort();
            }
            this._usernamePromise = request.get(
                {
                    protocol: Url.parse(API_URLS.VALIDATE_USERNAME + username).protocol,
                    url     : API_URLS.VALIDATE_USERNAME + username,
                    body    : {},
                    json    : true
                },
                (err, response, body) => {
                    nekunoApp.hideProgressbar();
                    if (err) {
                        return reject(err);
                    }
                    if (response.statusCode >= 400) {
                        return reject(body);
                    }
                    return resolve(body);
                }
            );
        });
    }

    login(username, password) {

        return APIUtils.postData(API_URLS.LOGIN, {username, password});
    }

    register(user, profile) {

        return APIUtils.postData(API_URLS.VALIDATE_USER, user)
            .then(function() {
                console.log('User valid');
                return APIUtils.postData(API_URLS.VALIDATE_PROFILE, profile);
            })
            .then(function() {
                console.log('Profile valid');
                return APIUtils.postData(API_URLS.REGISTER_USER, user);
            })
            .then(function(user) {
                console.log('User registered', user);
                return [user, APIUtils.postData(API_URLS.REGISTER_PROFILE.replace('{id}', user.qnoow_id), profile)];
            })
            .spread(function(user, profile) {
                console.log('Profile registered', user, profile);
                return {
                    user,
                    profile
                };
            });
    }

}

export default new AuthService();
