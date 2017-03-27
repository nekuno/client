import SocketService from './SocketService';
import NotificationActionCreators from '../actions/NotificationActionCreators';

class NotificationsSocketService extends SocketService {

    constructor() {
        super();
        this._name = 'notifications';
    }

    bind() {

        var socket = this._socket;

        socket.on('notification', function(category, data) {
            NotificationActionCreators.notify(category, data);
        });

    }

}

export default new NotificationsSocketService();