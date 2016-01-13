import { register, waitFor } from '../dispatcher/Dispatcher';
import { createStore, mergeIntoBag, isInBag } from '../utils/StoreUtils';
import ActionTypes from '../constants/ActionTypes';
import selectn from 'selectn';
import UserStore from './UserStore';
import {
    createIndexedListStore,
    createListActionHandler
} from '../utils/PaginatedStoreUtils';

const _questions = {};
const _pagination = {};
let _answerQuestion = {};

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
    const userId = selectn('userId', action);

    if (typeof _questions[userId] === "undefined") {
        _questions[userId] = {};
    }
    if (typeof _pagination[userId] === "undefined") {
        _pagination[userId] = {};
    }
    if (items) {
        mergeIntoBag(_questions[userId], items);
        _pagination[userId] = pagination;
        QuestionStore.emitChange();
    }
    else if (question) {
        _answerQuestion = question;
        QuestionStore.emitChange();
    }
});

export default QuestionStore;
