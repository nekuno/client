import { fetchQuestions, fetchQuestion, fetchComparedQuestions, postAnswer, postSkipQuestion } from '../utils/APIUtils';

export function getQuestions(url = `answers`){
    return fetchQuestions(url);
}

export function getComparedQuestions(userId, otherUserId, filters, url = `users/${otherUserId}/questions/compare-new/${userId}?locale=es${filters.map(filter => '&'+filter+'=1')}`){
    return fetchComparedQuestions(url);
}

export function getQuestion(questionId, url = `questions/${questionId}?locale=es`){
    return fetchQuestion(url);
}

export function getNextQuestion(url = `questions/next?locale=es`){
    return fetchQuestion(url);
}

export function answerQuestion(questionId, answerId, acceptedAnswers, rating, url = `answers`){
    return postAnswer(url, questionId, answerId, acceptedAnswers, rating);
}

export function skipQuestion(questionId, url = `questions/${questionId}/skip`){
    return postSkipQuestion(url);
}