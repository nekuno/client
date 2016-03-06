import SocketService from './SocketService';

class ChatSocketService extends SocketService {

    constructor() {
        super();
        this._name = 'chat';
    }

}

export default new ChatSocketService();