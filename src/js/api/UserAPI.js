import { fetchUser, fetchThreads, fetchRecommendation, fetchUserArray, fetchProfile, fetchStats, postLikeUser, deleteLikeUser, postLikeContent, deleteLikeContent, fetchMatching, fetchSimilarity } from '../utils/APIUtils';

export function getUser(login, url = `users/${login}`) {
    return fetchUser(url);
}

export function getProfile(login, url = `users/${login}/profile`) {
    return fetchProfile(url);
}

export function getStats(login, url = `users/${login}/stats`) {
    return fetchStats(url);
}

export function getThreads(login, url = `users/${login}/threads`){
    return fetchThreads(url);
}

export function getRecommendation(threadId, url = `threads/${threadId}/recommendation`){
    return fetchRecommendation(url);
}

export function setLikeUser(from, to, url = `users/${from}/likes/${to}`){
    return postLikeUser(url);
}

export function unsetLikeUser(from, to, url = `users/${from}/likes/${to}`) {
    return deleteLikeUser(url);
}

export function setLikeContent(from, to, url = `users/${from}/content/rate`){
    return postLikeContent(url, to);
}

export function unsetLikeContent(from, to, url = `users/${from}/likes/${to}`) {
    return deleteLikeContent(url, to);
}

export function getMatching(userId1, userId2, url = `users/${userId1}/matching/${userId2}`){
    return fetchMatching(url);
}

export function getSimilarity(userId1, userId2, url = `users/${userId1}/similarity/${userId2}`){
    return fetchSimilarity(url);
}
