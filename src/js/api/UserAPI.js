import { fetchUser, fetchThreads, fetchRecommendation, fetchUserArray, fetchProfile, fetchMetadata, fetchStats, fetchComparedStats,
    postBlockUser, deleteBlockUser, fetchBlockUser,
    postLikeUser, deleteLikeUser, fetchLikeUser,
    postLikeContent, deleteLikeContent,
    fetchMatching, fetchSimilarity } from '../utils/APIUtils';

export function getUser(userId, url = `users/${userId}`) {
    return fetchUser(url);
}

export function getProfile(userId, url = `users/${userId}/profile`) {
    return fetchProfile(url);
}

export function getMetadata(userId, url = `profile/metadata`) {
    return fetchMetadata(url);
}

export function getStats(userId, url = `users/${userId}/stats`) {
    return fetchStats(url);
}

export function getComparedStats(id1, id2, url = `users/${id1}/stats/compare/${id2}`) {
    return fetchComparedStats(url);
}

export function getThreads(userId, url = `users/${userId}/threads`){
    return fetchThreads(url);
}

export function getRecommendation(threadId, url = `threads/${threadId}/recommendation`){
    return fetchRecommendation(url);
}

export function setBlockUser(from, to, url = `users/${from}/blocks/${to}`){
    return postBlockUser(url);
}

export function unsetBlockUser(from, to, url = `users/${from}/blocks/${to}`) {
    return deleteBlockUser(url);
}

export function getBlockUser(from, to, url = `users/${from}/blocks/${to}`) {
    return fetchBlockUser(url);
}

export function setLikeUser(from, to, url = `users/${from}/likes/${to}`){
    return postLikeUser(url);
}

export function unsetLikeUser(from, to, url = `users/${from}/likes/${to}`) {
    return deleteLikeUser(url);
}

export function getLikeUser(from, to, url = `users/${from}/likes/${to}`) {
    return fetchLikeUser(url);
}

export function setLikeContent(from, to, url = `users/${from}/content/rate`){
    return postLikeContent(url, to);
}

export function unsetLikeContent(from, to, url = `users/${from}/content/rate`) {
    return deleteLikeContent(url, to);
}

export function getMatching(userId1, userId2, url = `users/${userId1}/matching/${userId2}`){
    return fetchMatching(url);
}

export function getSimilarity(userId1, userId2, url = `users/${userId1}/similarity/${userId2}`){
    return fetchSimilarity(url);
}
