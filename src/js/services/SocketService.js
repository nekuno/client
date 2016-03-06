import LoginStore from '../stores/LoginStore';
import { INSTANT_HOST } from '../constants/Constants';

class SocketService {

    constructor() {
        this._socket = null;
        this._name = '';
    }

    connect() {

        if (typeof io === 'undefined') {
            return;
        }

        this._socket = io.connect(INSTANT_HOST + this._name + '?token=' + LoginStore.jwt);
        this.bind();
    }

    disconnect() {
        this._socket.disconnect();
        this._socket = null;
    }

    bind() {
        this._socket.on('connect', () => {
            console.log('Socket connected:', this._name);
        });
        this._socket.on('disconnect', () => {
            console.log('Socket disconnected', this._name);
        });
    }

}

export default SocketService;