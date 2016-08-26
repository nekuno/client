import Url from 'url';
import request from 'request';
import Bluebird from 'bluebird';
import { API_URLS } from '../constants/Constants';
import * as APIUtils from '../utils/APIUtils';
import * as ThreadActionCreators from '../actions/ThreadActionCreators';

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

    resourceOwnerLogin(resourceOwner, accessToken) {

        return APIUtils.postData(API_URLS.LOGIN, {resourceOwner, accessToken});
    }

    register(user, profile, token, oauth) {

        return APIUtils.postData(API_URLS.VALIDATE_USER, user)
            .then(function() {
                console.log('User valid');
                return APIUtils.postData(API_URLS.VALIDATE_PROFILE, profile);
            })
            .then(function() {
                console.log('Profile valid');
                user.oauth = oauth;
                return APIUtils.postData(API_URLS.REGISTER_USER, user);
            })
            .then((registeredUser) => {
                console.log('User registered', registeredUser);
                return [registeredUser, this.resourceOwnerLogin(oauth.resourceOwner, oauth.oauthToken)];
            })
            .spread(function(user, jwt) {
                console.log('jwt', jwt);
                APIUtils.setJwt(jwt.jwt);
                return [user, APIUtils.postData(API_URLS.REGISTER_PROFILE, profile)];
            })
            .spread(function(user, profile) {
                console.log('Profile registered', profile);
                return [user, profile, APIUtils.postData(API_URLS.CONSUME_INVITATION.replace('{token}', token))]
            })
            .spread(function(user, profile, invitation) {
                console.log('Invitation consumed', invitation);
                if (invitation.invitation.hasOwnProperty('group')) {
                    console.log('Joining group', invitation.invitation.group);
                    return [user, profile, invitation, oauth.oauthToken, APIUtils.postData(API_URLS.JOIN_GROUP.replace('{groupId}', invitation.invitation.group.id), user)]
                }
                return [user, profile, invitation, oauth.oauthToken, null];
            })
            .spread(function(user, profile, invitation, oauthToken, group) {
                if (group) {
                    console.log('Joined to group', group);
                }
                return [user, profile, invitation, oauthToken, ThreadActionCreators.createDefaultThreads()];
            })
            .spread(function(user, profile, invitation, oauthToken, threads) {
                console.log('Default threads created', threads);
                let recommendations = [];
                threads.forEach((thread) => {
                    recommendations.push(ThreadActionCreators.requestRecommendation(thread.id));
                });

                return [user, profile, invitation, oauthToken, Promise.all(recommendations)];
            })
            .spread(function(user, profile, invitation, oauthToken, recommendations) {
                console.log('Recommendations created', recommendations);
                console.log(user, profile, invitation, oauthToken);
                return {
                    user,
                    profile,
                    invitation,
                    oauthToken
                };
            });
    }

    connect(resource, accessToken, resourceId, expireTime, refreshToken) {
        return APIUtils.postData(API_URLS.CONNECT_ACCOUNT.replace('{resource}', resource), {oauthToken: accessToken, resourceId: resourceId, expireTime: expireTime, refreshToken: refreshToken});
    }

}

export default new AuthService();
