import config from '../config/config';

export const API_ROOT = config.API_ROOT;
export const INVITATIONS_URL = config.INVITATIONS_ROOT + '{token}';
export const API_URLS = {
    LOGIN                    : API_ROOT + 'login',
    VALIDATE_INVITATION_TOKEN: API_ROOT + 'invitations/token/validate/',
    VALIDATE_USERNAME        : API_ROOT + 'users/available/',
    VALIDATE_USER            : API_ROOT + 'users/validate',
    VALIDATE_PROFILE         : API_ROOT + 'profile/validate',
    REGISTER_USER            : API_ROOT + 'users',
    REGISTER_PROFILE         : API_ROOT + 'profile',
    CONSUME_INVITATION       : API_ROOT + 'invitations/consume/{token}',
    INVITATIONS              : API_ROOT + 'invitations',
    JOIN_GROUP               : API_ROOT + 'groups/{groupId}/members',
    EXIT_GROUP               : API_ROOT + 'groups/{groupId]/members',
    CREATE_GROUP             : API_ROOT + 'groups',
    CONNECT_ACCOUNT          : API_ROOT + 'tokens/{resource}?extend',
    CREATE_DEFAULT_THREADS   : API_ROOT + 'threads/default',
    USER_DATA_STATUS         : API_ROOT + 'data/status',
    CONTENT_TAG_SUGGESTIONS  : API_ROOT + 'recommendations/content/tags?search={search}&limit=4',
    PROFILE_TAG_SUGGESTIONS  : API_ROOT + 'profile/tags/{type}?search={search}&limit=4',
    GALLERY_PHOTOS           : API_ROOT + 'photos',
    GALLERY_PHOTO            : API_ROOT + 'photos/{id}',
    GALLERY_PHOTO_PROFILE    : API_ROOT + 'photos/{id}/profile',
    OTHER_GALLERY_PHOTOS     : API_ROOT + 'photos/{id}',

    OWN_INTERESTS            : API_ROOT + 'content?type[]={type}',
    COMPARED_INTERESTS       : API_ROOT + 'content/compare/{userId}?type[]={type}&showOnlyCommon={showOnlyCommon}'
};

export const THREAD_TYPES = {
    THREAD_CONTENTS: 'THREAD_CONTENTS',
    THREAD_USERS   : 'THREAD_USERS',
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
    FACEBOOK: 'facebook',
    TWITTER: 'twitter',
    GOOGLE: 'google',
    SPOTIFY: 'spotify'
};

export const SOCIAL_NETWORKS = [
    {
        resourceOwner: SOCIAL_NETWORKS_NAMES.FACEBOOK,
        id: config.FACEBOOK_ID,
        scope: config.FACEBOOK_SCOPE
    },
    {
        resourceOwner: SOCIAL_NETWORKS_NAMES.TWITTER,
        id: config.TWITTER_ID,
        scope: config.TWITTER_SCOPE
    },
    {
        resourceOwner: SOCIAL_NETWORKS_NAMES.GOOGLE,
        id: config.GOOGLE_ID,
        scope: config.GOOGLE_SCOPE
    },
    {
        resourceOwner: SOCIAL_NETWORKS_NAMES.SPOTIFY,
        id: config.SPOTIFY_ID,
        scope: config.SPOTIFY_SCOPE
    }
];

export const FACEBOOK_ID = config.FACEBOOK_ID;
export const FACEBOOK_SCOPE = config.FACEBOOK_SCOPE;

export const TWITTER_ID = config.TWITTER_ID;
export const TWITTER_SCOPE = config.TWITTER_SCOPE;

export const GOOGLE_ID = config.GOOGLE_ID;
export const GOOGLE_SCOPE = config.GOOGLE_SCOPE;

export const SPOTIFY_ID = config.SPOTIFY_ID;
export const SPOTIFY_SCOPE = config.SPOTIFY_SCOPE;

export const LAST_RELEASE_DATE = config.LAST_RELEASE_DATE;
export const INSTANT_HOST = config.INSTANT_HOST;

export const REQUIRED_REGISTER_USER_FIELDS = [
    {
        name    : 'username'
    },
    {
        name    : 'email'
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
    }
];