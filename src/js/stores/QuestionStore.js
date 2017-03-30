import { waitFor } from '../dispatcher/Dispatcher';
import { mergeIntoBag } from '../utils/StoreUtils';
import ActionTypes from '../constants/ActionTypes';
import selectn from 'selectn';
import UserStore from './UserStore';
import LoginStore from './LoginStore';
import { getValidationErrors } from '../utils/StoreUtils';
import BaseStore from './BaseStore';

class QuestionStore extends BaseStore {
    setInitial() {
        this._registerQuestionsLength = 4;
        this._questions = {};
        this._pagination = {};
        this._answerQuestion = {};
        this._errors = '';
        this._noMoreQuestions = false;
        this._goToQuestionStats = false;
        this._isJustCompleted = false;
        this._loadingComparedQuestions = false;
    }

    _registerToActions(action) {
        waitFor([UserStore.dispatchToken]);
        let newItems = {};
        switch (action.type) {
            case ActionTypes.REQUEST_QUESTIONS:
                break;
            case ActionTypes.REQUEST_COMPARED_QUESTIONS:
                this._loadingComparedQuestions = true;
                this.emitChange();
                break;
            case ActionTypes.REQUEST_QUESTION:
                break;
            case ActionTypes.REQUEST_EXISTING_QUESTION:
                this._answerQuestion = {};
                this._answerQuestion[action.questionId] = this._questions[action.userId][action.questionId].question;
                this.emitChange();
                break;
            case ActionTypes.QUESTIONS_NEXT:
                break;
            case ActionTypes.REMOVE_PREVIOUS_QUESTION:
                this._answerQuestion = {};
                this.emitChange();
                break;
            case ActionTypes.ANSWER_QUESTION:
                break;
            case ActionTypes.SKIP_QUESTION:
                break;
            case ActionTypes.SET_QUESTION_EDITABLE:
                this.setEditable(action.questionId);
                this.emitChange();
                break;
            case ActionTypes.QUESTIONS_POPUP_DISPLAYED:
                this._isJustCompleted = false;
                this.emitChange();
                break;
            case ActionTypes.REQUEST_QUESTIONS_SUCCESS:
                newItems[action.userId] = action.response.entities.items;
                this._pagination[action.userId] = action.response.result.pagination;
                this._loadingComparedQuestions = false;
                mergeIntoBag(this._questions, newItems);
                this.emitChange();
                break;
            case ActionTypes.REQUEST_COMPARED_QUESTIONS_SUCCESS:
                let items = action.response.entities.items;
                const otherUserId = action.otherUserId;
                Object.keys(items).forEach(index => { newItems[index] = items[index].questions });
                this._pagination[otherUserId] = action.response.result.pagination;
                this._loadingComparedQuestions = false;
                mergeIntoBag(this._questions, newItems);
                this.emitChange();
                break;
            case ActionTypes.REQUEST_QUESTION_SUCCESS:
                this._answerQuestion = action.response.entities.question;
                this.emitChange();
                break;
            case ActionTypes.ANSWER_QUESTION_SUCCESS:
                const userAnswer = action.response.userAnswer;
                const userAnswerQuestion = action.response.question;
                this._questions[action.userId] =  this._questions[action.userId] || {};
                this._questions[action.userId][userAnswer.questionId] = {question: userAnswerQuestion, userAnswer: userAnswer};
                this._goToQuestionStats = true;
                this._pagination[action.userId] = this._pagination[action.userId] || {};
                this._pagination[action.userId].total++;
                this._isJustCompleted = this.answersLength(action.userId) == this._registerQuestionsLength;
                this.emitChange();
                break;
            case ActionTypes.SKIP_QUESTION_SUCCESS:
                Object.keys(this._questions).forEach(questionUserId => {
                    if (this._questions[questionUserId][action.questionId]) {
                        delete this._questions[questionUserId][action.questionId];
                        this._pagination[questionUserId].total--;
                    }
                });
                this.emitChange();
                break;
            case ActionTypes.REQUEST_QUESTIONS_ERROR:
            case ActionTypes.REQUEST_COMPARED_QUESTIONS_ERROR:
                break;
            case ActionTypes.REQUEST_QUESTION_ERROR:
                this._noMoreQuestions = true;
                this.emitChange();
                break;
            case ActionTypes.ANSWER_QUESTION_ERROR:
                this._errors = getValidationErrors(action.error);
                this.emitChange();
                break;
            case ActionTypes.SKIP_QUESTION_ERROR:
                break;
        }
    }

    contains(userId, questionId) {
        let question = selectn(userId + '.' + questionId, this._questions);
        return question && question.hasOwnProperty('question');
    }

    get(userId) {
        return this._questions[userId];
    }

    setEditable(questionId) {
        let userId = LoginStore.user.id;
        if (this._questions[userId][questionId]) {
            this._questions[userId][questionId].userAnswer.editable = true;
        }
    }

    isFirstQuestion(userId) {
        return !this._questions.hasOwnProperty(userId) ||
            this._questions.hasOwnProperty(userId) && Object.keys(this._questions[userId]).length === 0;
    }

    getPagination(userId) {
        return this._pagination[userId];
    }

    getQuestion() {
        return this.first(this._answerQuestion);
    }

    getErrors() {
        return this._errors;
    }

    noMoreQuestions() {
        return this._noMoreQuestions;
    }

    getUserAnswer(userId, questionId) {
        return this._questions[userId] ? selectn('userAnswer', this._questions[userId][questionId]) : null;
    }

    mustGoToQuestionStats() {
        const goToQuestionStats = this._goToQuestionStats;
        this._goToQuestionStats = false;
        return goToQuestionStats;
    }

    isJustRegistered(userId) {
        return this.answersLength(userId) < this._registerQuestionsLength;
    }

    isJustCompleted() {
        return this._isJustCompleted;
    }

    answersLength(userId) {
        return this._questions[userId] && Object.keys(this._questions[userId]).length || 0;
    }

    registerQuestionsLength() {
        return this._registerQuestionsLength;
    }

    first(obj) {
        for (let a in obj) {
            if (obj.hasOwnProperty(a)) {
                return obj[a];
            }
        }
    }

    isLoadingComparedQuestions() {
        return this._loadingComparedQuestions;
    }
}

export default new QuestionStore();
