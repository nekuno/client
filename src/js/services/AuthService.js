import Url from 'url';
import request from 'request';
import Bluebird from 'bluebird';
import { LOGIN_URL, REGISTER_USER_URL, VALIDATE_INVITATION_TOKEN_URL } from '../constants/Constants';

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
                    protocol: Url.parse(VALIDATE_INVITATION_TOKEN_URL).protocol,
                    url     : VALIDATE_INVITATION_TOKEN_URL + token,
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
                    protocol: Url.parse(LOGIN_URL).protocol,
                    url     : LOGIN_URL,
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

    register(username, plainPassword, email) {
        return new Bluebird((resolve, reject) => {
            request.post(
                {
                    protocol: Url.parse(REGISTER_USER_URL).protocol,
                    url     : REGISTER_USER_URL,
                    body    : {username, plainPassword, email},
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

}

export default new AuthService();
