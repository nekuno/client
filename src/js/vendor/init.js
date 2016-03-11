import { FACEBOOK_ID, TWITTER_ID, GOOGLE_ID, GOOGLE_SCOPE } from '../constants/Constants';

openFB.init({
    appId: FACEBOOK_ID
});

hello.init({
        google: GOOGLE_ID
    },
    {
        scope       : GOOGLE_SCOPE,
        redirect_uri: '/oauthcallback.html',
        popup       : {
            location: 'no'
        }
    });