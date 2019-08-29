import config from '../config/config';

export const VERSION = require('../../../package.json').version;
export const API_ROOT = config.API_ROOT;
export const IMAGINE_ROOT = config.IMAGINE_ROOT;
export const INVITATIONS_URL = config.INVITATIONS_ROOT + '{token}';
export const SHARED_USER_URL = config.SHARED_USER_ROOT + '{slug}';
export const FIREBASE_SCRIPT = config.FIREBASE_SCRIPT;
export const FCM_API_KEY = config.FCM_API_KEY;
export const FCM_AUTH_DOMAIN = config.FCM_AUTH_DOMAIN;
export const FCM_PROJECT_ID = config.FCM_PROJECT_ID;
export const FCM_SENDER_ID = config.FCM_SENDER_ID;
export const PUSH_PUBLIC_KEY = config.PUSH_PUBLIC_KEY;
export const API_URLS = {
    LOGIN                    : API_ROOT + 'login',
    VALIDATE_INVITATION_TOKEN: API_ROOT + 'invitations/token/validate/',
    VALIDATE_USERNAME        : API_ROOT + 'users/available/',
    VALIDATE_USER            : API_ROOT + 'users/validate',
    VALIDATE_PROFILE         : API_ROOT + 'profile/validate',
    REGISTER                 : API_ROOT + 'register',
    CONSUME_INVITATION       : API_ROOT + 'invitations/consume/{token}',
    INVITATIONS              : API_ROOT + 'invitations',
    REQUEST_GROUP            : API_ROOT + 'groups/{groupId}',
    JOIN_GROUP               : API_ROOT + 'groups/{groupId}/members',
    LEAVE_GROUP              : API_ROOT + 'groups/{groupId}/members',
    CREATE_GROUP             : API_ROOT + 'groups',
    REQUEST_GROUP_MEMBERS    : API_ROOT + 'groups/{groupId}/members',
    REQUEST_GROUP_CONTENTS   : API_ROOT + 'groups/{groupId}/contents',
    CONNECT_ACCOUNT          : API_ROOT + 'tokens/{resource}?extend',
    USER_DATA_STATUS         : API_ROOT + 'data/status',
    CONTENT_TAG_SUGGESTIONS  : API_ROOT + 'recommendations/content/tags?search={search}&limit=4',
    PROFILE_TAG_SUGGESTIONS  : API_ROOT + 'profile/tags/{type}?search={search}&limit=4',
    GALLERY_PHOTOS           : API_ROOT + 'photos',
    GALLERY_PHOTO            : API_ROOT + 'photos/{id}',
    GALLERY_PHOTO_PROFILE    : API_ROOT + 'photos/{id}/profile',
    OTHER_GALLERY_PHOTOS     : API_ROOT + 'photos/{id}',
    CHECK_IMAGES             : API_ROOT + 'links/images',
    NOTIFICATIONS_SUBSCRIBE  : API_ROOT + 'notifications/subscribe',
    NOTIFICATIONS_UNSUBSCRIBE: API_ROOT + 'notifications/unsubscribe',
    CONNECTION_STATUS        : API_ROOT + 'client/status',

    //Pagination urls
    ANSWERS           : API_ROOT + 'answers',
    COMPARED_ANSWERS  : API_ROOT + 'answers/compare/{otherUserId}',
    OWN_INTERESTS     : API_ROOT + 'content?type[]={type}',
    COMPARED_INTERESTS: API_ROOT + 'content/compare/{userId}?type[]={type}&showOnlyCommon={showOnlyCommon}',
    RECOMMENDATIONS   : API_ROOT + 'threads/{threadId}/recommendation',
    OWN_PROPOSALS_LIKED: API_ROOT + 'proposals/liked',
    OWN_LIKED_USERS   : API_ROOT + 'users/liked',
};

export const THREAD_TYPES = {
    THREAD_CONTENTS: 'THREAD_CONTENTS',
    THREAD_USERS   : 'THREAD_USERS'
};

export const QUESTION_STATS_COLORS = [
    // light green
    '#32ca91',
    // purple
    '#2d205f',
    // deep purple
    '#6342b1',
    // light blue
    '#6abeee',
    // yellow
    '#adb32f',
    // flesh-colored
    '#d96484'
];

export const SOCIAL_NETWORKS_NAMES = {
    FACEBOOK : 'facebook',
    TWITTER  : 'twitter',
    GOOGLE   : 'google',
    SPOTIFY  : 'spotify',
    INSTAGRAM: 'instagram',
    TUMBLR   : 'tumblr',
    LINKEDIN : 'linkedin',
    STEAM    : 'steam'
};

