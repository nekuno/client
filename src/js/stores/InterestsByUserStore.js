import { register, waitFor } from '../dispatcher/Dispatcher';
import ActionTypes from '../constants/ActionTypes';
import UserStore from '../stores/UserStore';
import InterestStore from '../stores/InterestStore';
import {
    createIndexedListStore,
    createListActionHandler
} from '../utils/PaginatedStoreUtils';

let _position = [];

const InterestsByUserStore = createIndexedListStore({

    getInterestsFromUser(userId) {

        const user = UserStore.get(userId);
        if (!user){
            return null;
        }

        return this.getIds(userId);
    },

    setPosition(interestId, newPosition){
        _position[interestId] = newPosition;
    },

    getPosition(interestId){
        return _position[interestId];
    },

    advancePosition(interestId, number = 1){
        _position[interestId] += number;
    }
});

const handleListAction = createListActionHandler({
    request: ActionTypes.REQUEST_OWN_INTERESTS,
    success: ActionTypes.REQUEST_OWN_INTERESTS_SUCCESS,
    failure: ActionTypes.REQUEST_OWN_INTERESTS_ERROR
});

register(action => {

    waitFor([UserStore.dispatchToken, InterestStore.dispatchToken]);

    const { userId } = action;
    if (action.type == ActionTypes.REQUEST_NEXT_OWN_INTERESTS){
        InterestsByUserStore.advancePosition(userId, 1);
    }

    if (userId) {
        handleListAction(
            action,
            InterestsByUserStore.getList(userId),
            InterestsByUserStore.emitChange
        );
    }

    if (action.type == ActionTypes.LOGOUT_USER){
        InterestsByUserStore.removeLists();
        _position = [];
    }
});

export default InterestsByUserStore;