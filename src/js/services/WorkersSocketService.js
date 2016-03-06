import SocketService from './SocketService';

class WorkersSocketService extends SocketService {

    constructor() {
        super();
        this._name = 'workers';
    }

}

export default new WorkersSocketService();