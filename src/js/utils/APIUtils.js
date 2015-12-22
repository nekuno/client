import { Schema, arrayOf, normalize } from 'normalizr';
import { camelizeKeys } from 'humps';
//import 'core-js/es6/promise';
import 'whatwg-fetch';
import request from 'request';
import Bluebird from 'bluebird';
import { API_ROOT } from '../constants/Constants';

/**
 * Extracts the next page URL from Github API response.
 */
function getNextPageUrl(response) {
    const link = response.headers.get('link');
    if (!link) {
        return null;
    }

    const nextLink = link.split(',').filter(s => s.indexOf('rel="next"') > -1)[0];
    if (!nextLink) {
        return null;
    }

    return nextLink.split(';')[0].slice(1, -1);
}

// We use this Normalizr schemas to transform API responses from a nested form
// to a flat form where repos and users are placed in `entities`, and nested
// JSON objects are replaced with their IDs. This is very convenient for
// consumption by Stores, because each Store can just grab entities of its kind.

// Read more about Normalizr: https://github.com/gaearon/normalizr

const userSchema = new Schema('users', {idAttribute: 'qnoow_id'});

const profileSchema = new Schema('profiles');

const statsSchema = new Schema('stats');

const threadSchema = new Schema('thread', {idAttribute: 'id'});

const threadsSchema = new Schema('threads');

const likedUserSchema = new Schema('liked', {idAttribute: 'id'});

//TODO: Implement location schema and store

//TODO: Check pull request https://github.com/gaearon/normalizr/pull/42 for recommendation of different types

//If we id by similarity/affinity/matching, there are 'same key' conflicts
function getRecommendationId(entity){
    if (entity.content){
        return entity.content.id;
    } else {
        return entity.id
    }
}

const recommendationSchema = new Schema('recommendation', {idAttribute: getRecommendationId});

threadsSchema.define({
    threads: arrayOf(threadSchema)
});

/**
 * Fetches an API response and normalizes the result JSON according to schema.
 */
function fetchAndNormalize(url, schema) {
    if (url.indexOf(API_ROOT) === -1) {
        url = API_ROOT + url;
    }

    return fetch(url).then(response =>
        response.json().then(json => {
            //const camelizedJson = camelizeKeys(json)
            //Can we extract nextLink from body here? Promise not resolved is the problem
            return {
                ...normalize(json, schema)
            };
        })
    );
}

function postData(url, data, schema) {
    if (url.indexOf(API_ROOT) === -1) {
        url = API_ROOT + url;
    }

    return new Bluebird((resolve, reject) => {
        request.post(
            {
                url : url,
                body: {data},
                json: true
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

function deleteData(url, data, schema) {
    if (url.indexOf(API_ROOT) === -1) {
        url = API_ROOT + url;
    }
    return new Bluebird((resolve, reject) => {
        request.del(
            {
                url : url,
                body: {data},
                json: true
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

export function fetchUser(url) {
    return fetchAndNormalize(url, userSchema);
}

export function fetchUserArray(url) {
    return fetchAndNormalize(url, arrayOf(userSchema));
}

export function fetchProfile(url) {
    return fetchAndNormalize(url, profileSchema);
}

export function fetchStats(url) {
    return fetchAndNormalize(url, statsSchema);
}

export function fetchThreads(url) {
    return fetchAndNormalize(url, threadsSchema);
}

export function fetchRecommendation(url) {
    return fetchAndNormalize(url, {
        items: arrayOf(recommendationSchema),
        pagination: {}
    });
}

export function postLikeUser(url) {
    return postData(url, null, likedUserSchema);
}

export function deleteLikeUser(url) {
    return deleteData(url, null, likedUserSchema);
}