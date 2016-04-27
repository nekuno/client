import {
    fetchUser,
    fetchThreads,
    postThread,
    putThread,
    deleteThread,
    fetchRecommendation,
    fetchUserArray,
    fetchProfile,
    putProfile,
    fetchMetadata,
    fetchStats,
    fetchComparedStats,
    postBlockUser,
    deleteBlockUser,
    fetchBlockUser,
    postLikeUser,
    deleteLikeUser,
    fetchLikeUser,
    postLikeContent,
    deleteLikeContent,
    getData
} from '../utils/APIUtils';

export function getUser(userId, url = `users/${userId}`) {
    return fetchUser(url);
}

export function getProfile(userId, url = `profile/${userId}`) {
    return fetchProfile(url);
}

export function editProfile(data, url = `profile`) {
    return putProfile(url, data);
}

export function getMetadata(url = `profile/metadata`) {
    return fetchMetadata(url);
}

export function getFilters(url = `filters`) {
    return getData(url);
}

export function getStats(url = `stats`) {
    return fetchStats(url);
}

export function getComparedStats(id, url = `stats/compare/${id}`) {
    return fetchComparedStats(url);
}

export function getThreads(url = `threads`){
    return fetchThreads(url);
}

export function createThread(data, url='threads') {
    return postThread(url, data);
}

export function updateThread(threadId, data, url= `threads/${threadId}`) {
    return putThread(url, data);
}

export function removeThread(threadId, url= `threads/${threadId}`) {
    return deleteThread(url);
}

export function getRecommendation(threadId, url = `threads/${threadId}/recommendation`) {
    return fetchRecommendation(url);
}

export function setBlockUser(to, url = `blocks/${to}`) {
    return postBlockUser(url);
}

export function unsetBlockUser(to, url = `blocks/${to}`) {
    return deleteBlockUser(url);
}

export function getBlockUser(to, url = `blocks/${to}`) {
    return fetchBlockUser(url);
}

export function setLikeUser(to, url = `likes/${to}`) {
    return postLikeUser(url);
}

export function unsetLikeUser(to, url = `likes/${to}`) {
    return deleteLikeUser(url);
}

export function getLikeUser(to, url = `likes/${to}`) {
    return fetchLikeUser(url);
}

export function setLikeContent(to, url = `content/rate`) {
    return postLikeContent(url, to);
}

export function unsetLikeContent(to, url = `content/rate`) {
    return deleteLikeContent(url, to);
}

export function getMatching(userId, url = `matching/${userId}`) {
    return getData(url);
}

export function getSimilarity(userId, url = `similarity/${userId}`) {
    return getData(url);
}
