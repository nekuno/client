import ActionTypes from '../constants/ActionTypes';
import BaseStore from './BaseStore';
import { getValidationErrors } from '../utils/StoreUtils';

class ProposalStore extends BaseStore {

    setInitial() {
        this._recommendations = [];
        this._ownProposals = [];
        this._errors = '';
        this._isRequesting = false;
    }

    _registerToActions(action) {
        super._registerToActions(action);
        let response = action.response;
        let proposals;
        switch (action.type) {
            case ActionTypes.CREATE_PROPOSAL_SUCCESS:
                this.addOwnProposal(response);
                this.sortOwn();
                this.emitChange();
                break;
            case ActionTypes.REQUEST_PROPOSALS:
                this._isRequesting = true;
                this.emitChange();
                break;
            case ActionTypes.REQUEST_PROPOSALS_SUCCESS:
                proposals = response.items;
                if (proposals) {
                    this._ownProposals = proposals;
                    this.sortOwn();
                }
                this._isRequesting = false;
                this.emitChange();
                break;
            case ActionTypes.REQUEST_USER_SUCCESS:
                const user = action.response.user;
                const userSlug = user.slug;
                proposals = user.proposals;
                proposals.forEach(proposal => {
                    this.addProposal(proposal, userSlug);
                });
                this.emitChange();
                break;
            case ActionTypes.REQUEST_PROPOSALS_ERROR:
                this._isRequesting = false;
                this.emitChange();
                break;
            case ActionTypes.CREATE_PROPOSAL_ERROR:
            case ActionTypes.UPDATE_PROPOSAL_ERROR:
                if (action.error) {
                    this._errors = getValidationErrors(action.error);
                }
                this.emitChange();
                break;
            case ActionTypes.UPDATE_PROPOSAL_SUCCESS:
                this._recommendations.forEach((proposal, index) => {
                    if (proposal.id === action.proposalId) {
                        this._ownProposals[index] = response;
                    }
                });
                this.emitChange();
                break;
            case ActionTypes.DELETE_PROPOSAL:
                let proposalId = action.proposalId;
                this.get(proposalId).deleting = true;
                this.emitChange();
                break;
            case ActionTypes.DELETE_PROPOSAL_SUCCESS:
                this._recommendations.forEach((proposal, index) => {
                    if (proposal.id == action.proposalId) {
                        this._recommendations.splice(index, 1);
                    }
                });
                this.emitChange();
                break;

            default:
                break;
        }
    }

    contains(userSlug, id) {
        return this._recommendations[userSlug] && this._recommendations[userSlug].some(proposals => proposals && proposals.id == id);
    }

    get(userSlug, id) {
        if (!this.contains(userSlug, id)) {
            return {};
        }
        return this._recommendations[userSlug].find(proposal => proposal && proposal.id == id);
    }

    getAll(userSlug) {
        return this._recommendations[userSlug] ? this._recommendations[userSlug] : [];
    }

    isRequesting() {
        return this._isRequesting;
    }

    getErrors() {
        let errors = this._errors;
        this._errors = '';
        return errors;
    }

    enable(threadId) {
        this._disabled[threadId] = false;
    }

    disable(threadId) {
        this._disabled[threadId] = true;
    }

    addOwnProposal(thread) {
        this._ownProposals.push(thread);
        this.sort();
    }

    addProposal(proposal, userSlug)
    {
        this._recommendations[userSlug].push(proposal);
        this.sort(userSlug);
    }

    sort(userSlug) {
        this._recommendations[userSlug] = this._recommendations[userSlug].sort((proposalA, proposalB) => proposalA.updatedAt - proposalB.updatedAt).reverse();
    }

    sortOwn() {
        this._ownProposals = this._ownProposals.sort((proposalA, proposalB) => proposalA.updatedAt - proposalB.updatedAt)
    }
}

export default new ProposalStore();
