import config from '../config/config';

export const API_ROOT = config.API_ROOT;
export const IMAGES_ROOT = config.IMAGES_ROOT;
export const LOGIN_URL = API_ROOT + 'login';
export const VALIDATE_INVITATION_TOKEN_URL = API_ROOT + 'invitations/token/validate/';
export const QUESTION_STATS_COLORS = [
    // purple
    '#2d205f',
    // deep purple
    '#6342b1',
    // light blue
    '#6abeee',
    // yellow
    '#adb32f',
    // flesh-colored
    '#d96484',
    // light green
    '#32ca91'
];
export const FACEBOOK_ID = config.FACEBOOK_ID;
export const FACEBOOK_SCOPE = config.FACEBOOK_SCOPE;