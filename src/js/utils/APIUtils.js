import { Schema, arrayOf, normalize } from 'normalizr';
import selectn from 'selectn';
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

const userSchema = new Schema('users', {idAttribute: 'qnoow_id'});
const profileSchema = new Schema('profiles');
const statsSchema = new Schema('stats');
const comparedStatsSchema = new Schema('comparedStats');
const threadSchema = new Schema('thread', {idAttribute: 'id'});
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
const likedUserSchema = new Schema('liked', {idAttribute: 'id'});
const likedContentSchema = new Schema('rate', {idAttribute: 'id'});
const recommendationSchema = new Schema('recommendation', {
    idAttribute: entity => {
        if (entity.content) {
            return entity.content.id;
        } else {
            return entity.id
        }
    }
});

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
            nekunoApp.hideProgressbar();
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

export function getVersion() {
    return getData('client/version');
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

export function putProfile(url, data) {
    return putData(url, data);
}

export function fetchMetadata(url) {
    return getData(url);
}

export function fetchStats(url) {
    return fetchAndNormalize(url, statsSchema);
}

export function fetchComparedStats(url) {
    return fetchAndNormalize(url, comparedStatsSchema);
}

export function fetchThreads(url) {
    return fetchAndNormalize(url, {
        items     : arrayOf(threadSchema),
        pagination: {}
    });
}

export function postThread(url, data) {
    return postData(url, data);
}

export function putThread(url, data) {
    return putData(url, data);
}

export function deleteThread(url) {
    return deleteData(url);
}

export function fetchRecommendation(url) {
    return fetchAndNormalize(url, {
        items     : arrayOf(recommendationSchema),
        pagination: {}
    });
}

export function fetchAnswers(url) {
    return fetchAndNormalize(url, {
        items     : arrayOf(questionsAndAnswersSchema),
        pagination: {}
    });
}

export function fetchComparedAnswers(url) {
    return fetchAndNormalize(url, {
        items     : arrayOf(comparedQuestionsAndAnswersSchema),
        pagination: {}
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

export function fetchOwnInterests(url) {
    return fetchAndNormalize(url, {
        items     : [],
        pagination: {}
    });
}

export function fetchComparedInterests(url) {
    return fetchAndNormalize(url, {
        items     : [],
        pagination: {}
    });
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
    return postData(url, {linkId: to, rate: "LIKES"}, likedContentSchema);
}

export function deleteLikeContent(url, to) {
    return postData(url, {linkId: to, rate: "DISLIKES"}, likedContentSchema);
}