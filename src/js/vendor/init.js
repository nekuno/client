import { FACEBOOK_ID, TWITTER_ID, GOOGLE_ID, SPOTIFY_ID } from '../constants/Constants';

let helloOAuthCallback = '/oauthcallback.html';

if (window.cordova) {
    helloOAuthCallback = 'http://m.nekuno.com/oauthcallback.html';
}

hello.init({

    spotify: {
        name: 'spotify',

        oauth: {
            version: '2.0',
            auth: 'https://accounts.spotify.com/authorize',
            grant: 'https://accounts.spotify.com/api/token'
        },

        base: 'https://api.spotify.com/v1/',
        scope_delim: ' ',
        scope: {
            email: 'email',
            playlists: 'playlist-read-private',
            subscriptions: 'user-read-private'
        },

        get: {
            me: 'me'
        }

    }
});

hello.init(
    {
        google: GOOGLE_ID,
        spotify: SPOTIFY_ID,
        facebook: FACEBOOK_ID
    },
    {
        redirect_uri: helloOAuthCallback,
        popup: {
            location: 'no'
        }
    }
);