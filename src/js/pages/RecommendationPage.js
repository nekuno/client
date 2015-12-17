import React, { PropTypes, Component } from 'react';
import * as UserActionCreators from '../actions/UserActionCreators';
import UserRecommendationStore from '../stores/UserRecommendationStore';
import connectToStores from '../utils/connectToStores';

function parseThreadId(params) {
    return params.threadId;
}

/**
 * Requests data from server for current props.
 */
function requestData(props) {
    const { params } = props;
    const threadId = parseThreadId(params);

    UserActionCreators.requestRecommendation(threadId);

}

/**
 * Retrieves state from stores for current props.
 */
function getState(props) {
    const position = UserRecommendationStore.getPosition();
    let userRecommendations = UserRecommendationStore.getThreeUsers(position);
    let nextLink = UserRecommendationStore.getNextLink();
    return {
        userRecommendations,
        nextLink
    };
}

@connectToStores([UserRecommendationStore], getState)
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
                this.props.userRecommendations.current.username to access "main" recommendation name (the one with the big image) <br/>
                this.props.userRecommendations.previous to access "previous" recommendation object <br/>
                this.props.userRecommendations.next to access "main" recommendation object (the one with the big image) <br/>

                <button onClick={function() { UserActionCreators.recommendationsBack() }} > Previous </button>
                <button onClick={function() { UserActionCreators.recommendationsNext() }} > Next </button>
            </div>
        );
    }
}

