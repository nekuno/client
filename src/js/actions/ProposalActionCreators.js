import { dispatchAsync, dispatch } from '../dispatcher/Dispatcher';
import ActionTypes from '../constants/ActionTypes';
import * as UserAPI from '../api/UserAPI';
import RecommendationStore from '../stores/RecommendationStore';
import ThreadStore from '../stores/ThreadStore';
import ProfileStore from '../stores/ProfileStore';
import FilterStore from '../stores/FilterStore';
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

export function createProposal(userId, data) {
    return dispatchAsync(UserAPI.createProposal(data), {
        request: ActionTypes.CREATE_PROPOSAL,
        success: ActionTypes.CREATE_PROPOSAL_SUCCESS,
        failure: ActionTypes.CREATE_PROPOSAL_ERROR
    }, {userId, data})
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

export function requestRecommendations(threadId, url) {
    return dispatchAsync((UserAPI.getProposalRecommendations(url)), {
        request: ActionTypes.REQUEST_PROPOSAL_RECOMMENDATIONS,
        success: ActionTypes.REQUEST_PROPOSAL_RECOMMENDATIONS_SUCCESS,
        failure: ActionTypes.REQUEST_PROPOSAL_RECOMMENDATIONS_ERROR
    }, {threadId});
}

export function interestProposal(proposalId) {
    return dispatchAsync((UserAPI.likeProposal(proposalId, nextUrl)), {
        request: ActionTypes.INTEREST_PROPOSAL,
        success: ActionTypes.INTEREST_PROPOSAL_SUCCESS,
        failure: ActionTypes.INTEREST_PROPOSAL_ERROR
    }, {proposalId});
}

export function acceptCandidate(candidateId) {
    return dispatchAsync((UserAPI.likeCandidate(candidateId, nextUrl)), {
        request: ActionTypes.ACCEPT_CANDIDATE,
        success: ActionTypes.ACCEPT_CANDIDATE_SUCCESS,
        failure: ActionTypes.ACCEPT_CANDIDATE_ERROR
    }, {candidateId});
}

export function skipProposal(proposalId) {
    return dispatchAsync((UserAPI.skipProposal(proposalId, nextUrl)), {
        request: ActionTypes.SKIP_PROPOSAL,
        success: ActionTypes.SKIP_PROPOSAL_SUCCESS,
        failure: ActionTypes.SKIP_PROPOSAL_ERROR
    }, {proposalId});
}

export function skipCandidate(candidateId) {
    return dispatchAsync((UserAPI.skipCandidate(candidateId, nextUrl)), {
        request: ActionTypes.SKIP_CANDIDATE,
        success: ActionTypes.SKIP_CANDIDATE_SUCCESS,
        failure: ActionTypes.SKIP_CANDIDATE_ERROR
    }, {candidateId});
}