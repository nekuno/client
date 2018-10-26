import { dispatchAsync, dispatch } from '../dispatcher/Dispatcher';
import ActionTypes from '../constants/ActionTypes';
import * as UserAPI from '../api/UserAPI';
import LoginStore from '../stores/LoginStore';

export function requestProposals(userId = null, url = null) {

    if (null === userId) {
        userId = LoginStore.user.id;
    }

    let proposals = {};
    if (url) {
        proposals = UserAPI.getProposals(url);
    } else {
        proposals = UserAPI.getProposals();
    }

    return dispatchAsync(proposals, {
        request: ActionTypes.REQUEST_PROPOSALS,
        success: ActionTypes.REQUEST_PROPOSALS_SUCCESS,
        failure: ActionTypes.REQUEST_PROPOSALS_ERROR
    }, {userId})
}

/**
 * @param data structure: {
 *     type: 'work',
 *     filters: {
 *         userFilters: {
 *             descriptiveGender: ['man'],
 *             birthday: [max:40, min: 30],
 *             ...
 *         }
 *     }, // do not include "filters" key if there is none. 'userFilters' key is mandatory for now
 *     fields: {
 *         title: 'work proposal title',
 *         description: 'work proposal description',
 *         restaurant: ['Asian'],
 *         ...
 *     } // always include title and description keys inside fields even if null or empty strings
 * }
 */
export function createProposal(data) {
    return dispatchAsync(UserAPI.createProposal(data), {
        request: ActionTypes.CREATE_PROPOSAL,
        success: ActionTypes.CREATE_PROPOSAL_SUCCESS,
        failure: ActionTypes.CREATE_PROPOSAL_ERROR
    }, {data})
}

export function updateProposal(proposalId, data) {
    return dispatchAsync(UserAPI.updateProposal(proposalId, data), {
        request: ActionTypes.UPDATE_PROPOSAL,
        success: ActionTypes.UPDATE_PROPOSAL_SUCCESS,
        failure: ActionTypes.UPDATE_PROPOSAL_ERROR
    }, {proposalId, data})
}

export function deleteProposal(proposalId) {
    return dispatchAsync(UserAPI.removeProposal(proposalId), {
        request: ActionTypes.DELETE_PROPOSAL,
        success: ActionTypes.DELETE_PROPOSAL_SUCCESS,
        failure: ActionTypes.DELETE_PROPOSAL_ERROR
    }, {proposalId})
}

export function requestRecommendations(proposalId, url) {
    return dispatchAsync((UserAPI.getProposalRecommendations(url)), {
        request: ActionTypes.REQUEST_PROPOSAL_RECOMMENDATIONS,
        success: ActionTypes.REQUEST_PROPOSAL_RECOMMENDATIONS_SUCCESS,
        failure: ActionTypes.REQUEST_PROPOSAL_RECOMMENDATIONS_ERROR
    }, {threadId: proposalId});
}

export function interestProposal(proposalId, interested = true) {
    const data = {interested};
    return dispatchAsync((UserAPI.interestProposal(proposalId, data)), {
        request: ActionTypes.INTEREST_PROPOSAL,
        success: ActionTypes.INTEREST_PROPOSAL_SUCCESS,
        failure: ActionTypes.INTEREST_PROPOSAL_ERROR
    }, {proposalId});
}

export function acceptCandidate(candidateId, accepted = true) {
    const data = {accepted};
    return dispatchAsync((UserAPI.acceptCandidate(candidateId, data)), {
        request: ActionTypes.ACCEPT_CANDIDATE,
        success: ActionTypes.ACCEPT_CANDIDATE_SUCCESS,
        failure: ActionTypes.ACCEPT_CANDIDATE_ERROR
    }, {candidateId});
}

export function skipProposal(proposalId, skipped = true) {
    const data = {skipped};
    return dispatchAsync((UserAPI.skipProposal(proposalId, data)), {
        request: ActionTypes.SKIP_PROPOSAL,
        success: ActionTypes.SKIP_PROPOSAL_SUCCESS,
        failure: ActionTypes.SKIP_PROPOSAL_ERROR
    }, {proposalId});
}

export function skipCandidate(candidateId) {
    const data = {skipped};
    return dispatchAsync((UserAPI.skipCandidate(candidateId, data)), {
        request: ActionTypes.SKIP_CANDIDATE,
        success: ActionTypes.SKIP_CANDIDATE_SUCCESS,
        failure: ActionTypes.SKIP_CANDIDATE_ERROR
    }, {candidateId});
}

export function mergeCreatingProposal(data) {
    dispatch(ActionTypes.MERGE_CREATING_PROPOSAL, {data});
}