import { fetchQuestions, fetchQuestion, fetchComparedQuestions, postAnswer, postSkipQuestion } from '../utils/APIUtils';

export function getQuestions(userId, url = `users/${userId}/answers`){
    return fetchQuestions(url);
}

export function getComparedQuestions(userId, otherUserId, filters, url = `users/${otherUserId}/questions/compare-new/${userId}?locale=es${filters.map(filter => '&'+filter+'=1')}`){
    return fetchComparedQuestions(url);
}

export function getQuestion(userId, questionId, url = `questions/${questionId}?userId=${userId}&locale=es`){
    return fetchQuestion(url);
}

export function getNextQuestion(userId, url = `questions/next?userId=${userId}&locale=es`){
    return fetchQuestion(url);
}

export function answerQuestion(userId, questionId, answerId, acceptedAnswers, rating, url = `users/${userId}/answers`){
    return postAnswer(url, userId, questionId, answerId, acceptedAnswers, rating);
}

export function skipQuestion(userId, questionId, url = `questions/${questionId}/skip`){
    return postSkipQuestion(url, userId);
}