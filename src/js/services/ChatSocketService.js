import LoginStore from '../stores/LoginStore';
import { INSTANT_HOST } from '../constants/Constants';

class ChatSocketService {

    constructor() {
        this._socket = null;
    }

    connect() {

        if (typeof io === 'undefined') {
            return;
        }

        this._socket = io.connect(INSTANT_HOST + 'chat?token=' + LoginStore.jwt);
    }

    disconnect() {
        this._socket.disconnect();
    }

}

export default new ChatSocketService();