import keyMirror from 'keymirror';

export default keyMirror({

    LEFT_PANEL_OPEN                         : null,
    LEFT_PANEL_CLOSE                        : null,

    AUTO_LOGIN                              : null,
    REQUEST_LOGIN_USER                      : null,
    REQUEST_LOGIN_USER_SUCCESS              : null,
    REQUEST_LOGIN_USER_ERROR                : null,
    REQUEST_AUTOLOGIN                       : null,
    REQUEST_AUTOLOGIN_SUCCESS               : null,
    REQUEST_AUTOLOGIN_ERROR                 : null,
    PRE_REGISTER_USER                       : null,
    PRE_REGISTER_PROFILE                    : null,
    REQUEST_VALIDATE_INVITATION_USER        : null,
    REQUEST_VALIDATE_INVITATION_USER_SUCCESS: null,
    REQUEST_VALIDATE_INVITATION_USER_ERROR  : null,
    REQUEST_VALIDATE_USERNAME               : null,
    REQUEST_VALIDATE_USERNAME_SUCCESS       : null,
    REQUEST_VALIDATE_USERNAME_ERROR         : null,
    REQUEST_REGISTER_USER                   : null,
    REQUEST_REGISTER_USER_SUCCESS           : null,
    REQUEST_REGISTER_USER_ERROR             : null,
    EDIT_USER                               : null,
    EDIT_USER_SUCCESS                       : null,
    EDIT_USER_ERROR                         : null,
    SET_ENABLED                             : null,
    SET_ENABLED_SUCCESS                     : null,
    SET_ENABLED_ERROR                       : null,
    LOGOUT_USER                             : null,

    NEXT_ROUTE    : null,
    REPLACE_ROUTE : null,
    PREVIOUS_ROUTE: null,

    CONNECT_ACCOUNT             : null,
    CONNECT_ACCOUNT_SUCCESS     : null,
    CONNECT_ACCOUNT_ERROR       : null,
    CONNECT_ACCOUNT_REMOVE_ERROR: null,

    REQUEST_USER        : null,
    REQUEST_USER_SUCCESS: null,
    REQUEST_USER_ERROR  : null,

    REQUEST_PUBLIC_USER        : null,
    REQUEST_PUBLIC_USER_SUCCESS: null,
    REQUEST_PUBLIC_USER_ERROR  : null,

    REQUEST_OWN_USER        : null,
    REQUEST_OWN_USER_SUCCESS: null,
    REQUEST_OWN_USER_ERROR  : null,

    REQUEST_PROFILE        : null,
    REQUEST_PROFILE_SUCCESS: null,
    REQUEST_PROFILE_ERROR  : null,

    REQUEST_OWN_PROFILE        : null,
    REQUEST_OWN_PROFILE_SUCCESS: null,
    REQUEST_OWN_PROFILE_ERROR  : null,

    EDIT_PROFILE        : null,
    EDIT_PROFILE_SUCCESS: null,
    EDIT_PROFILE_ERROR  : null,

    REQUEST_METADATA        : null,
    REQUEST_METADATA_SUCCESS: null,
    REQUEST_METADATA_ERROR  : null,

    REQUEST_CATEGORIES        : null,
    REQUEST_CATEGORIES_SUCCESS: null,
    REQUEST_CATEGORIES_ERROR  : null,

    REQUEST_STATS        : null,
    REQUEST_STATS_SUCCESS: null,
    REQUEST_STATS_ERROR  : null,

    REQUEST_COMPARED_STATS        : null,
    REQUEST_COMPARED_STATS_SUCCESS: null,
    REQUEST_COMPARED_STATS_ERROR  : null,

    REQUEST_MATCHING        : null,
    REQUEST_MATCHING_SUCCESS: null,
    REQUEST_MATCHING_ERROR  : null,

    REQUEST_SIMILARITY        : null,
    REQUEST_SIMILARITY_SUCCESS: null,
    REQUEST_SIMILARITY_ERROR  : null,

    REQUEST_FILTERS        : null,
    REQUEST_FILTERS_SUCCESS: null,
    REQUEST_FILTERS_ERROR  : null,

    REQUEST_THREADS        : null,
    REQUEST_THREADS_SUCCESS: null,
    REQUEST_THREADS_ERROR  : null,

    CREATE_THREAD        : null,
    CREATE_THREAD_SUCCESS: null,
    CREATE_THREAD_ERROR  : null,

    UPDATE_THREAD        : null,
    UPDATE_THREAD_SUCCESS: null,
    UPDATE_THREAD_ERROR  : null,

    DELETE_THREAD        : null,
    DELETE_THREAD_SUCCESS: null,
    DELETE_THREAD_ERROR  : null,

    THREADS_PREV: null,
    THREADS_NEXT: null,

    REQUEST_RECOMMENDATIONS        : null,
    REQUEST_RECOMMENDATIONS_SUCCESS: null,
    REQUEST_RECOMMENDATIONS_ERROR  : null,

    REQUEST_NEXT_RECOMMENDATIONS        : null,
    REQUEST_NEXT_RECOMMENDATIONS_SUCCESS: null,
    REQUESTS_NEXT_RECOMMENDATION_ERROR  : null,

    ADD_PREV_RECOMMENDATIONS: null,

    SAVE_RECOMMENDATIONS_INDEX: null,

    REQUEST_QUESTIONS        : null,
    REQUEST_QUESTIONS_SUCCESS: null,
    REQUEST_QUESTIONS_ERROR  : null,

    REQUEST_COMPARED_QUESTIONS        : null,
    REQUEST_COMPARED_QUESTIONS_SUCCESS: null,
    REQUEST_COMPARED_QUESTIONS_ERROR  : null,

    REQUEST_QUESTION         : null,
    REQUEST_EXISTING_QUESTION: null,
    REQUEST_QUESTION_SUCCESS : null,
    REQUEST_QUESTION_ERROR   : null,

    REMOVE_PREVIOUS_QUESTION : null,
    QUESTIONS_POPUP_DISPLAYED: null,
    SET_QUESTION_EDITABLE    : null,

    ANSWER_QUESTION        : null,
    ANSWER_QUESTION_SUCCESS: null,
    ANSWER_QUESTION_ERROR  : null,

    SKIP_QUESTION        : null,
    SKIP_QUESTION_SUCCESS: null,
    SKIP_QUESTION_ERROR  : null,

    REQUEST_OWN_INTERESTS        : null,
    REQUEST_OWN_INTERESTS_SUCCESS: null,
    REQUEST_OWN_INTERESTS_ERROR  : null,

    RESET_INTERESTS            : null,
    SET_CONTENTS_TYPE          : null,
    REMOVE_CONTENTS_TYPE       : null,
    SET_CONTENTS_SHOWONLYCOMMON: null,

    REQUEST_COMPARED_INTERESTS        : null,
    REQUEST_COMPARED_INTERESTS_SUCCESS: null,
    REQUEST_COMPARED_INTERESTS_ERROR  : null,

    CHECK_IMAGES        : null,
    CHECK_IMAGES_SUCCESS: null,
    CHECK_IMAGES_ERROR  : null,

    REQUEST_INVITATIONS        : null,
    REQUEST_INVITATIONS_SUCCESS: null,
    REQUEST_INVITATIONS_ERROR  : null,

    LIKE_USER        : null,
    LIKE_USER_SUCCESS: null,
    LIKE_USER_ERROR  : null,

    UNLIKE_USER        : null,
    UNLIKE_USER_SUCCESS: null,
    UNLIKE_USER_ERROR  : null,

    DISLIKE_USER        : null,
    DISLIKE_USER_SUCCESS: null,
    DISLIKE_USER_ERROR  : null,

    IGNORE_USER        : null,
    IGNORE_USER_SUCCESS: null,
    IGNORE_USER_ERROR  : null,

    REQUEST_LIKE_USER        : null,
    REQUEST_LIKE_USER_SUCCESS: null,
    REQUEST_LIKE_USER_ERROR  : null,

    BLOCK_USER        : null,
    BLOCK_USER_SUCCESS: null,
    BLOCK_USER_ERROR  : null,

    UNBLOCK_USER        : null,
    UNBLOCK_USER_SUCCESS: null,
    UNBLOCK_USER_ERROR  : null,

    REQUEST_BLOCK_USER        : null,
    REQUEST_BLOCK_USER_SUCCESS: null,
    REQUEST_BLOCK_USER_ERROR  : null,

    REPORT_USER        : null,
    REPORT_USER_SUCCESS: null,
    REPORT_USER_ERROR  : null,

    LIKE_CONTENT        : null,
    LIKE_CONTENT_SUCCESS: null,
    LIKE_CONTENT_ERROR  : null,

    DISLIKE_CONTENT        : null,
    DISLIKE_CONTENT_SUCCESS: null,
    DISLIKE_CONTENT_ERROR  : null,

    IGNORE_CONTENT        : null,
    IGNORE_CONTENT_SUCCESS: null,
    IGNORE_CONTENT_ERROR  : null,

    UNRATE_CONTENT        : null,
    UNRATE_CONTENT_SUCCESS: null,
    UNRATE_CONTENT_ERROR  : null,

    REPORT_CONTENT        : null,
    REPORT_CONTENT_SUCCESS: null,
    REPORT_CONTENT_ERROR  : null,

    REQUEST_GROUP        : null,
    REQUEST_GROUP_SUCCESS: null,
    REQUEST_GROUP_ERROR  : null,

    JOIN_GROUP        : null,
    JOIN_GROUP_SUCCESS: null,
    JOIN_GROUP_ERROR  : null,

    CREATE_GROUP        : null,
    CREATE_GROUP_SUCCESS: null,
    CREATE_GROUP_ERROR  : null,

    LEAVE_GROUP        : null,
    LEAVE_GROUP_SUCCESS: null,
    LEAVE_GROUP_ERROR  : null,

    REQUEST_GROUP_MEMBERS        : null,
    REQUEST_GROUP_MEMBERS_SUCCESS: null,
    REQUEST_GROUP_MEMBERS_ERROR  : null,

    REQUEST_GROUP_CONTENTS        : null,
    REQUEST_GROUP_CONTENTS_SUCCESS: null,
    REQUEST_GROUP_CONTENTS_ERROR  : null,

    ROUTER_NEXT_TRANSITION_PATH: null,

    CHAT_MESSAGES            : null,
    CHAT_GET_THREADS_MESSAGES: null,
    CHAT_NO_MESSAGES         : null,
    CHAT_USER_STATUS         : null,
    CHAT_SENDING_MESSAGE     : null,
    CHAT_GET_MESSAGES        : null,
    CHAT_NO_MORE_MESSAGES    : null,
    CHAT_MARK_AS_READED      : null,

    WORKERS_FETCH_START      : null,
    WORKERS_FETCH_FINISH     : null,
    WORKERS_PROCESS_START    : null,
    WORKERS_PROCESS_LINK     : null,
    WORKERS_PROCESS_FINISH   : null,
    WORKERS_SIMILARITY_START : null,
    WORKERS_SIMILARITY_STEP  : null,
    WORKERS_SIMILARITY_FINISH: null,
    WORKERS_MATCHING_START   : null,
    WORKERS_MATCHING_STEP    : null,
    WORKERS_MATCHING_FINISH  : null,
    WORKERS_AFFINITY_START   : null,
    WORKERS_AFFINITY_STEP    : null,
    WORKERS_AFFINITY_FINISH  : null,
    WORKERS_USER_STATUS      : null,

    NOTIFICATION_NEW: null,

    SEND_PUSH_NOTIFICATIONS_SUBSCRIPTION          : null,
    SEND_PUSH_NOTIFICATIONS_SUBSCRIPTION_SUCCESS  : null,
    SEND_PUSH_NOTIFICATIONS_SUBSCRIPTION_ERROR    : null,
    DELETE_PUSH_NOTIFICATIONS_SUBSCRIPTION        : null,
    DELETE_PUSH_NOTIFICATIONS_SUBSCRIPTION_SUCCESS: null,
    DELETE_PUSH_NOTIFICATIONS_SUBSCRIPTION_ERROR  : null,

    REQUEST_PHOTOS        : null,
    REQUEST_PHOTOS_SUCCESS: null,
    REQUEST_PHOTOS_ERROR  : null,
    SELECT_PHOTO          : null,

    REQUEST_ALBUMS_SUCCESS: null,
    REQUEST_ALBUMS_ERROR  : null,
    REQUEST_ALBUM_SUCCESS : null,
    REQUEST_ALBUM_ERROR   : null,

    UPLOAD_PHOTO        : null,
    UPLOAD_PHOTO_SUCCESS: null,
    UPLOAD_PHOTO_ERROR  : null,

    DELETE_PHOTO        : null,
    DELETE_PHOTO_SUCCESS: null,
    DELETE_PHOTO_ERROR  : null,

    REQUEST_SET_PROFILE_PHOTO        : null,
    REQUEST_SET_PROFILE_PHOTO_SUCCESS: null,
    REQUEST_SET_PROFILE_PHOTO_ERROR  : null,

    REQUEST_USER_DATA_STATUS        : null,
    REQUEST_USER_DATA_STATUS_SUCCESS: null,
    REQUEST_USER_DATA_STATUS_ERROR  : null,

    REQUEST_TAG_SUGGESTIONS        : null,
    REQUEST_TAG_SUGGESTIONS_SUCCESS: null,
    REQUEST_TAG_SUGGESTIONS_ERROR  : null,

    REQUEST_TAG_GOOGLE_SUGGESTIONS        : null,
    REQUEST_TAG_GOOGLE_SUGGESTIONS_SUCCESS: null,
    REQUEST_TAG_GOOGLE_SUGGESTIONS_ERROR  : null,
    RESET_TAG_SUGGESTIONS          : null,

    REQUEST_PROPOSALS        : null,
    REQUEST_PROPOSALS_SUCCESS: null,
    REQUEST_PROPOSALS_ERROR  : null,

    CREATE_PROPOSAL        : null,
    CREATE_PROPOSAL_SUCCESS: null,
    CREATE_PROPOSAL_ERROR  : null,

    UPDATE_PROPOSAL        : null,
    UPDATE_PROPOSAL_SUCCESS: null,
    UPDATE_PROPOSAL_ERROR  : null,

    DELETE_PROPOSAL        : null,
    DELETE_PROPOSAL_SUCCESS: null,
    DELETE_PROPOSAL_ERROR  : null,

    INTEREST_PROPOSAL        : null,
    INTEREST_PROPOSAL_SUCCESS: null,
    INTEREST_PROPOSAL_ERROR  : null,

    ACCEPT_CANDIDATE        : null,
    ACCEPT_CANDIDATE_SUCCESS: null,
    ACCEPT_CANDIDATE_ERROR  : null,

    SKIP_PROPOSAL        : null,
    SKIP_PROPOSAL_SUCCESS: null,
    SKIP_PROPOSAL_ERROR  : null,

    SKIP_CANDIDATE        : null,
    SKIP_CANDIDATE_SUCCESS: null,
    SKIP_CANDIDATE_ERROR  : null,

    REQUEST_PROPOSAL_RECOMMENDATIONS        : null,
    REQUEST_PROPOSAL_RECOMMENDATIONS_SUCCESS: null,
    REQUEST_PROPOSAL_RECOMMENDATIONS_ERROR  : null,

    MERGE_CREATING_PROPOSAL : null,

    CHANGE_LOCALE: null

});
