import React, { PropTypes, Component } from 'react';
import * as UserActionCreators from '../actions/UserActionCreators';
import RecommendationStore from '../stores/RecommendationStore';
import ThreadStore from '../stores/ThreadStore';
import RecommendationsByThreadStore from '../stores/RecommendationsByThreadStore';
import RecommendationList from '../components/recommendations/RecommendationList';
import RecommendationsTopNavbar from '../components/recommendations/RecommendationsTopNavbar';
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

function initSwiper(thread) {
    // Init slider and store its instance in recommendationsSwiper variable
    let recommendationsSwiper = nekunoApp.swiper('.swiper-container', {
        spaceBetween: '-25%',
        onSlideNextStart: onSlideNextStart,
        onSlidePrevStart: onSlidePrevStart,
        onSlideNextEnd: onSlideNextEnd
    });

    let activeIndex = recommendationsSwiper.activeIndex;

    function onSlideNextStart(swiper) {
        swiper.unlockSwipeToPrev();
        if (swiper.isEnd) {
            swiper.lockSwipeToNext();
            return;
        }
        while (swiper.activeIndex > activeIndex) {
            activeIndex++;
            UserActionCreators.recommendationsNext(thread.id);
        }

    }
    function onSlidePrevStart(swiper) {
        if (swiper.isBeginning) {
            swiper.lockSwipeToPrev();
            return;
        }
        while(swiper.activeIndex < activeIndex) {
            activeIndex --;
            if (activeIndex >= 0) {
                UserActionCreators.recommendationsBack(thread.id);
            }
        }
    }
    function onSlideNextEnd(swiper) {
        if (swiper.isEnd &&
            typeof document.getElementsByClassName('recommendation-' + (activeIndex + 2)[0]) !== 'undefined') {
            swiper.updateSlidesSize();
            swiper.unlockSwipeToNext();
        } else if (swiper.isEnd) {
            swiper.lockSwipeToNext();
        }
    }

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
        category,
        thread
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
        recommendations: PropTypes.array.isRequired,
        thread: PropTypes.object.isRequired
    };

    swiperActive = false;

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
        if (this.props.thread && this.props.recommendations && !this.swiperActive) {
            initSwiper(this.props.thread);
            this.swiperActive = true;
        }
    }

    componentDidUpdate() {
        if (this.props.thread && this.props.recommendations && !this.swiperActive) {
            initSwiper(this.props.thread);
            this.swiperActive = true;
        }
    }

    render() {
        if (!this.props.recommendations || !this.props.thread){
            return null;
        }
        const thread = this.props.thread;
        initSwiper(thread);
        return (
            <div className="view view-main">
                <RecommendationsTopNavbar centerText={''} />
                <div data-page="index" className="page">
                    <div id="page-content" className="recommendation-page">
                        <RecommendationList recommendations={this.props.recommendations} thread={this.props.thread} />
                    </div>
                </div>
            </div>
        );
    }
}

