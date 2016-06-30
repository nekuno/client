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
        return this.containsUserRecommendation(id) || this.containsContentRecommendation(id);
    },

    getUserRecommendation(id){

        if (!this.containsUserRecommendation(id)){
            return null;
        }
        return _userRecommendations[id];
    },

    getUserRecommendations(array){
        let _self = this;
        let recommendations = [];
        array.forEach(function(userId){
            recommendations.push(_self.getUserRecommendation(userId));
        });
        return recommendations;
    },

    getContentRecommendation(id){
        if (!this.containsContentRecommendation(id)){
            return null;
        }

        return _contentRecommendations[id];
    },

    getContentRecommendations(array){
        let _self = this;
        let recommendations = [];
        array.forEach(function(userId){
            recommendations.push(_self.getContentRecommendation(userId));
        });
        return recommendations;
    },

    getTotalCount(){
        return _userRecommendations.length + _contentRecommendations.length;
    }
});

RecommendationStore.dispatchToken = register(action => {

    waitFor([ThreadStore.dispatchToken]);

    const { to } = action;

    switch (action.type) {
        case ActionTypes.LIKE_USER_SUCCESS:
            _userRecommendations = setLikedUser(to, _userRecommendations);
            break;
        case ActionTypes.UNLIKE_USER_SUCCESS:
            _userRecommendations = setUnlikedUser(to, _userRecommendations);
            break;
        case ActionTypes.LIKE_CONTENT_SUCCESS:
            _contentRecommendations = setLikedContent(to, _contentRecommendations);
            break;
        case ActionTypes.UNLIKE_CONTENT_SUCCESS:
            _contentRecommendations = setUnlikedContent(to, _contentRecommendations);
            break;
        case ActionTypes.UPDATE_THREAD_SUCCESS:
            const { threadId } = action;
            delete _contentRecommendations[threadId];
            delete _userRecommendations[threadId];
            break;
        case ActionTypes.REQUEST_THREADS_SUCCESS:
            const responseThreads = selectn('response.entities.thread', action);
            let recommendation = null;
            Object.keys(responseThreads).forEach((key) => {
                const thread = responseThreads[key];
                if (thread.category === 'ThreadUsers') {
                    let recommendations = [];
                    let cached = [];
                    Object.keys(thread.cached).forEach((key) => {
                        cached = thread.cached[key];
                        recommendations.push(cached);
                    });
                    mergeAndGetRecommendations(recommendations, _userRecommendations);
                } else {
                    let recommendations = [];
                    let cached = [];
                    Object.keys(thread.cached).forEach((key) => {
                        cached = thread.cached[key];
                        recommendations.push(cached);
                    });
                    mergeAndGetRecommendations(recommendations, _contentRecommendations);
                }
            }) ;

            break;
        case ActionTypes.LOGOUT_USER:
            _userRecommendations = [];
            _contentRecommendations = [];
            break;
        default:
            const recommendations = selectn('response.entities.recommendation', action);

            if (!recommendations) {
                return null;
            }

            const thread = ThreadStore.get(selectn('threadId', action));
            if (!thread) {
                return null;
            }
            const category = thread.category;

            if (!category) {
                return null;
            } else if (category == 'ThreadUsers') {
                _userRecommendations = mergeAndGetRecommendations(recommendations, _userRecommendations);
            } else if (category == 'ThreadContent') {
                _contentRecommendations = mergeAndGetRecommendations(recommendations, _contentRecommendations);
            }
            break;
    }
    RecommendationStore.emitChange();

    function mergeAndGetRecommendations(recommendations, _recommendations) {
        for (let userId in recommendations) {
            if (recommendations.hasOwnProperty(userId)) {
                _recommendations[userId] = recommendations[userId];
            }
        }

        return _recommendations;
    }

    function setLikedUser(userId, _recommendations) {
        if (_recommendations.hasOwnProperty(userId)) {
            _recommendations[userId]['like'] = 1;
        }

        return _recommendations;
    }

    function setUnlikedUser(userId, _recommendations) {
        if (_recommendations.hasOwnProperty(userId)) {
            _recommendations[userId]['like'] = 0;
        }
        return _recommendations;
    }

    function setLikedContent(contentId, _recommendations) {
        if (_recommendations.hasOwnProperty(contentId)) {
            _recommendations[contentId]['rate'] = 1;
        }

        return _recommendations;
    }

    function setUnlikedContent(contentId, _recommendations) {
        if (_recommendations.hasOwnProperty(contentId)) {
            _recommendations[contentId]['rate'] = 0;
        }
        return _recommendations;
    }
});

export default RecommendationStore;