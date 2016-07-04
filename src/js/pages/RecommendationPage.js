import React, { PropTypes, Component } from 'react';
import RecommendationList from '../components/recommendations/RecommendationList';
import TopNavBar from '../components/ui/TopNavBar';
import EmptyThreadPopup from '../components/recommendations/EmptyThreadPopup';
import EmptyMessage from '../components/ui/EmptyMessage';
import AuthenticatedComponent from '../components/AuthenticatedComponent';
import translate from '../i18n/Translate';
import connectToStores from '../utils/connectToStores';
import * as ThreadActionCreators from '../actions/ThreadActionCreators';
import RecommendationStore from '../stores/RecommendationStore';
import ThreadStore from '../stores/ThreadStore';
import RecommendationsByThreadStore from '../stores/RecommendationsByThreadStore';
import FilterStore from '../stores/FilterStore';

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
    const {params} = props;
    const threadId = parseThreadId(params);
    const userId = parseId(params);

    ThreadActionCreators.requestRecommendationPage(userId, threadId);
    ThreadActionCreators.requestFilters();

}

function initSwiper(thread) {
    // Init slider and store its instance in recommendationsSwiper variable
    let recommendationsSwiper = nekunoApp.swiper('.swiper-container', {
        onSlideNextStart: onSlideNextStart,
        onSlidePrevStart: onSlidePrevStart,
        effect          : 'coverflow',
        slidesPerView   : 'auto',
        coverflow       : {
            rotate      : 30,
            stretch     : 0,
            depth       : 100,
            modifier    : 1,
            slideShadows: false
        },
        centeredSlides  : true,
        grabCursor      : true
    });

    let activeIndex = recommendationsSwiper.activeIndex;

    function onSlideNextStart(swiper) {
        while (swiper.activeIndex > activeIndex) {
            activeIndex++;
            ThreadActionCreators.recommendationsNext(thread.id);
        }

    }

    function onSlidePrevStart(swiper) {
        while (swiper.activeIndex < activeIndex) {
            activeIndex--;
            if (activeIndex >= 0) {
                ThreadActionCreators.recommendationsBack(thread.id);
            }
        }
    }

    return recommendationsSwiper;
}

/**
 * Retrieves state from stores for current props.
 */
function getState(props) {
    const threadId = parseThreadId(props.params);
    const thread = ThreadStore.get(threadId);
    const recommendationIds = threadId ? RecommendationsByThreadStore.getRecommendationsFromThread(threadId) : [];
    const recommendationsReceived = RecommendationsByThreadStore.elementsReceived(threadId);
    const category = thread ? thread.category : null;
    const filters = FilterStore.filters;

    let recommendations = [];
    if (thread && category == 'ThreadUsers') {
        recommendations = RecommendationStore.getUserRecommendations(recommendationIds)
    } else if (thread && category == 'ThreadContent') {
        recommendations = RecommendationStore.getContentRecommendations(recommendationIds);
    }

    return {
        recommendations,
        recommendationsReceived,
        category,
        thread,
        filters
    }
}

@AuthenticatedComponent
@translate('RecommendationPage')
@connectToStores([ThreadStore, RecommendationStore, RecommendationsByThreadStore, FilterStore], getState)
export default class RecommendationPage extends Component {

    static propTypes = {
        // Injected by React Router:
        params         : PropTypes.shape({
            threadId: PropTypes.string.isRequired
        }).isRequired,
        // Injected by @AuthenticatedComponent
        user           : PropTypes.object.isRequired,
        // Injected by @translate:
        strings: PropTypes.object,
        // Injected by @connectToStores:
        recommendations: PropTypes.array.isRequired,
        recommendationsReceived: PropTypes.bool.isRequired,
        thread         : PropTypes.object.isRequired,
        filters        : PropTypes.object
    };

    static contextTypes = {
        history: PropTypes.object.isRequired
    };

    constructor() {
        super();

        this.deleteThread = this.deleteThread.bind(this);
        this.editThread = this.editThread.bind(this);

        this.state = {swiper: null};
    }

    componentWillMount() {
        RecommendationsByThreadStore.setPosition(this.props.params.threadId, 0);
        if (this.props.recommendations.length === 0) {
            requestData(this.props);
        }
    }

    componentWillReceiveProps(nextProps) {
        if (parseThreadId(nextProps.params) !== parseThreadId(this.props.params)) {
            requestData(nextProps);
        }
    }

    componentDidMount() {
        if (this.props.thread && this.props.recommendations.length > 0 && !this.state.swiper) {
            this.state = {
                swiper: initSwiper(this.props.thread)
            };
        }
    }

    componentDidUpdate() {
        if (this.props.recommendationsReceived && this.props.recommendations.length == 0) {
            nekunoApp.popup('.popup-empty-thread');
        }

        if (!this.props.thread || this.props.recommendations.length == 0) {
            return;
        }
        if (!this.state.swiper) {
            this.state = {
                swiper: initSwiper(this.props.thread)
            };
        } else {
            this.state.swiper.updateSlidesSize();
        }
    }

    deleteThread() {
        nekunoApp.confirm(this.props.strings.confirmDelete, () => {
            const threadId = this.props.thread.id;
            const history = this.context.history;
            ThreadActionCreators.deleteThread(threadId)
                .then(function() {
                    history.pushState(null, '/threads');
                });
        });
    }

    editThread() {
        this.context.history.pushState(null, `edit-thread/${this.props.thread.id}`);
    }

    render() {
        const {recommendations, thread, user, filters, recommendationsReceived, strings} = this.props;
        return (
            <div className="view view-main">
                <TopNavBar leftIcon={'left-arrow'} centerText={''} rightIcon={'edit'} secondRightIcon={'delete'} onRightLinkClickHandler={this.editThread} onSecondRightLinkClickHandler={this.deleteThread}/>
                <div className="page">
                    <div id="page-content" className="recommendation-page">
                        {recommendationsReceived && recommendations.length > 0 && thread.filters && filters && Object.keys(filters).length > 0 ?
                            <RecommendationList recommendations={recommendations} thread={thread} userId={user.id} 
                                                filters={thread.category === 'ThreadUsers' ? filters.userFilters : filters.contentFilters}/> 
                            : !recommendationsReceived ? <EmptyMessage text={strings.loadingMessage} loadingGif={true} /> : ''
                        }
                    </div>
                </div>
                {recommendationsReceived && thread.id ? <EmptyThreadPopup threadId={thread.id}/> : ''}
            </div>
        );
    }
};

RecommendationPage.defaultProps = {
    strings: {
        loadingMessage: 'Loading recommendations',
        confirmDelete : 'Are you sure you want to delete this thread?'
    }
};