import SocketService from './SocketService';

class WorkersSocketService extends SocketService {

    constructor() {
        super();
        this._name = 'workers';
    }

    bind() {

        var socket = this._socket;
        var name = this._name;

        socket.on('fetch.start', function(data) {
            // TODO: call action creator
            console.log('socket', name, 'fetch.start', data);
        });

        socket.on('fetch.finish', function(data) {
            // TODO: call action creator
            console.log('socket', name, 'fetch.finish', data);
        });

        socket.on('process.start', function(data) {
            // TODO: call action creator
            console.log('socket', name, 'process.start', data);
        });

        socket.on('process.link', function(data) {
            // TODO: call action creator
            console.log('socket', name, 'process.link', data);
        });

        socket.on('process.finish', function(data) {
            // TODO: call action creator
            console.log('socket', name, 'process.finish', data);
        });

        socket.on('user.status', function(data) {
            // TODO: call action creator
            console.log('socket', name, 'user.status', data);
        });
    }

}

export default new WorkersSocketService();