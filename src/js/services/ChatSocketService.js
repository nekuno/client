import SocketService from './SocketService';
import ChatActionsCreators from '../actions/ChatActionCreators';

class ChatSocketService extends SocketService {

    constructor() {
        super();
        this._name = 'chat';
    }

    sendMessage(userTo, messageText) {
        this._socket.emit('sendMessage', userTo, messageText, (error) => {
            console.log('Error from sockets', error);
            nekunoApp.alert('Error: ' + error);
        });
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
    }

}

export default new ChatSocketService();