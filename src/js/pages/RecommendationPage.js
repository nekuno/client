import React, { PropTypes, Component } from 'react';
import * as UserActionCreators from '../actions/UserActionCreators';
import UserStore from '../stores/UserStore';
import RecommendationStore from '../stores/RecommendationStore';
import ThreadStore from '../stores/ThreadStore';
import RecommendationsByThreadStore from '../stores/RecommendationsByThreadStore';
import RecommendationList from '../components/recommendations/RecommendationList';
import RecommendationsTopNavbar from '../components/recommendations/RecommendationsTopNavbar';
import connectToStores from '../utils/connectToStores';
import AuthenticatedComponent from '../components/AuthenticatedComponent';

function parseThreadId(params) {
    return params.threadId;
}

function parseId(params) {
    return params.userId;
}

/**
 * Requests data from server for current props.
 */
function requestData(props) {
    const { params } = props;
    const threadId = parseThreadId(params);
    const userId = parseId(params);

    UserActionCreators.requestRecommendationPage(userId, threadId);

}

function initSwiper(thread) {
    // Init slider and store its instance in recommendationsSwiper variable
    let recommendationsSwiper = nekunoApp.swiper('.swiper-container', {
        //spaceBetween: '-25%',
        onSlideNextStart: onSlideNextStart,
        onSlidePrevStart: onSlidePrevStart,
        effect: 'coverflow',

        coverflow: {
            rotate: 50,
            stretch: 0,
            depth: 100,
            modifier: 1,
            slideShadows : false
    }
    });

    let activeIndex = recommendationsSwiper.activeIndex;

    function onSlideNextStart(swiper) {
        if (swiper.isEnd) {
            swiper.updateSlidesSize();
        }
        while (swiper.activeIndex > activeIndex) {
            activeIndex++;
            UserActionCreators.recommendationsNext(thread.id);
        }

    }

    function onSlidePrevStart(swiper) {
        while (swiper.activeIndex < activeIndex) {
            activeIndex--;
            if (activeIndex >= 0) {
                UserActionCreators.recommendationsBack(thread.id);
            }
        }
    }
}

/**
 * Retrieves state from stores for current props.
 */
function getState(props) {
    const threadId = parseThreadId(props.params);
    const thread = ThreadStore.get(threadId);
    const recommendationIds = threadId? RecommendationsByThreadStore.getRecommendationsFromThread(threadId) : [];
    const category = thread? thread.category: null;

    let recommendations = [];
    if (thread && category == 'ThreadUsers'){
        recommendations = RecommendationStore.getUserRecommendations(recommendationIds)
    } else if (thread) {
        recommendations = RecommendationStore.getContentRecommendations(recommendationIds)
    }

    return {
        recommendations,
        category,
        thread
    }
}

@connectToStores([ThreadStore, RecommendationStore, RecommendationsByThreadStore], getState)
export default AuthenticatedComponent(class RecommendationPage extends Component {
    static propTypes = {
        // Injected by React Router:
        params: PropTypes.shape({
            threadId: PropTypes.string.isRequired
        }).isRequired,

        // Injected by @connectToStores:
        recommendations: PropTypes.array.isRequired,
        thread: PropTypes.object.isRequired
    };

    constructor() {
        super();
        this.swiperActive = false;
    }

    componentWillMount() {
        RecommendationsByThreadStore.setPosition(this.props.params.threadId, 0);
        requestData(this.props);
    }

    componentWillReceiveProps(nextProps) {
        if (parseThreadId(nextProps.params) !== parseThreadId(this.props.params)) {
            requestData(nextProps);
        }
    }

    componentDidMount() {
        if (this.props.thread && this.props.recommendations.length > 0 && !this.swiperActive) {
            initSwiper(this.props.thread);
            this.swiperActive = true;
        }
    }

    componentDidUpdate() {
        if (this.props.thread && this.props.recommendations.length > 0 && !this.swiperActive) {
            initSwiper(this.props.thread);
            this.swiperActive = true;
        }
    }

    render() {
        if (!this.props.recommendations || !this.props.thread || !this.props.user){
            return null;
        }
        return (
            <div className="view view-main">
                <RecommendationsTopNavbar centerText={''} />
                <div data-page="index" className="page">
                    <div id="page-content" className="recommendation-page">
                        {this.props.recommendations.length > 0 ?
                            <RecommendationList recommendations={this.props.recommendations} thread={this.props.thread} userId={this.props.user.qnoow_id} />
                            :
                            <div className="loading"><h1>Loading...</h1></div>
                        }
                    </div>
                </div>
            </div>
        );
    }
});

