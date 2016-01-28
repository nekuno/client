import { Schema, arrayOf, normalize } from 'normalizr';
import { camelizeKeys } from 'humps';
import selectn from 'selectn';
//import 'core-js/es6/promise';
import 'whatwg-fetch';
import Url from 'url';
import request from 'request';
import Bluebird from 'bluebird';
import { API_ROOT } from '../constants/Constants';
import LoginStore from '../stores/LoginStore';

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

const matchingSchema = new Schema('matching');

const similaritySchema = new Schema('similarity');

const metadataSchema = new Schema('metadata');

const threadSchema = new Schema('thread', {idAttribute: 'id'});

const threadsSchema = new Schema('threads');

const questionsAndAnswersSchema = new Schema('items', {idAttribute: getQuestionId});

const comparedQuestionsAndAnswersSchema = new Schema('items', {idAttribute: getUserId});

const questionsSchema = new Schema('questions', {idAttribute: 'questionId'});

const questionSchema = new Schema('question', {idAttribute: 'questionId'});

const userAnswersSchema = new Schema('userAnswers', {idAttribute: 'questionId'});

const blockedUserSchema = new Schema('blocked', {idAttribute: 'id'});

const likedUserSchema = new Schema('liked', {idAttribute: 'id'});

const likedContentSchema = new Schema('rate', {idAttribute: 'id'});

//TODO: Implement location schema and store

//TODO: Check pull request https://github.com/gaearon/normalizr/pull/42 for recommendation of different types

//If we id by similarity/affinity/matching, there are 'same key' conflicts
function getRecommendationId(entity) {
    if (entity.content) {
        return entity.content.id;
    } else {
        return entity.id
    }
}

function getQuestionId(entity) {
    return selectn('question.questionId', entity);
}

function getUserId(entity) {
    return parseInt(selectn('userId', entity));
}

const recommendationSchema = new Schema('recommendation', {idAttribute: getRecommendationId});

questionsAndAnswersSchema.define({
    questions: arrayOf(questionsSchema),
    userAnswers: arrayOf(userAnswersSchema)
});


/**
 * Fetches an API response and normalizes the result JSON according to schema.
 */
function fetchAndNormalize(url, schema) {

    if (url.indexOf(API_ROOT) === -1) {
        url = API_ROOT + url;
    }

    var jwt = LoginStore.jwt;
    var headers = jwt ? {'Authorization': 'Bearer ' + jwt} : {};

    nekunoApp.showProgressbar();

    return fetch(url, {headers: headers}).then(response =>
        response.json().then(json => {
            //const camelizedJson = camelizeKeys(json)
            //Can we extract nextLink from body here? Promise not resolved is the problem

            nekunoApp.hideProgressbar();

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

    var jwt = LoginStore.jwt;
    var headers = jwt ? {'Authorization': 'Bearer ' + jwt} : {};

    nekunoApp.showProgressbar();

    return new Bluebird((resolve, reject) => {
        request.post(
            {
                protocol: Url.parse(url).protocol,
                url     : url,
                body    : data,
                json    : true,
                headers : headers
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

function deleteData(url, data, schema) {

    if (url.indexOf(API_ROOT) === -1) {
        url = API_ROOT + url;
    }

    var jwt = LoginStore.jwt;
    var headers = jwt ? {'Authorization': 'Bearer ' + jwt} : {};

    nekunoApp.showProgressbar();

    return new Bluebird((resolve, reject) => {
        request.del(
            {
                protocol: Url.parse(url).protocol,
                url     : url,
                body    : data,
                json    : true,
                headers : headers
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

export function fetchUser(url) {
    return fetchAndNormalize(url, userSchema);
}

export function fetchUserArray(url) {
    return fetchAndNormalize(url, arrayOf(userSchema));
}

export function fetchProfile(url) {
    return fetchAndNormalize(url, profileSchema);
}

export function fetchMetadata(url) {
    return fetchAndNormalize(url, metadataSchema);
}

export function fetchStats(url) {
    return fetchAndNormalize(url, statsSchema);
}

export function fetchMatching(url) {
    if (url.indexOf(API_ROOT) === -1) {
        url = API_ROOT + url;
    }
    return fetch(url).then(response =>
        response.json().then(json => {
                return json;
            }
        )
    );
}

export function fetchSimilarity(url) {
    if (url.indexOf(API_ROOT) === -1) {
        url = API_ROOT + url;
    }
    return fetch(url).then(response =>
        response.json().then(json => {
                return json;
            }
        )
    );
}

export function fetchThreads(url) {
    return fetchAndNormalize(url, {
        items     : arrayOf(threadSchema),
        pagination: {}
    });
}

export function fetchRecommendation(url) {
    return fetchAndNormalize(url, {
        items     : arrayOf(recommendationSchema),
        pagination: {}
    });
}

export function fetchQuestions(url) {
    return fetchAndNormalize(url, {
        items     : arrayOf(questionsAndAnswersSchema),
        pagination: {}
    });
}

export function fetchComparedQuestions(url) {
    return fetchAndNormalize(url, {
        items     : arrayOf(comparedQuestionsAndAnswersSchema),
        pagination: {}
    });
}

export function postAnswer(url, userId, questionId, answerId, acceptedAnswers, rating) {
    return postData(url, {
        "userId": userId,
        "questionId": questionId,
        "answerId": answerId,
        "acceptedAnswers": acceptedAnswers,
        "rating": rating,
        "explanation": '',
        "isPrivate": false
    });
}

export function postSkipQuestion(url, userId) {
    return postData(url, {
        "userId": userId,
    });
}

export function fetchQuestion(url) {
    return fetchAndNormalize(url, questionSchema);
}

export function postBlockUser(url) {
    return postData(url, null, blockedUserSchema);
}

export function deleteBlockUser(url) {
    return deleteData(url, null, blockedUserSchema);
}

export function fetchBlockUser(url) {
    return fetchAndNormalize(url, blockedUserSchema);
}

export function postLikeUser(url) {
    return postData(url, null, likedUserSchema);
}

export function deleteLikeUser(url) {
    return deleteData(url, null, likedUserSchema);
}

export function fetchLikeUser(url) {
    return fetchAndNormalize(url, likedUserSchema);
}

export function postLikeContent(url, to) {
    return postData(url, {"linkId": to, "rate": "LIKES"}, likedContentSchema);
}

export function deleteLikeContent(url, to) {
    return postData(url, {"linkId": to, "rate": "DISLIKES"}, likedContentSchema);
}