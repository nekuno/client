import ActionTypes from '../constants/ActionTypes';
import BaseStore from './BaseStore';
import { SOCIAL_NETWORKS } from '../constants/Constants';

class WorkersStore extends BaseStore {

    setInitial() {
        this._networks = SOCIAL_NETWORKS.map(socialNetwork => {
            return {
                resource  : socialNetwork.resourceOwner,
                fetching  : false,
                fetched   : false,
                processing: false,
                process   : 0,
                processed : false
            }
        });
    }
    
    _registerToActions(action) {
        super._registerToActions(action);

        switch (action.type) {

            case ActionTypes.WORKERS_FETCH_START:
                this._add({
                    resource  : action.resource,
                    fetching  : true,
                    fetched   : false,
                    processing: false,
                    process   : 0,
                    processed : false
                });
                this.emitChange();
                break;

            case ActionTypes.WORKERS_FETCH_FINISH:
                this._add({
                    resource  : action.resource,
                    fetching  : false,
                    fetched   : true,
                    processing: false,
                    process   : 0,
                    processed : false
                });
                this.emitChange();
                break;

            case ActionTypes.WORKERS_PROCESS_START:
                this._add({
                    resource  : action.resource,
                    fetching  : false,
                    fetched   : false,
                    processing: true,
                    process   : 0,
                    processed : false
                });
                this.emitChange();
                break;

            case ActionTypes.WORKERS_PROCESS_LINK:
                this._add({
                    resource  : action.resource,
                    fetching  : false,
                    fetched   : false,
                    processing: true,
                    process   : action.percentage,
                    processed : false
                });
                this.emitChange();
                break;

            case ActionTypes.WORKERS_PROCESS_FINISH:
                this._add({
                    resource  : action.resource,
                    fetching  : false,
                    fetched   : false,
                    processing: false,
                    process   : 0,
                    processed : true
                });
                this.emitChange();
                break;

            case ActionTypes.REQUEST_USER_DATA_STATUS_SUCCESS:
                Object.keys(action.response).forEach(resource => {
                    const data = action.response[resource];
                    this._add({
                        resource  : resource,
                        fetching  : false,
                        fetched   : data.fetched,
                        processing: false,
                        process   : 0,
                        processed : data.processed
                    });
                });

                this.emitChange();
                break;

            default:
                break;
        }
    }

    _add(status) {
        let index = this._networks.findIndex((network) => {
            return network.resource === status.resource;
        });

        if (index !== -1) {
            this._networks[index] = status;
        } else {
            this._networks.push(status);
        }
    }

    getAll() {
        return this._networks;
    }
    
    isConnected(resource) {
        let network = this._networks.find(network => network.resource == resource);
        return network.fetching || network.fetched || network.processing || network.processed;
    }

}

export default new WorkersStore();