import { FACEBOOK_ID, TWITTER_ID, GOOGLE_ID, SPOTIFY_ID, INSTAGRAM_ID, TUMBLR_ID, INSTANT_HOST } from '../constants/Constants';
import moment from 'moment';
import LocaleStore from '../stores/LocaleStore';
import 'moment/locale/es';
import hello from 'hellojs';
window.hello = hello;
require('./hellojs-modules/spotify');
require('./hellojs-modules/tumblr');

//Moment JS //

const locale = LocaleStore.locale;
moment.locale(locale);

//Hello JS//

let helloOAuthCallback = '/oauthcallback.html';

if (window.cordova) {
    helloOAuthCallback = 'http://m.nekuno.com/oauthcallback.html';
}

hello.init(
    {
        google  : GOOGLE_ID,
        spotify : SPOTIFY_ID,
        facebook: FACEBOOK_ID,
        twitter : TWITTER_ID,
    },
    {
        redirect_uri: helloOAuthCallback,
        popup       : {
            location: 'no'
        },
        oauth_proxy : INSTANT_HOST + 'oauthproxy',
        response_type: 'code'
    }
);

hello.init(
    {
        instagram: INSTAGRAM_ID,
        tumblr: TUMBLR_ID,
    },
    {
        redirect_uri: helloOAuthCallback,
        popup       : {
            location: 'no'
        },
        oauth_proxy : INSTANT_HOST + 'oauthproxy',
        response_type: 'token'
    }
);

let api = hello.init();

let facebookWrap = api.facebook.wrap.me;
api.facebook.wrap.me = function(o) {
    let res = facebookWrap(o);
    res.picture = res.picture + '?height=480';
    res.birthday = moment(res.birthday).format('YYYY-MM-DD');
    res.location = res.location ? res.location.name : null;
    return res;
};
api.facebook.get.me = api.facebook.get.me + ',location,birthday,gender';
api.facebook.get['me/album'] = api.facebook.get['me/album'] + ',images';

let twitterWrap = api.twitter.wrap.me;
api.twitter.wrap.me = function(o) {
    let res = twitterWrap(o);
    res.picture = res.thumbnail ? res.thumbnail.replace('_normal', '') : null;
    res.username = res.screen_name;
    return res;
};

let googleWrap = api.google.wrap.me;
api.google.wrap.me = function(o) {
    let res = googleWrap(o);
    res.picture = res.picture.replace('sz=50', 'sz=480');
    return res;
};