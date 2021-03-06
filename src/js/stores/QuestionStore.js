import { waitFor } from '../dispatcher/Dispatcher';
import { mergeIntoBag } from '../utils/StoreUtils';
import ActionTypes from '../constants/ActionTypes';
import { API_URLS } from '../constants/Constants';
import selectn from 'selectn';
import UserStore from './UserStore';
import LoginStore from './LoginStore';
import { getValidationErrors } from '../utils/StoreUtils';
import BaseStore from './BaseStore';
import React from "react";

class QuestionStore extends BaseStore {
    setInitial() {
        super.setInitial();
        this._registerQuestionsLength = 4;
        this._questions = {};
        this._otherNotAnsweredQuestions = {};
        this._initialPaginationUrl = API_URLS.ANSWERS;
        this._initialComparedPaginationUrl = API_URLS.COMPARED_ANSWERS;
        this._answerQuestion = {};
        this._answersLength = [];
        this._errors = '';
        this._noMoreQuestions = false;
        this._goToQuestionStats = false;
        this._isJustCompleted = false;
        this._loadingComparedQuestions = false;
        this._loadingOwnQuestions = false;
        this._isRequestedQuestion = {};
        this._comparedOrder = {};
        this._totaDatabaselQuestions = 157;
    }

    _registerToActions(action) {
        waitFor([UserStore.dispatchToken, LoginStore.dispatchToken]);
        super._registerToActions(action);
        let newItems = {};
        const userId = LoginStore.user ? LoginStore.user.id : null;
        switch (action.type) {
            case ActionTypes.REQUEST_QUESTIONS:
                this._noMoreQuestions = false;
                this._loadingOwnQuestions = true;
                this.emitChange();
                break;
            case ActionTypes.REQUEST_COMPARED_QUESTIONS:
                this._loadingComparedQuestions = true;
                this._noMoreQuestions = false;
                this.emitChange();
                break;
            case ActionTypes.REQUEST_QUESTION:
                this._loadingOwnQuestions = true;
                this._noMoreQuestions = false;
                this._isRequestedQuestion[action.otherUserId ? action.otherUserId : userId] = true;
                break;
            case ActionTypes.REQUEST_EXISTING_QUESTION:
                this._noMoreQuestions = false;
                this._answerQuestion = {};
                this._answerQuestion[action.questionId] = this._questions[userId][action.questionId].question;
                this.emitChange();
                break;
            case ActionTypes.REMOVE_PREVIOUS_QUESTION:
                this._answerQuestion = {};
                this.emitChange();
                break;
            case ActionTypes.ANSWER_QUESTION:
                break;
            case ActionTypes.SKIP_QUESTION:
                Object.keys(this._otherNotAnsweredQuestions).forEach(otherUserId => {
                    otherUserId = parseInt(otherUserId);
                    this._otherNotAnsweredQuestions[otherUserId] = {};
                });

                otherUserIds = Object.keys(this._pagination).filter(key => parseInt(key) !== parseInt(userId));
                otherUserIds.forEach(otherUserId => {
                    delete this._pagination[otherUserId];
                });
                otherUserIds = Object.keys(this._questions).filter(key => parseInt(key) !== parseInt(userId));
                otherUserIds.forEach(otherUserId => {
                    delete this._questions[otherUserId];
                });
                this.emitChange();
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
                newItems[userId] = action.response.entities.items;
                this._pagination[userId] = action.response.result.pagination;
                this._loadingOwnQuestions = false;
                mergeIntoBag(this._questions, newItems);
                this.emitChange();
                break;
            case ActionTypes.REQUEST_COMPARED_QUESTIONS_SUCCESS:
                let items = action.response.items;
                const otherUserId = action.otherUserId;
                const otherQuestions = items.otherQuestions.questions ? items.otherQuestions.questions : {};
                if (Object.keys(otherQuestions).length > 0) {
                    this._setQuestionsOrder(otherUserId, otherQuestions);
                    newItems[otherUserId] = otherQuestions;
                }
                const ownQuestions = items.ownQuestions.questions ? items.ownQuestions.questions : {};
                if (Object.keys(ownQuestions).length > 0) {
                    this._setQuestionsOrder(userId, ownQuestions);
                    newItems[userId] = ownQuestions;
                }
                const otherNotAnsweredQuestions = items.otherNotAnsweredQuestions.questions ? items.otherNotAnsweredQuestions.questions : {};
                if (Object.keys(otherNotAnsweredQuestions).length > 0) {
                    let newOtherNotAnsweredQuestions = {};
                    newOtherNotAnsweredQuestions[otherUserId] = otherNotAnsweredQuestions;
                    mergeIntoBag(this._otherNotAnsweredQuestions, newOtherNotAnsweredQuestions);
                }

                this._pagination[otherUserId] = action.response.pagination;
                this._loadingComparedQuestions = false;

                mergeIntoBag(this._questions, newItems);
                this.emitChange();
                break;
            case ActionTypes.REQUEST_LOGIN_USER_SUCCESS:
            case ActionTypes.REQUEST_AUTOLOGIN_SUCCESS:
                this._answersLength = parseInt(action.response.questionsTotal);
                this.emitChange();
                break;
            case ActionTypes.REQUEST_QUESTION_SUCCESS:
                this._answerQuestion = action.response.entities.question;
                this._loadingOwnQuestions = false;
                this.emitChange();
                break;
            case ActionTypes.ANSWER_QUESTION_SUCCESS:
                const userAnswer = action.response.userAnswer;
                const userAnswerQuestion = action.response.question;
                this._questions[userId] = this._questions[userId] || {};
                this._questions[userId][userAnswer.questionId] = {question: userAnswerQuestion, userAnswer: userAnswer};
                this._goToQuestionStats = true;
                this._pagination[userId] = this._pagination[userId] || {};
                this._pagination[userId].total++;
                this._answersLength++;
                this._isJustCompleted = this.ownAnswersLength(userId) === this._registerQuestionsLength;
                this._isRequestedQuestion = {};
                Object.keys(this._otherNotAnsweredQuestions).forEach(otherUserId => {
                    otherUserId = parseInt(otherUserId);
                    this._otherNotAnsweredQuestions[otherUserId] = {};
                });

                let otherUserIds = Object.keys(this._pagination).filter(key => parseInt(key) !== parseInt(userId));
                otherUserIds.forEach(otherUserId => {
                    delete this._pagination[otherUserId];
                });
                otherUserIds = Object.keys(this._questions).filter(key => parseInt(key) !== parseInt(userId));
                otherUserIds.forEach(otherUserId => {
                    delete this._questions[otherUserId];
                });

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
                this._loadingOwnQuestions = false;
                this.emitChange();
                break;
            case ActionTypes.REQUEST_COMPARED_QUESTIONS_ERROR:
                break;
            case ActionTypes.REQUEST_QUESTION_ERROR:
                this._loadingOwnQuestions = false;
                this._noMoreQuestions = true;
                this.emitChange();
                break;
            case ActionTypes.ANSWER_QUESTION_ERROR:
                this._errors = getValidationErrors(action.error);
                this.emitChange();
                break;
            case ActionTypes.SKIP_QUESTION_ERROR:
                break;
            case ActionTypes.REQUEST_STATS_SUCCESS:
                this._answersLength = action.response.numberOfQuestionsAnswered;
                this._totaDatabaselQuestions = action.response.totalQuestions;
                this.emitChange();
                break;
            case ActionTypes.ORDER_QUESTIONS:
                this._questions = this.orderBy(action.orderCriteria, this._questions, action.otherUserQuestions, action.userQuestions);
                this.emitChange();
                break;
        }
    }

