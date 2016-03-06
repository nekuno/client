import LoginStore from '../stores/LoginStore';
import { INSTANT_HOST } from '../constants/Constants';

class WorkersSocketService {

    constructor() {
        this._socket = null;
    }

    connect() {

        if (typeof io === 'undefined') {
            return;
        }

        this._socket = io.connect(INSTANT_HOST + 'workers?token=' + LoginStore.jwt);
    }

    disconnect() {
        this._socket.disconnect();
    }

}

export default new WorkersSocketService();