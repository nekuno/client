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
let _goToQuestionStats = false;

const QuestionStore = createStore({
    contains(userId, questionId) {
        let question = selectn(userId+'.'+questionId, _questions);
        return question && question.hasOwnProperty('question');
    },

    get(userId) {
        return _questions[userId];
    },

    isFirstQuestion(userId) {
        return !_questions.hasOwnProperty(userId)  ||
            _questions.hasOwnProperty(userId) && Object.keys(_questions[userId]).length === 0;
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

    mustGoToQuestionStats() {
        return _goToQuestionStats;
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
    const otherUserId = selectn('otherUserId', action);
    let newItems = {};
    _goToQuestionStats = false;

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
        if (action.type === 'REQUEST_COMPARED_QUESTIONS_SUCCESS') {
            for (let index in items) {
                if (items.hasOwnProperty(index)) {
                    newItems[index] = items[index].questions;
                }
            }
            _pagination[otherUserId] = pagination;
        } else {
            newItems[userId] = items;
            _pagination[userId] = pagination;
        }
        mergeIntoBag(_questions, newItems);

        QuestionStore.emitChange();
    }
    else if (question) {
        _answerQuestion = question;
        QuestionStore.emitChange();
    }
    else if (userAnswer && userAnswerQuestion) {
        // TODO: mergeIntoBag does not work here (maybe should)
        //let userAnswerAndQuestion = { question: userAnswerQuestion, userAnswer: userAnswer };
        //mergeIntoBag(_questions[userId], userAnswerAndQuestion);
        _questions[userId][userAnswer.questionId] = { question: userAnswerQuestion, userAnswer: userAnswer };
        // TODO: userAnswer seems to have sometimes the old values, so we get from action directly (apparently solved)
        //_questions[userId][userAnswer.questionId].userAnswer.answerId = action.answerId;
        //_questions[userId][userAnswer.questionId].userAnswer.acceptedAnswers = action.acceptedAnswers;

        _goToQuestionStats = true;
        QuestionStore.emitChange();
    }
    else if (action.type === 'REQUEST_EXISTING_QUESTION') {
        _answerQuestion = {};
        _answerQuestion[action.questionId] = _questions[userId][action.questionId].question;
        QuestionStore.emitChange();
    }
});

export default QuestionStore;
