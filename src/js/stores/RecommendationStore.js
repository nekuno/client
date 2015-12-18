import { register, waitFor } from '../dispatcher/Dispatcher';
import {
    createListActionHandler
} from '../utils/PaginatedStoreUtils';
import {createStore} from '../utils/StoreUtils';
import selectn from 'selectn';
import ActionTypes from '../constants/ActionTypes';
import ThreadStore from '../stores/ThreadStore'

let _userRecommendations = [];
let _contentRecommendations = [];

const RecommendationStore = createStore({

    containsUserRecommendation(id){
        return (id in _userRecommendations)
    },

    containsContentRecommendation(id){
        return (id in _contentRecommendations)
    },

    contains(id) {
        return RecommendationStore.containsUserRecommendation(id) || RecommendationStore.containsContentRecommendation(id);
    },

    getUserRecommendation(id){

        if (!RecommendationStore.containsUserRecommendation(id)){
            return null;
        }
        return _userRecommendations[id];
    },

    getUserRecommendations(array){
        let recommendations = [];
        array.forEach(function(userId){
            recommendations.push( RecommendationStore.getUserRecommendation(userId));
        });
        return recommendations;
    },

    getContentRecommendation(id){
        if (!RecommendationStore.containsContentRecommendation(id)){
            return null;
        }

        return _contentRecommendations[id];
    },

    getContentRecommendations(array){
        let recommendations = [];
        array.forEach(function(userId){
            recommendations.push( RecommendationStore.getContentRecommendation(userId));
        });
        return recommendations;
    },

    getTotalCount(){
        return _userRecommendations.length + _contentRecommendations.length;
    }
});

RecommendationStore.dispatchToken = register(action => {

    waitFor([ThreadStore.dispatchToken]);

    const recommendations = selectn('response.entities.recommendation', action);

    if (!recommendations){
        return null;
    }

    const thread = ThreadStore.get(selectn('threadId', action));
    if (!thread) {
        return null;
    }
    const category = thread.category;

    if (!category){
        return null;
    } else if (category == 'ThreadUsers') {
        for (let userId in recommendations) {
            _userRecommendations[userId] = recommendations[userId];
        }
    } else if (category == 'ThreadContent'){
        for (let userId in recommendations) {
            _contentRecommendations[userId] = recommendations[userId];
        }
    }

    RecommendationStore.emitChange();
});

export default RecommendationStore;