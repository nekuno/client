import Url from 'url';
import request from 'request';
import Bluebird from 'bluebird';
import { API_URLS } from '../constants/Constants';
import * as APIUtils from '../utils/APIUtils';

class AuthService {

    constructor() {
        this._promise = null;
    }

    validate(token) {

        return new Bluebird((resolve, reject) => {

            if (this._promise) {
                this._promise.abort();
            }
            this._promise = request.post(
                {
                    protocol: Url.parse(API_URLS.VALIDATE_INVITATION_TOKEN).protocol,
                    url     : API_URLS.VALIDATE_INVITATION_TOKEN + token,
                    body    : {},
                    json    : true
                },
                (err, response, body) => {
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

        nekunoApp.showProgressbar();

        return new Bluebird((resolve, reject) => {
            request.post(
                {
                    protocol: Url.parse(API_URLS.LOGIN).protocol,
                    url     : API_URLS.LOGIN,
                    body    : {username, password},
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

    register(user, profile) {

        return APIUtils.postData(API_URLS.VALIDATE_USER, user)
            .then(function(user) {
                console.log('User valid', user);
                return APIUtils.postData(API_URLS.VALIDATE_PROFILE, profile);
            })
            .then(function(profile) {
                console.log('Profile valid', profile);
                return APIUtils.postData(API_URLS.REGISTER_USER, user);
            })
            .then(function(user) {
                console.log('User registered', user);
                return [user, APIUtils.postData(API_URLS.REGISTER_PROFILE.replace('{id}', user.id), profile)];
            })
            .spread(function(user, profile) {
                console.log('Profile registered', profile, user);
            });

        //then(function(user) {
        //    $user = user;
        //
        //})
        //    .then(function(profile) {
        //        $profile = profile;
        //    })
        //    .catch(function(error) {
        //
        //    });

    }

}

export default new AuthService();
