import { register } from '../dispatcher/Dispatcher';
import { createStore, mergeIntoBag, isInBag } from '../utils/StoreUtils';
import selectn from 'selectn';

const _questions = {};
const _answers = {};
const _userAnswers = {};

const QuestionStore = createStore({
    contains(userId, fields) {
        return isInBag(_questions, userId, fields);
    },

    get(userId) {

        if (!this.contains(userId)){
            return null;
        }
        return _questions[userId];
    },

    getAll() {
        return _questions;
    },

    getAnswers() {
        return _answers;
    },

    getUserAnswers() {
        return _userAnswers;
    }
});

QuestionStore.dispatchToken = register(action => {
    const responseQuestions = selectn('response.entities.questions', action);
    const responseAnswers = selectn('response.entities.answers', action);
    const responseUserAnswers = selectn('response.entities.userAnswers', action);

    if (responseAnswers && !isInBag(_answers, responseAnswers)) {
        mergeIntoBag(_answers, responseAnswers);
    }
    if (responseUserAnswers && !isInBag(_userAnswers, responseUserAnswers)) {
        mergeIntoBag(_userAnswers, responseUserAnswers);
    }
    if (responseQuestions) {
        mergeIntoBag(_questions, responseQuestions);
        QuestionStore.emitChange();
    }
});

export default QuestionStore;
