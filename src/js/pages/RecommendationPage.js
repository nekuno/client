import React, { PropTypes, Component } from 'react';
import RecommendationList from '../components/recommendations/RecommendationList';
import TopNavBar from '../components/ui/TopNavBar';
import EmptyMessage from '../components/ui/EmptyMessage';
import AuthenticatedComponent from '../components/AuthenticatedComponent';
import translate from '../i18n/Translate';
import connectToStores from '../utils/connectToStores';
import * as ThreadActionCreators from '../actions/ThreadActionCreators';
import RecommendationStore from '../stores/RecommendationStore';
import ThreadStore from '../stores/ThreadStore';
import FilterStore from '../stores/FilterStore';
import WorkersStore from '../stores/WorkersStore';

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
    const recommendations = RecommendationStore.get(threadId);
    if (!recommendations || recommendations.length === 0) {
        ThreadActionCreators.requestRecommendationPage(userId, threadId);
        ThreadActionCreators.requestFilters();
    }

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
            if (activeIndex == RecommendationStore.getLength(thread.id) - 15) {
                ThreadActionCreators.recommendationsNext(thread.id);
            }
        }

    }

    function onSlidePrevStart(swiper) {
        while (swiper.activeIndex < activeIndex) {
            if (activeIndex >= 0) {
                activeIndex--;
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
    let thread = ThreadStore.get(threadId);
    if (Object.keys(thread).length != 0) {
        thread.isEmpty = RecommendationStore.isEmpty(thread.id);
    }
    const category = thread ? thread.category : null;
    const filters = FilterStore.filters;
    const isJustRegistered = WorkersStore.isJustRegistered();

    const recommendations = threadId && RecommendationStore.get(threadId) ? RecommendationStore.get(threadId) : [];

    return {
        recommendations,
        category,
        thread,
        filters,
        isJustRegistered
    }
}

@AuthenticatedComponent
@translate('RecommendationPage')
@connectToStores([ThreadStore, RecommendationStore, FilterStore], getState)
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
        requestData(this.props);
    }

    componentWillReceiveProps(nextProps) {
        if (parseThreadId(nextProps.params) !== parseThreadId(this.props.params)) {
            requestData(nextProps);
        }
        if (RecommendationStore.replaced(parseThreadId(nextProps.params))) {
            nekunoApp.confirm(nextProps.strings.confirmReplace, () => {
                // No action needed
            }, () => {
                window.setTimeout(() => ThreadActionCreators.addPrevRecommendation(parseThreadId(nextProps.params)), 0);
            });
        }
    }

    componentDidMount() {
        if (this.props.isJustRegistered) {
            nekunoApp.alert(this.props.strings.processingThread);
        }
        if (this.props.thread && this.props.recommendations.length > 0 && !this.state.swiper) {
            this.state = {
                swiper: initSwiper(this.props.thread)
            };
        }
    }

    componentDidUpdate() {
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
        const {recommendations, thread, user, filters, strings} = this.props;
        if (Object.keys(thread).length == 0) {
            return null;
        }
        return (
            <div className="view view-main">
                <TopNavBar leftIcon={'left-arrow'} centerText={''} rightIcon={'edit'} secondRightIcon={'delete'} onRightLinkClickHandler={this.editThread} onSecondRightLinkClickHandler={this.deleteThread}/>
                <div className="page">
                    <div id="page-content" className="recommendation-page">
                        {recommendations.length > 0 && filters && Object.keys(filters).length > 0 ?
                            <RecommendationList recommendations={recommendations} thread={thread} userId={user.id} 
                                                filters={thread.category === 'ThreadUsers' ? filters.userFilters : filters.contentFilters}/> 
                            : !recommendations.length > 0 ? <EmptyMessage text={strings.loadingMessage} loadingGif={true} /> : ''
                        }
                    </div>
                </div>
            </div>
        );
    }
};

RecommendationPage.defaultProps = {
    strings: {
        loadingMessage: 'Loading recommendations',
        confirmDelete : 'Are you sure you want to delete this thread?',
        processingThread: 'These results are provisional, we´ll finish improving them for you soon.',
        confirmReplace: 'We have improve your recommendations. Do you whant to reload them?'
    }
};