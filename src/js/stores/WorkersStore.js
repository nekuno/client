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
        this._similarityPercentage = null;
        this._matchingPercentage = null;
        this._affinityPercentage = null;
        this._isJustRegistered = null;
        this._registerWorkersFinish = null;
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

            case ActionTypes.WORKERS_SIMILARITY_START:
                this._similarityPercentage = 0;
                this.emitChange();
                break;

            case ActionTypes.WORKERS_SIMILARITY_STEP:
                this._similarityPercentage = action.percentage;
                this.emitChange();
                break;

            case ActionTypes.WORKERS_SIMILARITY_FINISH:
                if (this._isJustRegistered && this._matchingPercentage === 100 && this.getLinksPercentage() === 100 && this._affinityPercentage === 100) {
                    this._isJustRegistered = null;
                    this._similarityPercentage = null;
                    this._matchingPercentage = null;
                    this._affinityPercentage = null;
                    this._registerWorkersFinish = true;
                } else {
                    this._similarityPercentage = this._isJustRegistered ? 100 : null;
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
                if (this._isJustRegistered && this._similarityPercentage === 100 && this.getLinksPercentage() === 100 && this._affinityPercentage === 100) {
                    this._isJustRegistered = null;
                    this._similarityPercentage = null;
                    this._matchingPercentage = null;
                    this._affinityPercentage = null;
                    this._registerWorkersFinish = true;
                } else {
                    this._matchingPercentage = this._isJustRegistered ? 100 : null;
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
                if (this._isJustRegistered && this._similarityPercentage === 100 && this.getLinksPercentage() === 100 && this._affinityPercentage === 100) {
                    this._isJustRegistered = null;
                    this._similarityPercentage = null;
                    this._matchingPercentage = null;
                    this._affinityPercentage = null;
                    this._registerWorkersFinish = true;
                } else {
                    this._affinityPercentage = this._isJustRegistered ? 100 : null;
                }
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

            case ActionTypes.REQUEST_REGISTER_USER_SUCCESS:
                this._isJustRegistered = true;
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

    getLinksPercentage() {
        var linksPercentageSum = 0;
        const notFinished = this._networks.filter(network => !network.processed && (network.fetching || network.fetched || network.processing));
        const totalPercentage = notFinished.length * 100;
        notFinished.forEach(network => linksPercentageSum += network.process ? network.process : 0);

        return totalPercentage ? parseInt(linksPercentageSum*100/totalPercentage) : this._isJustRegistered ? 100 : null;
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

    hasRegisterWorkersFinished() {
        const finished = this._registerWorkersFinish;
        this._registerWorkersFinish = null;

        return finished;
    }

}

export default new WorkersStore();