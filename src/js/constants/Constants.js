import config from '../config/config';

export const API_ROOT = config.API_ROOT;
export const IMAGES_ROOT = config.IMAGES_ROOT;
export const API_URLS = {
    LOGIN                    : API_ROOT + 'login',
    VALIDATE_INVITATION_TOKEN: API_ROOT + 'invitations/token/validate/',
    VALIDATE_USERNAME        : API_ROOT + 'users/available/',
    VALIDATE_USER            : API_ROOT + 'users/validate',
    VALIDATE_PROFILE         : API_ROOT + 'profile/validate',
    REGISTER_USER            : API_ROOT + 'users',
    REGISTER_PROFILE         : API_ROOT + 'profile',
    CONSUME_INVITATION       : API_ROOT + 'invitations/consume/{token}',
    CONNECT_ACCOUNT          : API_ROOT + 'tokens/{resource}?extend',

    OWN_INTERESTS            : API_ROOT + 'content?type={type}',
    COMPARED_INTERESTS       : API_ROOT + 'content/compare/{userId}?type={type}&showOnlyCommon={showOnlyCommon}'
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
export const FACEBOOK_ID = config.FACEBOOK_ID;
export const FACEBOOK_SCOPE = config.FACEBOOK_SCOPE;
export const LAST_RELEASE_DATE = config.LAST_RELEASE_DATE;
export const INSTANT_HOST = config.INSTANT_HOST;
