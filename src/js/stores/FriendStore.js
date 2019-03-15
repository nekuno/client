import ActionTypes from '../constants/ActionTypes';
import BaseStore from './BaseStore';

class FriendStore extends BaseStore {

    setInitial() {
        this._friends = [];
        this._order = 'compatibility';
        this._loading = false;
    }

    _registerToActions(action) {
        super._registerToActions(action);

        switch(action.type) {
            case ActionTypes.REQUEST_FRIENDS:
                this._loading = true;
                this.emitChange();
                break;
            case ActionTypes.REQUEST_FRIENDS_SUCCESS:
                this._merge(action.response);
                this._orderFriends();
                this._loading = false;
                this.emitChange();
                break;
            case ActionTypes.CHANGE_FRIENDS_ORDER:
                this._order = action.order;
                this._orderFriends();
                this.emitChange();
                break;
            default:
                break;
        }
    }

    _merge(friends)
    {
        friends.forEach((friend) => {
            this._friends.push(friend);
        });
    }

    _orderFriends()
    {
        this._friends = this._friends.sort(this._compare.bind(this));
    }

    _compare(friend1, friend2)
    {
        let comparison = 0;
        switch(this._order) {
            case 'compatibility':
                comparison = this._orderByCompatibility(friend1, friend2);
                break;
                case 'similarity':
                comparison = this._orderBySimilarity(friend1, friend2);
                break;
                case 'coincidences':
                comparison = this._orderByCoincidences(friend1, friend2);
                break;
        }

        return comparison;
    }

    _orderByCompatibility(recommendation1, recommendation2)
    {
        if (recommendation1.matching < recommendation2.matching){
            return -1;
        }

        if (recommendation1.matching > recommendation2.matching){
            return 1;
        }

        return 0;
    }

    _orderBySimilarity(recommendation1, recommendation2)
    {
        if (recommendation1.similarity < recommendation2.similarity){
            return -1;
        }

        if (recommendation1.similarity > recommendation2.similarity){
            return 1;
        }

        return 0;
    }

    _orderByCoincidences(recommendation1, recommendation2)
    {
        if (recommendation1.sharedLinks < recommendation2.sharedLinks){
            return -1;
        }

        if (recommendation1.sharedLinks > recommendation2.sharedLinks){
            return 1;
        }

        return 0;
    }

    get(userId) {
        return this._friends[userId];
    }

    get order() {
        return this._order;
    }

    get friends() {
        return this._friends;
    }

    get loading() {
        return this._loading;
    }

}

export default new FriendStore();
