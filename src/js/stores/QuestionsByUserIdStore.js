import { register, waitFor } from '../dispatcher/Dispatcher';
import ActionTypes from '../constants/ActionTypes';
import selectn from 'selectn';
import UserStore from './UserStore';
import QuestionStore from './QuestionStore';
import {
    createIndexedListStore,
    createListActionHandler
} from '../utils/PaginatedStoreUtils';

const QuestionsByUserIdStore = createIndexedListStore({
    getByUserId(userId) {
        return QuestionStore.get(userId);
    }
});

const handleListAction = createListActionHandler({
    request: ActionTypes.REQUEST_QUESTIONS,
    success: ActionTypes.REQUEST_QUESTIONS_SUCCESS,
    failure: ActionTypes.REQUEST_QUESTIONS_ERROR
});

QuestionsByUserIdStore.dispatchToken = register(action => {
    waitFor([UserStore.dispatchToken, QuestionStore.dispatchToken]);

    const userId = selectn('userId', action);

    if (userId)  {
        handleListAction(
            action,
            QuestionsByUserIdStore.getList(userId),
            QuestionsByUserIdStore.emitChange
        );
    }
    if (action.type == ActionTypes.LOGOUT_USER){
        QuestionsByUserIdStore.removeLists();
    }
});

export default QuestionsByUserIdStore;