export const SOCIAL_NETWORKS = [
    {
        resourceOwner: SOCIAL_NETWORKS_NAMES.FACEBOOK,
        id           : config.FACEBOOK_ID,
        scope        : config.FACEBOOK_SCOPE
    },
    {
        resourceOwner: SOCIAL_NETWORKS_NAMES.TWITTER,
        id           : config.TWITTER_ID,
        scope        : config.TWITTER_SCOPE
    },
    {
        resourceOwner: SOCIAL_NETWORKS_NAMES.GOOGLE,
        id           : config.GOOGLE_ID,
        scope        : config.GOOGLE_SCOPE
    },
    {
        resourceOwner: SOCIAL_NETWORKS_NAMES.SPOTIFY,
        id           : config.SPOTIFY_ID,
        scope        : config.SPOTIFY_SCOPE
    },
    {
        resourceOwner: SOCIAL_NETWORKS_NAMES.TUMBLR,
        id           : config.TUMBLR_ID,
        scope        : config.TUMBLR_SCOPE
    },
    {
        resourceOwner: SOCIAL_NETWORKS_NAMES.STEAM,
    }
];

export const FACEBOOK_ID = config.FACEBOOK_ID;
export const FACEBOOK_SCOPE = config.FACEBOOK_SCOPE;
export const FACEBOOK_PHOTOS_SCOPE = config.FACEBOOK_PHOTOS_SCOPE;

export const TWITTER_ID = config.TWITTER_ID;
export const TWITTER_SCOPE = config.TWITTER_SCOPE;

export const GOOGLE_ID = config.GOOGLE_ID;
export const GOOGLE_SCOPE = config.GOOGLE_SCOPE;
export const GOOGLE_PHOTOS_SCOPE = config.GOOGLE_PHOTOS_SCOPE;

export const SPOTIFY_ID = config.SPOTIFY_ID;
export const SPOTIFY_SCOPE = config.SPOTIFY_SCOPE;

export const TUMBLR_ID = config.TUMBLR_ID;
export const TUMBLR_SCOPE = config.TUMBLR_SCOPE;

export const INSTAGRAM_ID = config.INSTAGRAM_ID;
export const INSTAGRAM_SCOPE = config.INSTAGRAM_SCOPE;

export const LINKEDIN_ID = config.LINKEDIN_ID;
export const LINKEDIN_SCOPE = config.LINKEDIN_SCOPE;

export const TRACKER_ID_WEB = config.TRACKER_ID_WEB;
export const TRACKER_ID_APP = config.TRACKER_ID_APP;
export const INSTANT_HOST = config.INSTANT_HOST;

export const GOOGLE_MAPS_API_KEY = config.GOOGLE_MAPS_API_KEY;
export const GOOGLE_RECAPTCHA_API_KEY = config.GOOGLE_RECAPTCHA_API_KEY;
export const GOOGLE_MAPS_URL = 'https://maps.googleapis.com/maps/api/js?libraries=places&key=%API_KEY%&callback=onMapsApiLoaded'.replace('%API_KEY%', GOOGLE_MAPS_API_KEY);
export const GOOGLE_KNOWLEDGE_GRAPH_URL = 'https://kgsearch.googleapis.com/v1/entities:search?key=%API_KEY%'.replace('%API_KEY%', GOOGLE_MAPS_API_KEY);
export const GOOGLE_RECAPTCHA_URL = 'https://www.google.com/recaptcha/api.js';

export const REQUIRED_REGISTER_USER_FIELDS = [
    {
        name: 'email'
    }
];

export const REQUIRED_REGISTER_PROFILE_FIELDS = [
    {
        name: 'birthday',
        type: 'birthday'
    },
    {
        name: 'gender',
        type: 'choice'
    },
    {
        name: 'location',
        type: 'location'
    },
    {
        name: 'objective',
        type: 'multiple_choices'
    }
];

export const ORIGIN_CONTEXT = {
    RECOMMENDATIONS_PAGE: 'recommendationsPage',
    OTHER_INTERESTS_PAGE: 'otherInterestsPage',
    OWN_INTERESTS_PAGE  : 'ownInterestsPage',
    OTHER_USER_PAGE     : 'otherUserPage',
};

export const MAX_MESSAGES_LENGTH = 3000;

export const DO_NOT_BACK_ROUTES = [
    '/',
    'social-networks-on-sign-up',
    '/social-networks-on-sign-up',
    'register-questions-landing',
    '/register-questions-landing',
    'answer-username',
    '/answer-username'
];