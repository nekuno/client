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
        this._connectError = null;
        this._linksPercentage = null;
        this._similarityPercentage = null;
        this._matchingPercentage = null;
        this._affinityPercentage = null;
        this._isJustRegistered = null;
        this._registerWorkersFinish = null;
        this._isLoading = true;
    }
    
    _registerToActions(action) {
        super._registerToActions(action);

        switch (action.type) {

            case ActionTypes.CONNECT_ACCOUNT:
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

            case ActionTypes.CONNECT_ACCOUNT_ERROR:
                this._add({
                    resource  : action.resource,
                    fetching  : false,
                    fetched   : false,
                    processing: false,
                    process   : 0,
                    processed : false,
                    connected : false,
                });
                this.setConnectError();
                this.emitChange();
                break;

            case ActionTypes.CONNECT_ACCOUNT_REMOVE_ERROR:
                this.removeConnectError();
                this.emitChange();
                break;

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
                this._setLinksPercentage();
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
                this._setLinksPercentage();
                this.emitChange();
                break;

            case ActionTypes.WORKERS_SIMILARITY_START:
                this._similarityPercentage = 0;
                this.emitChange();
                break;

            case ActionTypes.WORKERS_SIMILARITY_STEP:
                this._similarityPercentage = action.percentage;
                this.emitChange();
                break;

            case ActionTypes.WORKERS_SIMILARITY_FINISH:
                this._similarityPercentage = null;
                if (this._isJustRegistered && this._matchingPercentage === null && this._linksPercentage === null && this._affinityPercentage === null) {
                    this._isJustRegistered = null;
                    this._registerWorkersFinish = true;
                }
                this.emitChange();
                break;

            case ActionTypes.WORKERS_MATCHING_START:
                this._matchingPercentage = 0;
                this.emitChange();
                break;

            case ActionTypes.WORKERS_MATCHING_STEP:
                this._matchingPercentage = action.percentage;
                this.emitChange();
                break;

            case ActionTypes.WORKERS_MATCHING_FINISH:
                this._matchingPercentage = null;
                if (this._isJustRegistered && this._similarityPercentage === null && this._linksPercentage === null && this._affinityPercentage === null) {
                    this._isJustRegistered = null;
                    this._registerWorkersFinish = true;
                }
                this.emitChange();
                break;

            case ActionTypes.WORKERS_AFFINITY_START:
                this._affinityPercentage = 0;
                this.emitChange();
                break;

            case ActionTypes.WORKERS_AFFINITY_STEP:
                this._affinityPercentage = action.percentage;
                this.emitChange();
                break;

            case ActionTypes.WORKERS_AFFINITY_FINISH:
                this._affinityPercentage = null;
                if (this._isJustRegistered && this._similarityPercentage === null && this._linksPercentage === null && this._matchingPercentage === null) {
                    this._isJustRegistered = null;
                    this._registerWorkersFinish = true;
                }
                this.emitChange();
                break;

            case ActionTypes.REQUEST_USER_DATA_STATUS:
                this._isLoading = true;
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
                this._setLinksPercentage();
                this._isLoading = false;
                this.emitChange();
                break;

            case ActionTypes.REQUEST_REGISTER_USER_SUCCESS:
                this._isJustRegistered = true;
                this._linksPercentage = 0;
                this._similarityPercentage = 0;
                this._matchingPercentage = 0;
                this._affinityPercentage = 0;
                this.emitChange();
                break;

            default:
                break;
        }
    }

    _add(status) {
        status.connected = status.hasOwnProperty('connected') ? status.connected : true;

        let index = this._networks.findIndex((network) => {
            return network.resource === status.resource;
        });

        if (index !== -1) {
            this._networks[index] = status;
        } else {
            this._networks.push(status);
        }
    }

    getConnectError() {
        return this._connectError;
    }

    setConnectError() {
        this._connectError = true;
    }

    removeConnectError() {
        this._connectError = null;
    }

    _setLinksPercentage() {
        let linksPercentageSum = 0;
        const notFinished = this._networks.filter(network => !network.processed && (network.fetching || network.fetched || network.processing));
        const totalPercentage = notFinished.length * 100;
        notFinished.forEach(network => linksPercentageSum += network.process ? network.process : 0);

        this._linksPercentage = totalPercentage ? parseInt(linksPercentageSum*100/totalPercentage) : null;
    }

    getAll() {
        return this._networks.sort((networkA, networkB) => {
            if (networkA.processed && networkB.processed) {
                return 0;
            } else if (networkA.processed && !networkB.processed) {
                return 1;
            }

            return -1;
        });
    }
    
    isConnected(resource) {
        let network = this._networks.find(network => network.resource === resource);
        return network.fetching || network.fetched || network.processing || network.processed;
    }

    getLinksPercentage() {
        return this._linksPercentage;
    }

    getSimilarityPercentage() {
        return this._similarityPercentage;
    }

    getMatchingPercentage() {
        return this._matchingPercentage;
    }

    getAffinityPercentage() {
        return this._affinityPercentage;
    }

    isJustRegistered() {
        return this._isJustRegistered;
    }

    countNetworksWorking() {
        let count= 0;
        this._networks.forEach(network => {
            if (network.fetching || network.processing) {
                count++;
            }
        });
        return count;
    }

    isLoading() {
        return this._isLoading;
    }

    isSomethingWorking() {
        return (this.countNetworksWorking() > 0) || (this.getAffinityPercentage() > 0) || (this.getMatchingPercentage() > 0) || (this.getSimilarityPercentage() > 0);
    }

    hasRegisterWorkersFinished() {
        const finished = this._registerWorkersFinish;
        this._registerWorkersFinish = null;

        return finished;
    }

}

export default new WorkersStore();