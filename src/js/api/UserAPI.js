import { fetchUser, fetchThreads, fetchRecommendation, fetchUserArray, fetchProfile, fetchStats, postLikeUser, deleteLikeUser } from '../utils/APIUtils';

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

export function unsetLikeUser(from, to, url = `users/${from}/likes/${to}`){
    return deleteLikeUser(url);
}
