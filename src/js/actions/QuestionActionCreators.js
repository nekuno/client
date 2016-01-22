import { dispatchAsync, dispatch } from '../dispatcher/Dispatcher';
import ActionTypes from '../constants/ActionTypes';
import * as QuestionAPI from '../api/QuestionAPI';
import QuestionStore from '../stores/QuestionStore';

export function requestQuestions(userId, link, fields) {
    dispatchAsync(QuestionAPI.getQuestions(userId, link), {
        request: ActionTypes.REQUEST_QUESTIONS,
        success: ActionTypes.REQUEST_QUESTIONS_SUCCESS,
        failure: ActionTypes.REQUEST_QUESTIONS_ERROR
    }, {userId});
}

export function requestComparedQuestions(userId, otherUserId, link, fields) {
    dispatchAsync(QuestionAPI.getComparedQuestions(userId, otherUserId, link), {
        request: ActionTypes.REQUEST_COMPARED_QUESTIONS,
        success: ActionTypes.REQUEST_COMPARED_QUESTIONS_SUCCESS,
        failure: ActionTypes.REQUEST_COMPARED_QUESTIONS_ERROR
    }, {userId, otherUserId});
}

export function requestNextQuestions(userId, link) {
    dispatch(ActionTypes.QUESTIONS_NEXT, {userId});
    if (link) {
        requestQuestions(userId, link);
    }
}

export function requestNextComparedQuestions(userId, otherUserId, link) {
    dispatch(ActionTypes.QUESTIONS_NEXT, {userId, otherUserId});
    if (link) {
        requestComparedQuestions(userId, otherUserId, link);
    }
}

export function requestQuestion(userId, questionId) {
    if (!questionId) {
        requestNextQuestion(userId);
    }
    else if (!QuestionStore.contains(userId, questionId)) {
        dispatchAsync(QuestionAPI.getQuestion(userId, questionId), {
            request: ActionTypes.REQUEST_QUESTION,
            success: ActionTypes.REQUEST_QUESTION_SUCCESS,
            failure: ActionTypes.REQUEST_QUESTION_ERROR
        }, {userId, questionId});
    } else {
        dispatch(ActionTypes.REQUEST_EXISTING_QUESTION, {userId, questionId});
    }
}

export function requestNextQuestion(userId) {
    dispatchAsync(QuestionAPI.getNextQuestion(userId), {
        request: ActionTypes.REQUEST_QUESTION,
        success: ActionTypes.REQUEST_QUESTION_SUCCESS,
        failure: ActionTypes.REQUEST_QUESTION_ERROR
    }, {userId});
}

export function answerQuestion(userId, questionId, answerId, acceptedAnswers, rating) {
    return dispatchAsync(QuestionAPI.answerQuestion(userId, questionId, answerId, acceptedAnswers, rating), {
        request: ActionTypes.ANSWER_QUESTION,
        success: ActionTypes.ANSWER_QUESTION_SUCCESS,
        failure: ActionTypes.ANSWER_QUESTION_ERROR
    }, {userId, questionId, answerId, acceptedAnswers, rating});
}

export function skipQuestion(userId, questionId) {
    let promise = dispatchAsync(QuestionAPI.skipQuestion(userId, questionId), {
        request: ActionTypes.SKIP_QUESTION,
        success: ActionTypes.SKIP_QUESTION_SUCCESS,
        failure: ActionTypes.SKIP_QUESTION_ERROR
    }, {userId, questionId});
    promise.then(function() {
        requestNextQuestion(userId);
    });

    return promise;
}