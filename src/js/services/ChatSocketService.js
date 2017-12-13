import SocketService from './SocketService';
import Framework7Service from './Framework7Service';
import ChatActionsCreators from '../actions/ChatActionCreators';

class ChatSocketService extends SocketService {

    constructor() {
        super();
        this._name = 'chat';
    }

    sendMessage(userTo, messageText) {
        this._socket.emit('sendMessage', userTo, messageText, (error) => {
            console.log('Error from sockets', error);
            Framework7Service.nekunoApp().alert('Error: ' + error);
        });
    }

    getThreadsMessages(offset, limit) {
        this._socket.emit('getThreadsMessages', offset, limit);
    }

    getMessages(userId, offset) {
        this._socket.emit('getMessages', userId, offset, () => {
            ChatActionsCreators.noMoreMessages(userId);
        });
    }

    markAsReaded(userId, timestamp) {
        this._socket.emit('markAsReaded', userId, timestamp);
    }

    bind() {

        var socket = this._socket;

        socket.on('messages', function(messages, fresh) {
            ChatActionsCreators.messages(messages, fresh);
        });

        socket.on('no-messages', function() {
            ChatActionsCreators.noMessages();
        });

        socket.on('userStatus', function(user, status) {
            ChatActionsCreators.userStatus(user, status);
        });

        socket.on('connect', function() {
            ChatActionsCreators.getThreadsMessages(0, 10);
        });
    }

}

export default new ChatSocketService;