    contains(userId, questionId) {
        let question = selectn(userId + '.' + questionId, this._questions);
        return question && question.hasOwnProperty('question');
    }

    get(userId) {
        return this._questions[userId] || {};
    }

    getCompared(otherUserId) {
        const questions = this._questions[otherUserId] ? Object.assign({}, this._questions[otherUserId]) : {};

        let orderedQuestions = {};
        Object.keys(questions).forEach((questionId) => {
            const position = this._comparedOrder[otherUserId][questionId];
            orderedQuestions[position] = questions[questionId];
        });

        return orderedQuestions;
    }

    getOtherNotAnsweredQuestions(otherUserId) {
        return this._otherNotAnsweredQuestions[otherUserId] ? this._otherNotAnsweredQuestions[otherUserId] : {};
    }

    setEditable(questionId) {
        const userId = LoginStore.user.id;
        if (this._questions[userId][questionId]) {
            this._questions[userId][questionId].userAnswer.isEditable = true;
        }
    }

    isFirstQuestion(userId) {
        return !this._questions.hasOwnProperty(userId) ||
            this._questions.hasOwnProperty(userId) && Object.keys(this._questions[userId]).length === 0;
    }

    getPagination(userId) {
        return this._pagination[userId] || {};
    }

    getRequestQuestionsUrl(userId) {
        return this.getPaginationUrl(userId, this._initialPaginationUrl);
    }

