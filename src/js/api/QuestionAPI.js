import { fetchAnswers, fetchQuestion, fetchComparedAnswers, postAnswer, postSkipQuestion } from '../utils/APIUtils';

export function getAnswers(url){
    return fetchAnswers(url);
}

export function getComparedAnswers(url){
    return fetchComparedAnswers(url);
}

export function getQuestion(questionId, url = `questions/${questionId}?locale=es`){
    return fetchQuestion(url);
}

export function getNextQuestion(url = `questions/next?locale=es`){
    return fetchQuestion(url);
}

export function getNextOtherQuestion(otherUserId, url = `other-questions/${otherUserId}/next?locale=es`){
    return fetchQuestion(url);
}

export function answerQuestion(questionId, answerId, acceptedAnswers, rating, url = `answers`){
    return postAnswer(url, questionId, answerId, acceptedAnswers, rating);
}

export function skipQuestion(questionId, url = `questions/${questionId}/skip`){
    return postSkipQuestion(url);
}