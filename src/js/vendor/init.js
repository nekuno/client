import { FACEBOOK_ID, TWITTER_ID, GOOGLE_ID, GOOGLE_SCOPE, SPOTIFY_ID, SPOTIFY_SCOPE } from '../constants/Constants';

openFB.init({
    appId: FACEBOOK_ID
});

let helloOAuthCallback = '/oauthcallback.html';

if (document.URL.indexOf('http://') === -1 && document.URL.indexOf('https://') === -1) {
    helloOAuthCallback = 'http://m.nekuno.com/oauthcallback.html';
}

hello.init({
        google: GOOGLE_ID
    },
    {
        scope: GOOGLE_SCOPE,
        redirect_uri: helloOAuthCallback,
        popup: {
            location: 'no'
        }
    });

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

hello.init({
        spotify: SPOTIFY_ID
    },
    {
        redirect_uri: helloOAuthCallback,
        scope: SPOTIFY_SCOPE,
        popup: {
            location: 'no'
        }
    });