    getRequestComparedQuestionsUrl(userId, filters) {
        let url = this.getPaginationUrl(userId, this._initialComparedPaginationUrl);
        if (url === this._initialComparedPaginationUrl) {
            url = url.replace('{otherUserId}', userId);
            url = url + filters.map(filter => '&' + filter + '=1');
        }
        return url;
    }

    getInitialRequestComparedQuestionsUrl(userId, filters = []) {
        return this._initialComparedPaginationUrl.replace('{otherUserId}', userId) + filters.map(filter => '&' + filter + '=1');
    }

    getQuestion() {
        return this.first(this._answerQuestion);
    }

    hasQuestion() {
        return !!this.getQuestion();
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
        return this.ownAnswersLength(userId) < this._registerQuestionsLength;
    }

    isJustCompleted() {
        return this._isJustCompleted;
    }

    ownAnswersLength(userId) {
        return this._answersLength > 0 ? this._answersLength : this.otherAnswersLength(userId);
    }

    otherAnswersLength(userId) {
        return this.getPagination(userId).hasOwnProperty('total') ? this.getPagination(userId).total :
            Array.isArray(this._questions[userId]) ? Object.keys(this._questions[userId]).length : 0;
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

    isLoadingOwnQuestions() {
        return this._loadingOwnQuestions;
    }

    isRequestedQuestion(userId) {
        return this._isRequestedQuestion[userId] || false;
    }

    _setQuestionsOrder(userId, questions) {
        let sortable = Object.keys(questions).map((questionId) => {
            return questions[questionId];
        });

        //sort by id first to keep same order
        sortable = sortable.sort((questionA, questionB) => {
            return questionA.question.questionId - questionB.question.questionId;
        });

        sortable = sortable.sort((questionA, questionB) => {
            const questionApriority = questionA.question.hasOwnProperty('isCommon') && questionA.question.isCommon === true ? 1 : 0;
            const questionBpriority = questionB.question.hasOwnProperty('isCommon') && questionB.question.isCommon === true ? 1 : 0;
            return questionBpriority - questionApriority;
        });

        this._comparedOrder[userId] = this._comparedOrder[userId] ? this._comparedOrder[userId] : {};
        const comparedOrderLength = Object.keys(this._comparedOrder[userId]).length;
        sortable.forEach((question, index) => {
            this._comparedOrder[userId][question.question.questionId] = this._comparedOrder[userId][question.question.questionId] !== undefined ? this._comparedOrder[userId][question.question.questionId] : index + comparedOrderLength;
        });
    }

    orderBy(orderCriteria, questions, otherUserQuestions, userQuestions) {
        let questionsWithOrderCriteria = [];
        //
        // questions.forEach(function (item, key) {
        //     if (item.type === orderCriteria) {
        //         questionsWithOrderCriteria.push(item);
        //     }
        // });
        // questions.forEach(function (item, key) {
        //     if (item.type !== orderCriteria) {
        //         questionsWithOrderCriteria.push(item);
        //     }
        // });
        return questionsWithOrderCriteria;
    }

    get totalDatabaseQuestions(){
        return this._totaDatabaselQuestions;
    }
}

export default new QuestionStore();
