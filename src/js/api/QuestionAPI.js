import { fetchAnswers, fetchQuestion, fetchComparedAnswers, postAnswer, postSkipQuestion } from '../utils/APIUtils';

export function getAnswers(url = `answers`){
    return fetchAnswers(url);
}

export function getComparedAnswers(otherUserId, filters, url = `answers/compare-new/${otherUserId}?locale=es${filters.map(filter => '&'+filter+'=1')}`){
    return fetchComparedAnswers(url);
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