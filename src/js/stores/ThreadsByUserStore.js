import { register, waitFor } from '../dispatcher/Dispatcher';
import ActionTypes from '../constants/ActionTypes';
import UserStore from '../stores/UserStore';
import ThreadStore from '../stores/ThreadStore';
import LoginStore from '../stores/LoginStore';
import {
    createIndexedListStore,
    createListActionHandler
} from '../utils/PaginatedStoreUtils';

let _position = [];

const ThreadsByUserStore = createIndexedListStore({

    getThreadsFromUser(userId) {

        const user = UserStore.get(userId);
        if (!user){
            //Shouldn´t happen : UserActionCreators.requestThreads checks this
            return null;
        }

        return this.getIds(userId);

    },

    setPosition(threadId, newPosition){
        _position[threadId] = newPosition;
    },

    getPosition(threadId){
        return _position[threadId];
    },

    advancePosition(threadId, number = 1){
        _position[threadId] += number;
    }
});

const handleListAction = createListActionHandler({
    request: ActionTypes.REQUEST_THREADS,
    success: ActionTypes.REQUEST_THREADS_SUCCESS,
    failure: ActionTypes.REQUEST_THREADS_ERROR
});

register(action => {

    waitFor([UserStore.dispatchToken,ThreadStore.dispatchToken]);

    let { userId } = action;

    switch(action.type){
        case ActionTypes.THREADS_NEXT:
            ThreadsByUserStore.advancePosition(userId, 1);
            break;
        case ActionTypes.THREADS_PREV:
            if (ThreadsByUserStore.getPosition(userId) > 0){
                ThreadsByUserStore.advancePosition(userId, -1);
            }
            break;
        case ActionTypes.CREATE_THREAD_SUCCESS:
            let list = ThreadsByUserStore.getList(userId);
            list._ids.unshift(action.response.id);
            ThreadsByUserStore.emitChange();
            break;
        case ActionTypes.DELETE_THREAD_SUCCESS:
            userId = LoginStore.user.id;
            let delete_list = ThreadsByUserStore.getList(userId);
            delete_list.remove(action.threadId);
            ThreadsByUserStore.emitChange();
            break;
        case ActionTypes.LOGOUT_USER:
            _position = [];
            ThreadsByUserStore.removeLists();
            break;
        default:
            break;
    }

    if (userId) {
        handleListAction(
            action,
            ThreadsByUserStore.getList(userId),
            ThreadsByUserStore.emitChange
        );
    }


});

export default ThreadsByUserStore;