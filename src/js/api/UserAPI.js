import { fetchUser, fetchThreads, fetchRecommendation, fetchUserArray, fetchProfile, fetchMetadata, fetchStats, fetchQuestions, fetchQuestion, postAnswer, postLikeUser, deleteLikeUser, fetchLikeUser, postLikeContent, deleteLikeContent, fetchMatching, fetchSimilarity } from '../utils/APIUtils';

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

export function getThreads(userId, url = `users/${userId}/threads`){
    return fetchThreads(url);
}

export function getRecommendation(threadId, url = `threads/${threadId}/recommendation`){
    return fetchRecommendation(url);
}

export function getQuestions(userId, url = `users/${userId}/answers`){
    return fetchQuestions(url);
}

export function getQuestion(userId, questionId, url = `questionnaire/questions/${questionId}?userId=${userId}&locale=es`){
    return fetchQuestion(url);
}

export function getNextQuestion(userId, url = `questionnaire/questions/next?userId=${userId}&locale=es`){
    return fetchQuestion(url);
}

export function answerQuestion(userId, questionId, answerId, acceptedAnswers, rating, url = `users/${userId}/answers`){
    return postAnswer(url, userId, questionId, answerId, acceptedAnswers, rating);
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
