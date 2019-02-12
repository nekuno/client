import ActionTypes from '../constants/ActionTypes';
import BaseStore from './BaseStore';
import { getValidationErrors } from '../utils/StoreUtils';

class ProposalStore extends BaseStore {

    setInitial() {
        this._otherProposals = {};
        this._ownProposals = [];
        this._errors = '';
        this._isRequesting = false;
    }

    _registerToActions(action) {
        super._registerToActions(action);
        let response = action.response;
        let proposals;
        switch (action.type) {
            case ActionTypes.REQUEST_PROPOSALS:
                this._isRequesting = true;
                this.emitChange();
                break;
            case ActionTypes.REQUEST_PROPOSALS_SUCCESS:
                proposals = response.items;
                proposals.forEach(proposal => {
                    this.addOwnProposal(proposal);
                });
                this._isRequesting = false;
                this.emitChange();
                break;
            case ActionTypes.REQUEST_PROPOSALS_ERROR:
                this._isRequesting = false;
                this.emitChange();
                break;
            case ActionTypes.REQUEST_USER_SUCCESS:
                const responseUsers = action.response.entities.users;
                const user = Object.keys(responseUsers).map((key) => {return responseUsers[key]})[0];
                const userSlug = user.slug;
                proposals = user.proposals;
                proposals.forEach(proposal => {
                    this.addProposal(proposal, userSlug);
                });
                this.emitChange();
                break;
            case ActionTypes.CREATE_PROPOSAL_SUCCESS:
                this.addOwnProposal(response);
                this.emitChange();
                break;
            case ActionTypes.CREATE_PROPOSAL_ERROR:
            case ActionTypes.UPDATE_PROPOSAL_ERROR:
            case ActionTypes.DELETE_PROPOSAL_ERROR:
                if (action.error) {
                    this._errors = getValidationErrors(action.error);
                }
                this.emitChange();
                break;
            case ActionTypes.UPDATE_PROPOSAL_SUCCESS:
                this._replaceOwnProposal(proposal);
                this.emitChange();
                break;
            case ActionTypes.DELETE_PROPOSAL_SUCCESS:
                const proposalId = action.proposalId;
                this._removeOwnProposal(proposalId);
                this.emitChange();
                break;
            case ActionTypes.ORDER_PROPOSALS:
                this._otherProposals[action.slug] = this.orderBy(action.orderCriteria, this._otherProposals[action.slug]);
                this.emitChange();
                break;
            default:
                break;
        }
    }

    contains(userSlug, id) {
        return this._otherProposals[userSlug] && this._otherProposals[userSlug].some(proposals => proposals && proposals.id == id);
    }

    get(userSlug, id) {
        if (!this.contains(userSlug, id)) {
            return {};
        }
        return this._otherProposals[userSlug].find(proposal => proposal && proposal.id == id);
    }

    getAll(userSlug) {
        this._initialize(userSlug);
        return this._otherProposals[userSlug];
    }

    getAllOwn()
    {
        return this._ownProposals;
    }

    isRequesting() {
        return this._isRequesting;
    }

    getErrors() {
        let errors = this._errors;
        this._errors = '';
        return errors;
    }

    addOwnProposal(proposal) {
        this._ownProposals.push(proposal);
        this.sortOwn();
    }

    _replaceOwnProposal(newProposal) {
        const proposalId = newProposal.id;
        this._ownProposals.forEach((proposal, index) => {
            if (proposal.id === proposalId) {
                this._ownProposals[index] = newProposal;
            }
        });
    }

    _removeOwnProposal(proposalId)
    {
        this._otherProposals.forEach((proposal, index) => {
            if (proposal.id == proposalId) {
                this._otherProposals.splice(index, 1);
            }
        });
    }

    addProposal(proposal, userSlug)
    {
        this._initialize(userSlug);
        this._otherProposals[userSlug].push(proposal);
        this.sort(userSlug);
    }

    sort(userSlug) {
        this._initialize(userSlug);
        this._otherProposals[userSlug] = this._otherProposals[userSlug].sort(this._compareTwoProposals);
    }

    sortOwn() {
        this._ownProposals = this._ownProposals.sort(this._compareTwoProposals);
    }

    orderBy(orderCriteria, proposals) {
        let proposalsWithOrderCriteria = [];
        proposals.forEach(function (item, key) {
            if (item.type === orderCriteria) {
                proposalsWithOrderCriteria.push(item);
            }
        });
        proposals.forEach(function (item, key) {
            if (item.type !== orderCriteria) {
                proposalsWithOrderCriteria.push(item);
            }
        });
        return proposalsWithOrderCriteria;
    }

    _compareTwoProposals(proposalA, proposalB)
    {
        return proposalA.matches - proposalB.matches;
    }

    _initialize(userSlug)
    {
        this._otherProposals[userSlug] = this._otherProposals[userSlug] || [];
    }
}

export default new ProposalStore();
