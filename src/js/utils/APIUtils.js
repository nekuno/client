import { Schema, arrayOf, normalize } from 'normalizr';
import selectn from 'selectn';
import OfflineService from '../services/OfflineService';
import Url from 'url';
import request from 'request';
import Bluebird from 'bluebird';
Bluebird.config({
    cancellation: true
});
import { API_ROOT } from '../constants/Constants';
import LoginActionCreators from '../actions/LoginActionCreators';
import LoginStore from '../stores/LoginStore';
import LocaleStore from '../stores/LocaleStore';

// We use this Normalizr schemas to transform API responses from a nested form
// to a flat form where repos and users are placed in `entities`, and nested
// JSON objects are replaced with their IDs. This is very convenient for
// consumption by Stores, because each Store can just grab entities of its kind.

// Read more about Normalizr: https://github.com/gaearon/normalizr

const userSchema = new Schema('users', {idAttribute: 'id'});
const questionsSchema = new Schema('questions', {idAttribute: 'questionId'});
const questionSchema = new Schema('question', {idAttribute: 'questionId'});
const userAnswersSchema = new Schema('userAnswers', {idAttribute: 'questionId'});
const questionsAndAnswersSchema = new Schema('items', {
    idAttribute: entity=> {
        return selectn('question.questionId', entity);
    }
});
questionsAndAnswersSchema.define({
    questions  : arrayOf(questionsSchema),
    userAnswers: arrayOf(userAnswersSchema)
});
const comparedQuestionsAndAnswersSchema = new Schema('items', {
    idAttribute: entity=> {
        return parseInt(selectn('userId', entity));
    }
});
const blockedUserSchema = new Schema('blocked', {idAttribute: 'id'});

//TODO: Implement location schema and store
//TODO: Check pull request https://github.com/gaearon/normalizr/pull/42 for recommendation of different types

var _jwt = null;

export function setJwt(value) {
    _jwt = value;
}

/**
 * Fetches an API response and normalizes the result JSON according to schema.
 */
export function fetchAndNormalize(url, schema) {

    return getData(url).then(function(json) {
        return {
            ...normalize(json, schema)
        };
    });
}

export function doRequest(method, url, data = null) {

    if (url.indexOf(API_ROOT) === -1) {
        url = API_ROOT + url;
    }

    var jwt = LoginStore.jwt ? LoginStore.jwt : _jwt;
    var headers = jwt ? {'Authorization': 'Bearer ' + jwt} : {};
    var locale = LocaleStore.locale;

    nekunoApp.showProgressbar();

    return new Bluebird((resolve, reject, onCancel) => {

        OfflineService.check().then(() => {
            if (LoginStore.isGuest() && ['PUT', 'POST', 'DELETE'].indexOf(method) > -1) {
                nekunoApp.hideProgressbar();
                let message = locale == 'en' ? 'This feature is available only to registered users. Improve your experience now!'
                    : 'Esta función sólo está disponible para usuarios registrados. Mejora tu experiencia ahora!';
                nekunoApp.confirm(message, () => {
                    LoginActionCreators.logoutUser('/register');
                });
                return reject(message);
            }

            var promise = request(
                {
                    method  : method,
                    protocol: Url.parse(url).protocol,
                    url     : url,
                    qs      : {locale},
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

            onCancel(() => {
                promise.abort();
            });
        }, (status) => {
            return reject(status);
        });
    });
}

export function getData(url) {
    return doRequest('GET', url);
}

export function postData(url, data) {
    return doRequest('POST', url, data);
}

export function putData(url, data) {
    return doRequest('PUT', url, data);
}

export function deleteData(url, data) {
    return doRequest('DELETE', url, data);
}

export function fetchUser(url) {
    return fetchAndNormalize(url, userSchema);
}

export function fetchAnswers(url) {
    return fetchAndNormalize(url, {
        items     : arrayOf(questionsAndAnswersSchema),
        pagination: {}
    });
}

export function fetchComparedAnswers(url) {
    return getData(url).then(function(json) {
        return json;
    });
}

export function postAnswer(url, questionId, answerId, acceptedAnswers, rating) {
    return postData(url, {
        questionId     : questionId,
        answerId       : answerId,
        acceptedAnswers: acceptedAnswers,
        rating         : rating,
        explanation    : '',
        isPrivate      : false
    });
}

export function postSkipQuestion(url) {
    return postData(url);
}

export function fetchQuestion(url) {
    return fetchAndNormalize(url, questionSchema);
}

export function fetchUserDataStatus(url) {
    return getData(url).then(function(json) {
        return json;
    });
}

export function postBlockUser(url) {
    return postData(url, null, blockedUserSchema);
}

export function deleteBlockUser(url) {
    return deleteData(url, null, blockedUserSchema);
}

export function postLikeContent(url, to, originContext, originName) {
    return postData(url, {linkId: to, rate: "LIKES", originContext: originContext, originName: originName});
}

export function postDislikeContent(url, to, originContext, originName) {
    return postData(url, {linkId: to, rate: "DISLIKES", originContext: originContext, originName: originName});
}

export function postIgnoreContent(url, to, originContext, originName) {
    return postData(url, {linkId: to, rate: "IGNORES", originContext: originContext, originName: originName});
}

export function deleteRateContent(url, to) {
    return postData(url, {linkId: to, rate: "UNRATES"});
}
