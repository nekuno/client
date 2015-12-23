import Url from 'url';
import request from 'request';
import Bluebird from 'bluebird';
import { LOGIN_URL } from '../constants/Constants';

class AuthService {

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
