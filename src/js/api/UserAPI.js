import { fetchUser, fetchThreads, fetchRecommendation, fetchUserArray } from '../utils/APIUtils';

export function getUser(login, url = `users/${login}`) {
    return fetchUser(url);
}

export function getThreads(login, url = `users/${login}/threads`){
    return fetchThreads(url);
}

export function getRecommendation(threadId, url = `threads/${threadId}/recommendation`){
    return fetchRecommendation(url);
}
