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
    },

    getMessages: (userId, offset) => {
        dispatch(ActionTypes.CHAT_GET_MESSAGES, {userId, offset});
        ChatSocketService.getMessages(userId, offset);
    },

    noMoreMessages: (userId) => {
        dispatch(ActionTypes.CHAT_NO_MORE_MESSAGES, {userId});
    },

    markAsReaded: (userId, timestamp) => {
        dispatch(ActionTypes.CHAT_MARK_AS_READED, {userId, timestamp});
        ChatSocketService.markAsReaded(userId, timestamp);
    }

}
