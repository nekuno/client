import {
    fetchUser,
    postBlockUser,
    deleteBlockUser,
    postLikeContent,
    postDislikeContent,
    postIgnoreContent,
    deleteRateContent,
    getData,
    postData,
    putData,
    deleteData
} from '../utils/APIUtils';

export function validateUsername(username, url = `users/available/${username}`) {
    return getData(url);
}

export function getOwnUser(url = `users`) {
    return getData(url);
}

export function getUser(userSlug, url = `users/${userSlug}`) {
    return fetchUser(url);
}

export function getAutologinData(url = `autologin`) {
    return getData(url);
}

export function getPublicUser(slug, url = `public/users/${slug}`) {
    return fetchUser(url);
}

export function setOwnEnabled(enabled, url = `users/enable`) {
    return postData(url, {enabled: enabled});
}

export function editUser(data, url = `users`) {
    return putData(url, data);
}

export function getOwnProfile(url = `profile`) {
    return getData(url);
}

export function getProfile(slug, url = `profile/${slug}`) {
    return getData(url);
}

export function editProfile(data, url = `profile`) {
    return putData(url, data);
}

export function getMetadata(url = `profile/metadata`) {
    return getData(url);
}

export function getCategories(url = `profile/categories`) {
    return getData(url);
}

export function getFilters(url = `filters`) {
    return getData(url);
}

export function getStats(url = `stats`) {
    return getData(url);
}

export function getComparedStats(id, url = `stats/compare/${id}`) {
    return getData(url);
}

export function getThreads(url = `threads`){
    return getData(url);
}

export function createThread(data, url='threads') {
    return postData(url, data);
}

export function updateThread(threadId, data, url= `threads/${threadId}`) {
    return putData(url, data);
}

export function removeThread(threadId, url= `threads/${threadId}`) {
    return deleteData(url);
}

export function getRecommendations(url) {
    return getData(url);
}

export function setBlockUser(to, url = `blocks/${to}`) {
    return postBlockUser(url);
}

export function unsetBlockUser(to, url = `blocks/${to}`) {
    return deleteBlockUser(url);
}

export function getBlockUser(to, url = `blocks/${to}`) {
    return getData(url);
}

export function reportUser(to, data, url = `reports/${to}`) {
    return postData(url, data);
}

export function setLikeUser(to, originContext, originName, url = `likes/${to}`) {
    return postData(url, {originContext: originContext, originName: originName});
}

export function setDislikeUser(to, originContext, originName, url = `dislikes/${to}`) {
    return postData(url, {originContext: originContext, originName: originName});
}

export function setIgnoreUser(to, originContext, originName, url = `ignores/${to}`) {
    return postData(url, {originContext: originContext, originName: originName});
}

export function unsetRateUser(to, url = `likes/${to}`) {
    return deleteData(url);
}

export function getLikeUser(to, url = `likes/${to}`) {
    return getData(url);
}

export function setLikeContent(to, originContext, originName, url = `content/rate`) {
    return postLikeContent(url, to, originContext, originName);
}

export function setDislikeContent(to, originContext, originName, url = `content/rate`) {
    return postDislikeContent(url, to, originContext, originName);
}

export function setIgnoreContent(to, originContext, originName, url = `content/rate`) {
    return postIgnoreContent(url, to, originContext, originName);
}

export function unsetRateContent(to, url = `content/rate`) {
    return deleteRateContent(url, to);
}

export function reportContent(data, url = `content/report`) {
    return postData(url, data);
}

export function getMatching(userId, url = `matching/${userId}`) {
    return getData(url);
}

export function getSimilarity(userId, url = `similarity/${userId}`) {
    return getData(url);
}

//Proposals

export function createProposal(data, url='proposals') {
    return postData(url, data);
}

export function updateProposal(proposalId, data, url= `proposals/${proposalId}`) {
    return putData(url, data);
}

export function removeProposal(proposalId, url= `proposals/${proposalId}`) {
    return deleteData(url);
}

export function getProposal(proposalId, url= `proposals/${proposalId}`) {
    return getData(url);
}

export function getProposalRecommendations(url='proposals/recommendations') {
    return getData(url);
}

export function getOwnProposals(url = 'proposals') {
    return getData(url);
}

export function getOwnProposalsLiked(url) {
    return getData(url);
}

export function acceptCandidate(data, url = 'recommendations/candidates') {
    return postData(url, data);
}

export function interestProposal(proposalId, data = {interested: true}, url = 'recommendations/proposals') {
    data.proposalId = proposalId;
    return postData(url, data);
}

export function skipCandidate(data, url = 'recommendations/candidates/skip') {
    return postData(url, data)
}

export function skipProposal(proposalId, data = {skipped: true}, url = 'recommendations/proposals/skip') {
    data.proposalId = proposalId;
    return postData(url, data)
}
