import { dispatchAsync, dispatch } from '../dispatcher/Dispatcher';
import ActionTypes from '../constants/ActionTypes';
import * as QuestionAPI from '../api/QuestionAPI';
import QuestionStore from '../stores/QuestionStore';

export function requestQuestions(userId, link) {
    const isLoading = QuestionStore.isLoadingOwnQuestions();
    if (isLoading){
        return Promise.resolve();
    }

    return dispatchAsync(QuestionAPI.getAnswers(link), {
        request: ActionTypes.REQUEST_QUESTIONS,
        success: ActionTypes.REQUEST_QUESTIONS_SUCCESS,
        failure: ActionTypes.REQUEST_QUESTIONS_ERROR
    }, {userId});
}

export function requestComparedQuestions(userId, otherUserId, filters, link) {
    return dispatchAsync(QuestionAPI.getComparedAnswers(otherUserId, filters, link), {
        request: ActionTypes.REQUEST_COMPARED_QUESTIONS,
        success: ActionTypes.REQUEST_COMPARED_QUESTIONS_SUCCESS,
        failure: ActionTypes.REQUEST_COMPARED_QUESTIONS_ERROR
    }, {userId, otherUserId});
}

export function requestNextQuestions(userId, link) {
    dispatch(ActionTypes.QUESTIONS_NEXT, {userId});
    if (link) {
        return requestQuestions(userId, link);
    }

    return Promise.resolve();
}

export function requestNextComparedQuestions(userId, otherUserId, link) {
    dispatch(ActionTypes.QUESTIONS_NEXT, {userId, otherUserId});
    if (link) {
        requestComparedQuestions(userId, otherUserId, [], link);
    }
}

export function requestQuestion(userId, questionId) {
    if (!questionId) {
        return requestNextQuestion(userId);
    }
    else if (!QuestionStore.contains(userId, questionId)) {
        dispatch(ActionTypes.REMOVE_PREVIOUS_QUESTION, {userId});
        dispatchAsync(QuestionAPI.getQuestion(questionId), {
            request: ActionTypes.REQUEST_QUESTION,
            success: ActionTypes.REQUEST_QUESTION_SUCCESS,
            failure: ActionTypes.REQUEST_QUESTION_ERROR
        }, {userId, questionId});
    } else {
        dispatch(ActionTypes.REQUEST_EXISTING_QUESTION, {userId, questionId});
    }
}

export function requestNextQuestion(userId) {
    dispatch(ActionTypes.REMOVE_PREVIOUS_QUESTION, {userId});
    return dispatchAsync(QuestionAPI.getNextQuestion(), {
        request: ActionTypes.REQUEST_QUESTION,
        success: ActionTypes.REQUEST_QUESTION_SUCCESS,
        failure: ActionTypes.REQUEST_QUESTION_ERROR
    }, {userId});
}

export function requestNextOtherQuestion(userId, otherUserId) {
    dispatch(ActionTypes.REMOVE_PREVIOUS_QUESTION, {userId});
    return dispatchAsync(QuestionAPI.getNextOtherQuestion(otherUserId), {
        request: ActionTypes.REQUEST_QUESTION,
        success: ActionTypes.REQUEST_QUESTION_SUCCESS,
        failure: ActionTypes.REQUEST_QUESTION_ERROR
    }, {userId, otherUserId});
}

export function answerQuestion(userId, questionId, answerId, acceptedAnswers, rating) {
    return dispatchAsync(QuestionAPI.answerQuestion(questionId, answerId, acceptedAnswers, rating), {
        request: ActionTypes.ANSWER_QUESTION,
        success: ActionTypes.ANSWER_QUESTION_SUCCESS,
        failure: ActionTypes.ANSWER_QUESTION_ERROR
    }, {userId, questionId, answerId, acceptedAnswers, rating});
}

export function skipQuestion(userId, questionId) {
    dispatch(ActionTypes.REMOVE_PREVIOUS_QUESTION, {userId, questionId});
    let promise = dispatchAsync(QuestionAPI.skipQuestion(questionId), {
        request: ActionTypes.SKIP_QUESTION,
        success: ActionTypes.SKIP_QUESTION_SUCCESS,
        failure: ActionTypes.SKIP_QUESTION_ERROR
    }, {userId, questionId});
    promise.then(function() {
        requestNextQuestion(userId);
    });

    return promise;
}

export function removePreviousQuestion(userId) {
    dispatch(ActionTypes.REMOVE_PREVIOUS_QUESTION, {userId});
}

export function popupDisplayed() {
    dispatch(ActionTypes.QUESTIONS_POPUP_DISPLAYED);
}

export function setQuestionEditable(questionId)
{
    dispatch(ActionTypes.SET_QUESTION_EDITABLE, {questionId});
}
