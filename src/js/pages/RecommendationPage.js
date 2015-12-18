import React, { PropTypes, Component } from 'react';
import * as UserActionCreators from '../actions/UserActionCreators';
import RecommendationStore from '../stores/RecommendationStore';
import ThreadStore from '../stores/ThreadStore';
import RecommendationsByThreadStore from '../stores/RecommendationsByThreadStore';
import connectToStores from '../utils/connectToStores';

function parseThreadId(params) {
    return params.threadId;
}

function parseLogin(params) {
    return params.login;
}

/**
 * Requests data from server for current props.
 */
function requestData(props) {
    const { params } = props;
    const threadId = parseThreadId(params);
    const login = parseLogin(params);

    UserActionCreators.requestRecommendationPage(login, threadId);

}
/**
 * Retrieves state from stores for current props.
 */
function getState(props) {
    const threadId = parseThreadId(props.params);
    const thread = ThreadStore.get(threadId);
    if (thread === null || thread.category === undefined){
        return null;
    }
    const recommendationIds = RecommendationsByThreadStore.getRecommendationsFromThread(threadId);

    let recommendations = [];
    const category = thread.category;
    if (category == 'ThreadUsers'){
        recommendations = RecommendationStore.getUserRecommendations(recommendationIds)
    } else {
        recommendations = RecommendationStore.getContentRecommendations(recommendationIds)
    }

    return {
        recommendations,
        category
    }
}

@connectToStores([ThreadStore, RecommendationStore, RecommendationsByThreadStore], getState)
export default class RecommendationPage extends Component {
    static propTypes = {
        // Injected by React Router:
        params: PropTypes.shape({
            threadId: PropTypes.string.isRequired
        }).isRequired,

        // Injected by @connectToStores:
        recommendations: PropTypes.array
    };

    componentWillMount() {
        requestData(this.props);
    }

    componentWillReceiveProps(nextProps) {
        if (parseThreadId(nextProps.params) !== parseThreadId(this.props.params)) {
            requestData(nextProps);
        }
    }

    render() {
        return (
            <div style={{backgroundColor: '#FFFFFF'}}>

                this.props.recommendations to access recommendation objects <br/>
                this.props.category to access thread type (ThreadUsers or ThreadContent) <br/>

                <button onClick={function() { UserActionCreators.recommendationsBack() }} > Previous </button>
                <button onClick={function() { UserActionCreators.recommendationsNext() }} > Next </button>
            </div>
        );
    }
}

