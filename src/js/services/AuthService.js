import Url from 'url';
import request from 'request';
import Bluebird from 'bluebird';
import { LOGIN_URL, VALIDATE_INVITATION_TOKEN_URL } from '../constants/Constants';

class AuthService {

    validate(token) {
        return new Bluebird((resolve, reject) => {
            request.post(
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
        return new Bluebird((resolve, reject) => {
            request.post(
                {
                    protocol: Url.parse(LOGIN_URL).protocol,
                    url     : LOGIN_URL,
                    body    : {username, password},
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

    signup(username, password, extra) {
        return new Bluebird((resolve, reject) => {
            request.post(
                {
                    protocol: Url.parse(LOGIN_URL).protocol,
                    url     : LOGIN_URL,
                    body    : {username, password, extra},
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
