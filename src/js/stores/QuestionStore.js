import { register, waitFor } from '../dispatcher/Dispatcher';
import { createStore, mergeIntoBag, isInBag } from '../utils/StoreUtils';
import ActionTypes from '../constants/ActionTypes';
import selectn from 'selectn';
import UserStore from './UserStore';
import { getValidationErrors } from '../utils/StoreUtils';

const _questions = {};
const _pagination = {};
let _answerQuestion = {};
let _errors = '';

const QuestionStore = createStore({
    contains(userId, questionId) {
        return selectn(userId+'.'+questionId, _questions) !== null;
    },

    get(userId) {
        return _questions[userId];
    },

    getPagination(userId) {
        return _pagination[userId];
    },

    getQuestion() {
        return this.first(_answerQuestion);
    },

    getErrors() {
        return _errors;
    },

    getUserAnswer(userId, questionId) {
        return _questions[userId] ? selectn('userAnswer', _questions[userId][questionId]) : null;
    },

    first(obj) {
        for (let a in obj) {
            if (obj.hasOwnProperty(a)) {
                return obj[a];
            }
        }
    }
});

QuestionStore.dispatchToken = register(action => {
    waitFor([UserStore.dispatchToken]);
    const items = selectn('response.entities.items', action);
    const pagination = selectn('response.result.pagination', action);
    const question = selectn('response.entities.question', action);
    const userAnswer = selectn('response.userAnswer', action);
    const userAnswerQuestion = selectn('response.question', action);
    const error = selectn('error', action);
    const userId = selectn('userId', action);

    if (typeof _questions[userId] === "undefined") {
        _questions[userId] = {};
    }
    if (typeof _pagination[userId] === "undefined") {
        _pagination[userId] = {};
    }
    if (error) {
        _errors = getValidationErrors(error);
        QuestionStore.emitChange();
    }
    else if (items) {
        mergeIntoBag(_questions[userId], items);
        _pagination[userId] = pagination;
        QuestionStore.emitChange();
    }
    else if (question) {
        _answerQuestion = question;
        QuestionStore.emitChange();
    }
    else if (userAnswer && userAnswerQuestion) {
        let userAnswerAndQuestion = {};
        userAnswerAndQuestion[userAnswer.questionId] = { question: userAnswerQuestion, userAnswer: userAnswer };
        mergeIntoBag(_questions[userId], userAnswerAndQuestion);
        QuestionStore.emitChange();
    }
});

export default QuestionStore;
