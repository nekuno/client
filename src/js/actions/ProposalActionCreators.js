import { dispatchAsync, dispatch } from '../dispatcher/Dispatcher';
import ActionTypes from '../constants/ActionTypes';
import * as UserAPI from '../api/UserAPI';

export function requestOwnProposals() {
    return dispatchAsync(UserAPI.getOwnProposals(), {
        request: ActionTypes.REQUEST_PROPOSALS,
        success: ActionTypes.REQUEST_PROPOSALS_SUCCESS,
        failure: ActionTypes.REQUEST_PROPOSALS_ERROR
    })
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

export function requestOwnProposal(proposalId) {
    return requestOtherProposal(proposalId, '')
}

export function requestOtherProposal(proposalId, slug) {
    return dispatchAsync(UserAPI.getProposal(proposalId), {
        request: ActionTypes.REQUEST_PROPOSAL,
        success: ActionTypes.REQUEST_PROPOSAL_SUCCESS,
        failure: ActionTypes.REQUEST_PROPOSAL_ERROR
    }, {proposalId, slug})
}

export function requestRecommendations(url) {
    return dispatchAsync((UserAPI.getProposalRecommendations(url)), {
        request: ActionTypes.REQUEST_PROPOSAL_RECOMMENDATIONS,
        success: ActionTypes.REQUEST_PROPOSAL_RECOMMENDATIONS_SUCCESS,
        failure: ActionTypes.REQUEST_PROPOSAL_RECOMMENDATIONS_ERROR
    });
}

export function interestProposal(proposalId, interested = true) {
    const data = {interested};
    return dispatchAsync((UserAPI.interestProposal(proposalId, data)), {
        request: ActionTypes.INTEREST_PROPOSAL,
        success: ActionTypes.INTEREST_PROPOSAL_SUCCESS,
        failure: ActionTypes.INTEREST_PROPOSAL_ERROR
    }, {proposalId});
}

export function acceptCandidate(data, accepted = true) {
    data.accepted = accepted;
    return dispatchAsync((UserAPI.acceptCandidate(data)), {
        request: ActionTypes.ACCEPT_CANDIDATE,
        success: ActionTypes.ACCEPT_CANDIDATE_SUCCESS,
        failure: ActionTypes.ACCEPT_CANDIDATE_ERROR
    }, data);
}

export function skipProposal(proposalId, skipped = true) {
    const data = {skipped};
    return dispatchAsync((UserAPI.skipProposal(proposalId, data)), {
        request: ActionTypes.SKIP_PROPOSAL,
        success: ActionTypes.SKIP_PROPOSAL_SUCCESS,
        failure: ActionTypes.SKIP_PROPOSAL_ERROR
    }, {proposalId});
}

export function skipCandidate(data, skipped = true) {
    data.skipped = skipped;
    return dispatchAsync((UserAPI.skipCandidate(data)), {
        request: ActionTypes.SKIP_CANDIDATE,
        success: ActionTypes.SKIP_CANDIDATE_SUCCESS,
        failure: ActionTypes.SKIP_CANDIDATE_ERROR
    }, data);
}

export function mergeCreatingProposal(data) {
    dispatch(ActionTypes.MERGE_CREATING_PROPOSAL, {data});
}

export function cleanCreatingProposal() {
    dispatch(ActionTypes.CLEAN_CREATING_PROPOSAL, {});
}

export function orderProposals(orderCriteria, slug) {
    dispatch(ActionTypes.ORDER_PROPOSALS, {orderCriteria, slug});
}