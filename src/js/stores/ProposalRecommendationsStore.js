import ActionTypes from '../constants/ActionTypes';
import BaseStore from './BaseStore';

class ProposalRecommendationsStore extends BaseStore {

    setInitial() {
        this._recommendations = [];
        this._errors = '';
        this._isRequesting = false;
    }

    _registerToActions(action) {
        super._registerToActions(action);
        let response = action.response;
        switch (action.type) {
            case ActionTypes.REQUEST_PROPOSAL_RECOMMENDATIONS:
                this._isRequesting = true;
                this.emitChange();
                break;
            case ActionTypes.REQUEST_PROPOSAL_RECOMMENDATIONS_ERROR:
                this._isRequesting = false;
                this._errors.push(action.error);
                this.emitChange();
                break;
            case ActionTypes.REQUEST_PROPOSAL_RECOMMENDATIONS_SUCCESS:
                let recommendations = response;
                if (recommendations.length > 0) {
                    this._recommendations = recommendations;
                }
                this._isRequesting = false;
                this.emitChange();
                break;
            case ActionTypes.INTEREST_PROPOSAL:
                let recommendationId = action.proposalId;
                this._remove(recommendationId);
                this.emitChange();
                break;
            case ActionTypes.ACCEPT_CANDIDATE:
                let candidateId = action.candidateId;
                this._remove(candidateId);
                this.emitChange();
                break;
            default:
                break;
        }
    }

    contains(id) {
        return this._recommendations && this._recommendations.some(recommendations => recommendations && recommendations.id == id);
    }

    get(id) {
        if (!this.contains(id)) {
            return {};
        }
        return this._recommendations.find(recommendation => recommendation && recommendation.id == id);
    }

    getAll() {
        return this._recommendations;
    }

    _remove(id)
    {
        this._recommendations = this._recommendations.filter(function (recommendation) {
            return recommendation.id !== id;
        })
    }

    isRequesting() {
        return this._isRequesting;
    }

    getErrors() {
        let errors = this._errors;
        this._errors = '';
        return errors;
    }
}

export default new ProposalStore();
