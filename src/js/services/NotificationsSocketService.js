import SocketService from './SocketService';
import NotificationService from './NotificationService';

class NotificationsSocketService extends SocketService {

    constructor() {
        super();
        this._name = 'notifications';
    }

    bind() {

        var socket = this._socket;

        socket.on('notification', function(data) {
            NotificationService.notify(data);
        });

    }

}

export default new NotificationsSocketService();