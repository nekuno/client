import {
    fetchUser,
    fetchUserArray,
    fetchProfile,
    putProfile,
    fetchStats,
    fetchComparedStats,
    postBlockUser,
    deleteBlockUser,
    fetchBlockUser,
    fetchLikeUser,
    postLikeContent,
    postDislikeContent,
    postIgnoreContent,
    deleteRateContent,
    getData,
    postData,
    putData,
    deleteData
} from '../utils/APIUtils';

export function getOwnUser(url = `users`) {
    return getData(url);
}

export function getUser(userId, url = `users/${userId}`) {
    return fetchUser(url);
}

export function editUser(data, url = `users`) {
    return putData(url, data);
}

export function getOwnProfile(url = `profile`) {
    return fetchProfile(url);
}

export function getProfile(userId, url = `profile/${userId}`) {
    return fetchProfile(url);
}

export function editProfile(data, url = `profile`) {
    return putProfile(url, data);
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
    return fetchStats(url);
}

export function getComparedStats(id, url = `stats/compare/${id}`) {
    return fetchComparedStats(url);
}

export function getThreads(url = `threads`){
    return getData(url);
}

export function createThread(data, url='threads') {
    return postData(url, data);
}

export function createDefaultThreads(url = 'threads/default') {
    return postData(url);
}

export function updateThread(threadId, data, url= `threads/${threadId}`) {
    return putData(url, data);
}

export function removeThread(threadId, url= `threads/${threadId}`) {
    return deleteData(url);
}

export function getRecommendation(threadId, url = `threads/${threadId}/recommendation`) {
    return getData(url);
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
    return postData(url);
}

export function setDislikeUser(to, url = `dislikes/${to}`) {
    return postData(url);
}

export function setIgnoreUser(to, url = `ignores/${to}`) {
    return postData(url);
}

export function unsetRateUser(to, url = `likes/${to}`) {
    return deleteData(url);
}

export function getLikeUser(to, url = `likes/${to}`) {
    return fetchLikeUser(url);
}

export function setLikeContent(to, url = `content/rate`) {
    return postLikeContent(url, to);
}

export function setDislikeContent(to, url = `content/rate`) {
    return postDislikeContent(url, to);
}

export function setIgnoreContent(to, url = `content/rate`) {
    return postIgnoreContent(url, to);
}

export function unsetRateContent(to, url = `content/rate`) {
    return deleteRateContent(url, to);
}

export function getMatching(userId, url = `matching/${userId}`) {
    return getData(url);
}

export function getSimilarity(userId, url = `similarity/${userId}`) {
    return getData(url);
}
