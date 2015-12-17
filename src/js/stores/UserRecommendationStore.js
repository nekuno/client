import { register } from '../dispatcher/Dispatcher';
import { createStore, mergeIntoBag, isInBag } from '../utils/StoreUtils';
import selectn from 'selectn';
import ActionTypes from '../constants/ActionTypes'

let _users = [];
let _current = 0;
let _nextLink = "";

const UserRecommendationStore = createStore({

    contains(id) {
        return isInBag(_users, id);
    },

    getNextLink() {
        return _nextLink;
    },

    getPosition() {
        return _current;
    },

    getLastTwenty() {
        return _users.slice(Math.max(_users.length - 20, 0));
    },

    getThreeUsers() {
        return {previous: this.getUser(this.getPosition() - 1 ),
                current: this.getUser(this.getPosition()),
                next: this.getUser(this.getPosition() + 1 )};
    },

    getUser(position){
        if (!this.contains(position)){
            return null;
        }

        return _users[position];
    },

    getCount(){
        return _users.length;
    },

    goTo(position) {
        _current = position;
        return this.getPosition();
    }
});

UserRecommendationStore.dispatchToken = register(action => {

    if (action.type === ActionTypes.RECOMMENDATIONS_PREV){
        if (UserRecommendationStore.getPosition() == 0){
            return;
        }
        UserRecommendationStore.goTo(UserRecommendationStore.getPosition() - 1);
        UserRecommendationStore.emitChange();
    }

    if (action.type === ActionTypes.RECOMMENDATIONS_NEXT){
        UserRecommendationStore.goTo(UserRecommendationStore.getPosition() + 1);
        UserRecommendationStore.emitChange();
    }

    const responseUsers = selectn('response.entities.recommendation', action);

    //this is triggered when not asked for this?
    if (!responseUsers){
        return;
    }
    let orderedUsers = [];
    for (let id in responseUsers) {
        orderedUsers.push(responseUsers[id]);
    }
    //TODO: Order by similarity or matching
    orderedUsers.sort(compareBySimilarity);

    _nextLink = selectn('response.entities.pagination.undefined.nextLink', action);
    _users = _users.concat(orderedUsers);
    UserRecommendationStore.emitChange();
});

function compareBySimilarity(a,b) {
    if (a.similarity > b.similarity)
        return -1;
    if (a.similarity < b.similarity)
        return 1;
    return 0;
};

export default UserRecommendationStore;