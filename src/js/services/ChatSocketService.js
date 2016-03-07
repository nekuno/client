import SocketService from './SocketService';

class ChatSocketService extends SocketService {

    constructor() {
        super();
        this._name = 'chat';
    }

    bind() {

        var socket = this._socket;
        var name = this._name;

        socket.on('messages', function(messages, fresh) {
            // TODO: call action creator
            console.log('socket', name, 'messages', messages, fresh);
        });

        socket.on('no-messages', function() {
            // TODO: call action creator
            console.log('socket', name, 'no-messages');
        });
        
        socket.on('userStatus', function(user, status) {
            // TODO: call action creator
            console.log('socket', name, 'userStatus', user, status);
        });
    }

}

export default new ChatSocketService();