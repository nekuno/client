import SocketService from './SocketService';
import WorkersActionCreators from '../actions/WorkersActionCreators';

class WorkersSocketService extends SocketService {

    constructor() {
        super();
        this._name = 'workers';
    }

    bind() {

        var socket = this._socket;

        socket.on('fetch.start', function(data) {
            WorkersActionCreators.fetchStart(data);
        });

        socket.on('fetch.finish', function(data) {
            WorkersActionCreators.fetchFinish(data);
        });

        socket.on('process.start', function(data) {
            WorkersActionCreators.processStart(data);
        });

        socket.on('process.link', function(data) {
            WorkersActionCreators.processLink(data);
        });

        socket.on('process.finish', function(data) {
            WorkersActionCreators.processFinish(data);
        });

        socket.on('similarity.start', function(data) {
            WorkersActionCreators.similarityStart(data);
        });

        socket.on('similarity.step', function(data) {
            WorkersActionCreators.similarityStep(data);
        });

        socket.on('similarity.finish', function(data) {
            WorkersActionCreators.similarityFinish(data);
        });

        socket.on('matching.start', function(data) {
            WorkersActionCreators.matchingStart(data);
        });

        socket.on('matching.step', function(data) {
            WorkersActionCreators.matchingStep(data);
        });

        socket.on('matching.finish', function(data) {
            WorkersActionCreators.matchingFinish(data);
        });

        socket.on('user.status', function(data) {
            WorkersActionCreators.userStatus(data);
        });
    }

}

export default new WorkersSocketService();