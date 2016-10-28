import React, { PropTypes, Component } from 'react';
import { ORIGIN_CONTEXT } from '../constants/Constants';
import RecommendationList from '../components/recommendations/RecommendationList';
import TopNavBar from '../components/ui/TopNavBar';
import ThreadToolBar from '../components/ui/ThreadToolBar';
import EmptyMessage from '../components/ui/EmptyMessage';
import * as UserActionCreators from '../actions/UserActionCreators'
import AuthenticatedComponent from '../components/AuthenticatedComponent';
import translate from '../i18n/Translate';
import connectToStores from '../utils/connectToStores';
import * as ThreadActionCreators from '../actions/ThreadActionCreators';
import RecommendationStore from '../stores/RecommendationStore';
import ThreadStore from '../stores/ThreadStore';
import FilterStore from '../stores/FilterStore';
import WorkersStore from '../stores/WorkersStore';
import LikeStore from '../stores/LikeStore';

function parseThreadId(params) {
    return params.threadId;
}

function parseId(params) {
    return params.id;
}

/**
 * Requests data from server for current props.
 */
function requestData(props) {
    const {params} = props;
    const threadId = parseThreadId(params);
    const userId = parseId(props.user);
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
        allowSwipeToPrev: false,
        swipeHandler    : '.thread-toolbar-item.center',
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
    const userId = parseId(props.user);
    let thread = ThreadStore.get(threadId);
    if (Object.keys(thread).length != 0) {
        thread.isEmpty = RecommendationStore.isEmpty(thread.id);
    }
    const category = thread ? thread.category : null;
    const filters = FilterStore.filters;
    const isJustRegistered = WorkersStore.isJustRegistered();

    const recommendations = threadId && RecommendationStore.get(threadId) ? RecommendationStore.get(threadId) : [];

    return {
        userId,
        recommendations,
        category,
        thread,
        filters,
        isJustRegistered
    }
}

@AuthenticatedComponent
@translate('RecommendationPage')
@connectToStores([ThreadStore, RecommendationStore, FilterStore, LikeStore], getState)
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
        this.ignore = this.ignore.bind(this);
        this.dislike = this.dislike.bind(this);
        this.like = this.like.bind(this);
        this.onShare = this.onShare.bind(this);
        this.onShareSuccess = this.onShareSuccess.bind(this);
        this.onShareError = this.onShareError.bind(this);

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

    ignore() {
        const activeIndex = this.state.swiper.activeIndex;
        const {userId, recommendations, thread} = this.props;
        const recommendation = recommendations[activeIndex];

        if (thread.category === 'ThreadUsers') {
            UserActionCreators.ignoreUser(userId, recommendation.id);
        } else if (thread.category === 'ThreadContent') {
            UserActionCreators.ignoreContent(userId, recommendation.content.id, ORIGIN_CONTEXT.RECOMMENDATIONS_PAGE, thread.name);
        }
        this.state.swiper.slideNext();
    }

    dislike() {
        const activeIndex = this.state.swiper.activeIndex;
        const {userId, recommendations, thread} = this.props;
        const recommendation = recommendations[activeIndex];

        if (thread.category === 'ThreadUsers') {
            if (recommendation.like === -1) {
                UserActionCreators.deleteLikeUser(userId, recommendation.id);
            } else {
                UserActionCreators.dislikeUser(userId, recommendation.id);
            }
        } else if (thread.category === 'ThreadContent') {
            if (recommendation.rate === -1) {
                UserActionCreators.deleteRateContent(userId, recommendation.content.id);
            } else {
                UserActionCreators.dislikeContent(userId, recommendation.content.id, ORIGIN_CONTEXT.RECOMMENDATIONS_PAGE, thread.name);
            }
        }
    }

    like() {
        const activeIndex = this.state.swiper.activeIndex;
        const {userId, recommendations, thread} = this.props;
        const recommendation = recommendations[activeIndex];

        if (thread.category === 'ThreadUsers') {
            if (recommendation.like && recommendation.like !== -1) {
                UserActionCreators.deleteLikeUser(userId, recommendation.id);
            } else {
                UserActionCreators.likeUser(userId, recommendation.id);
            }
        } else if (thread.category === 'ThreadContent') {
            if (recommendation.rate && recommendation.rate !== -1) {
                UserActionCreators.deleteRateContent(userId, recommendation.content.id);
            } else {
                UserActionCreators.likeContent(userId, recommendation.content.id, ORIGIN_CONTEXT.RECOMMENDATIONS_PAGE, thread.name);
            }
        }
    }

    onShare() {
        const activeIndex = this.state.swiper.activeIndex;
        const recommendation = this.props.recommendations[activeIndex];
        if (window.cordova) {
            // this is the complete list of currently supported params you can pass to the plugin (all optional)
            var options = {
                //message: 'share this', // not supported on some apps (Facebook, Instagram)
                subject: recommendation.content.title, // fi. for email
                url: recommendation.content.url
                //chooserTitle: 'Pick an app' // Android only, you can override the default share sheet title
            };
            window.plugins.socialsharing.shareWithOptions(options, this.onShareSuccess, this.onShareError);
        } else {
            window.prompt(this.props.strings.copyToClipboard, recommendation.content.url);
            this.onShareSuccess();
        }
    }

    onShareSuccess() {
        const activeIndex = this.state.swiper.activeIndex;
        const {userId, recommendations, thread} = this.props;
        const recommendation = recommendations[activeIndex];
        if (thread.category === 'ThreadContent') {
            if (!recommendation.rate && recommendation.rate !== -1) {
                UserActionCreators.likeContent(userId, recommendation.content.id, ORIGIN_CONTEXT.RECOMMENDATIONS_PAGE, thread.name);
            }
        }
    }

    onShareError() {
        nekunoApp.alert(this.props.strings.shareError)
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
                <ThreadToolBar recommendation={this.state.swiper ? recommendations[this.state.swiper.activeIndex] : null} like={this.like} dislike={this.dislike} ignore={this.ignore} category={thread.category} share={this.onShare}/>
            </div>
        );
    }
};

RecommendationPage.defaultProps = {
    strings: {
        loadingMessage  : 'Loading recommendations',
        confirmDelete   : 'Are you sure you want to delete this thread?',
        processingThread: 'These results are provisional, we´ll finish improving them for you soon.',
        confirmReplace  : 'We have improve your recommendations. Do you whant to reload them?',
        copyToClipboard : 'Copy to clipboard: Ctrl+C, Enter',
        shareError      : 'An error occurred sharing the content'
    }
};