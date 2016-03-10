import { dispatch, dispatchAsync } from '../dispatcher/Dispatcher';
import ActionTypes from '../constants/ActionTypes';
import ChatSocketService from '../services/ChatSocketService';

export default {

    messages: (messages, fresh) => {
        dispatch(ActionTypes.CHAT_MESSAGES, {messages, fresh});
    },

    noMessages: () => {
        dispatch(ActionTypes.CHAT_NO_MESSAGES, {noMessages: true});
    },

    userStatus: (user, status) => {
        dispatch(ActionTypes.CHAT_USER_STATUS, {user, status});
    },

    sendMessage: (userTo, messageText) => {
        dispatch(ActionTypes.CHAT_SENDING_MESSAGE, {userTo, messageText});
        ChatSocketService.sendMessage(userTo, messageText);
    }

}
