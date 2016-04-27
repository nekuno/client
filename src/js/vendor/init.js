import { FACEBOOK_ID, TWITTER_ID, GOOGLE_ID, SPOTIFY_ID, INSTANT_HOST } from '../constants/Constants';
import selectn from 'selectn';

let helloOAuthCallback = '/oauthcallback.html';

if (window.cordova) {
    helloOAuthCallback = 'http://m.nekuno.com/oauthcallback.html';
}

hello.init({

    spotify: {
        name: 'spotify',

        oauth: {
            version: '2.0',
            auth   : 'https://accounts.spotify.com/authorize',
            grant  : 'https://accounts.spotify.com/api/token'
        },

        base       : 'https://api.spotify.com/v1/',
        scope_delim: ' ',
        scope      : {
            email        : 'email',
            playlists    : 'playlist-read-private',
            subscriptions: 'user-read-private'
        },

        get: {
            me: 'me'
        },

        wrap: {
            me: function(o) {
                o.picture = selectn('images[0].url', o);
                return o;
            }
        }

    }
});

hello.init(
    {
        google  : GOOGLE_ID,
        spotify : SPOTIFY_ID,
        facebook: FACEBOOK_ID,
        twitter : TWITTER_ID
    },
    {
        redirect_uri: helloOAuthCallback,
        popup       : {
            location: 'no'
        },
        oauth_proxy : INSTANT_HOST + 'oauthproxy'
    }
);

let api = hello.init();

let facebookWrap = api.facebook.wrap.me;
api.facebook.wrap.me = function(o) {
    let res = facebookWrap(o);
    res.picture = res.picture + '?height=480';
    return res;
};

let twitterWrap = api.twitter.wrap.me;
api.twitter.wrap.me = function(o) {
    let res = twitterWrap(o);
    res.picture = res.thumbnail.replace('_normal', '');
    return res;
};

let googleWrap = api.google.wrap.me;
api.google.wrap.me = function(o) {
    let res = googleWrap(o);
    res.picture = res.picture.replace('sz=50', 'sz=480');
    return res;
};