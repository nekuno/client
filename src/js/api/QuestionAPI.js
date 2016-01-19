import { fetchQuestions, fetchQuestion, postAnswer } from '../utils/APIUtils';

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