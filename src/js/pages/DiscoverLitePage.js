import React, { PropTypes, Component } from 'react';
import { ORIGIN_CONTEXT } from '../constants/Constants';
import RecommendationList from '../components/recommendations/RecommendationList';
import TopNavBar from '../components/ui/TopNavBar';
import ThreadToolBar from '../components/ui/ThreadToolBar';
import EmptyMessage from '../components/ui/EmptyMessage';
import * as UserActionCreators from '../actions/UserActionCreators';
import GalleryPhotoActionCreators from '../actions/GalleryPhotoActionCreators';
import * as QuestionActionCreators from '../actions/QuestionActionCreators';
import * as InterestsActionCreators from '../actions/InterestsActionCreators';
import AuthenticatedComponent from '../components/AuthenticatedComponent';
import translate from '../i18n/Translate';
import connectToStores from '../utils/connectToStores';
import * as ThreadActionCreators from '../actions/ThreadActionCreators';
import RecommendationStore from '../stores/RecommendationStore';
import ThreadStore from '../stores/ThreadStore';
import FilterStore from '../stores/FilterStore';
import WorkersStore from '../stores/WorkersStore';
import LikeStore from '../stores/LikeStore';
import ProfileStore from '../stores/ProfileStore';
import ComparedStatsStore from '../stores/ComparedStatsStore';
import GalleryPhotoStore from '../stores/GalleryPhotoStore';
import QuestionStore from '../stores/QuestionStore';
import InterestStore from '../stores/InterestStore';

function parseThreadId(thread) {
    return thread.id;
}

function parseId(user) {
    return user.id;
}

/**
 * Requests data from server for current props.
 */
function requestData(props) {
    const userId = parseId(props.user);
    if (ThreadStore.noThreads() || ThreadStore.isAnyPopular()) {
        ThreadActionCreators.requestThreadPage(userId);
        UserActionCreators.requestOwnProfile(userId);
        ThreadActionCreators.requestFilters();
        QuestionActionCreators.requestQuestions(userId);
        UserActionCreators.requestMetadata();
    }
}

function requestRecommendationData(props, activeIndex) {
     if (props.thread.category == "ThreadUsers") {
        const userId = parseId(props.user);
        const otherUserRecommendation = props.recommendations.find((recommendation, index) => index === activeIndex) || null;
        if (otherUserRecommendation) {
            const otherUserId = parseInt(otherUserRecommendation.id);
            UserActionCreators.requestComparedStats(userId, otherUserId);
            GalleryPhotoActionCreators.getOtherPhotos(otherUserId);
            QuestionActionCreators.requestComparedQuestions(userId, otherUserId, ['showOnlyCommon']);
            InterestsActionCreators.requestComparedInterests(userId, otherUserId, 'Link', 1);
        }
    }
}

function initSwiper(props, index = 0) {
    // Init slider
    let recommendationsSwiper = nekunoApp.swiper('#recommendations-swiper-container', {
        initialSlide    : index,
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
        allowSwipeToPrev: true,
        swipeHandler    : '.thread-toolbar-item.center',
    });

    let activeIndex = recommendationsSwiper.activeIndex;
    let requestRecommendationsTimeout = null;

    getRecommendationData();

    function onSlideNextStart(swiper) {
        while (swiper.activeIndex > activeIndex) {
            activeIndex++;
            if (activeIndex == RecommendationStore.getLength(parseThreadId(props.thread)) - 15) {
                ThreadActionCreators.recommendationsNext(parseThreadId(props.thread));
            }
        }
        getRecommendationData();
    }

    function onSlidePrevStart(swiper) {
        while (swiper.activeIndex < activeIndex) {
            if (activeIndex >= 0) {
                activeIndex--;
            }
        }
    }

    function getRecommendationData() {
        if (!requestRecommendationsTimeout) {
            requestRecommendationsTimeout = window.setTimeout(() => {
                requestRecommendationData(props, activeIndex);
                requestRecommendationsTimeout = null;
            }, 1000);
        }
    }

    return recommendationsSwiper;
}

/**
 * Retrieves state from stores for current props.
 */
function getState(props) {
    const userId = parseId(props.user);
    let category, isJustRegistered, isLoadingComparedQuestions, isLoadingComparedInterests = null;
    let filters = {};
    let recommendations = [];
    const thread = ThreadStore.getAll().find((thread) => {
        recommendations = RecommendationStore.get(parseThreadId(thread)) || [];
        return recommendations.length > 0;
    }) || {};
    if (parseThreadId(thread)) {
        if (Object.keys(thread).length != 0) {
            thread.isEmpty = RecommendationStore.isEmpty(parseThreadId(thread));
        }
        category = thread ? thread.category : null;
        filters = FilterStore.filters;
        isJustRegistered = WorkersStore.isJustRegistered();
        isLoadingComparedQuestions = QuestionStore.isLoadingComparedQuestions();
        isLoadingComparedInterests = InterestStore.isLoadingComparedInterests();

        recommendations = RecommendationStore.get(parseThreadId(thread)) ? RecommendationStore.get(parseThreadId(thread)) : [];
    }
    return {
        userId,
        recommendations,
        category,
        thread,
        filters,
        isJustRegistered,
        isLoadingComparedQuestions,
        isLoadingComparedInterests
    }
}

@AuthenticatedComponent
@translate('DiscoverLitePage')
@connectToStores([ThreadStore, RecommendationStore, FilterStore, LikeStore, ProfileStore, ComparedStatsStore, GalleryPhotoStore, QuestionStore, InterestStore], getState)
export default class DiscoverLitePage extends Component {

    static propTypes = {
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

        this.editThread = this.editThread.bind(this);
        this.ignore = this.ignore.bind(this);
        this.dislike = this.dislike.bind(this);
        this.like = this.like.bind(this);
        this.handleScroll = this.handleScroll.bind(this);
        this.onOtherUserTabClick = this.onOtherUserTabClick.bind(this);

        this.state = {
            swiper: null,
            currentTab: null
        };
    }

    componentWillMount() {
        requestData(this.props);
    }

    componentWillReceiveProps(nextProps) {
        if (RecommendationStore.replaced(parseThreadId(nextProps.thread))) {
            nekunoApp.confirm(nextProps.strings.confirmReplace, () => {
                // No action needed
            }, () => {
                window.setTimeout(() => ThreadActionCreators.addPrevRecommendation(parseThreadId(nextProps.thread)), 0);
            });
        }
    }

    componentDidMount() {
        if (this.props.thread.id && this.props.recommendations.length > 0 && !this.state.swiper) {
            const index = RecommendationStore.getSavedIndex();
            this.state = {
                swiper: initSwiper(this.props, index)
            };
        }
    }

    componentDidUpdate() {
        if (!this.props.thread.id || this.props.recommendations.length == 0) {
            return;
        }
        if (!this.state.swiper) {
            const index = RecommendationStore.getSavedIndex();
            this.setState({
                swiper: initSwiper(this.props, index)
            });
        } else {
            this.state.swiper.updateSlidesSize();
        }
    }

    componentWillUnmount() {
        ThreadActionCreators.saveIndex(this.state.swiper.activeIndex);
    }

    editThread() {
        this.context.history.pushState(null, `edit-thread/${parseThreadId(this.props.thread)}`);
    }

    ignore() {
        const activeIndex = this.state.swiper.activeIndex;
        const {userId, recommendations, thread} = this.props;
        const recommendation = recommendations[activeIndex];

        if (thread.category === 'ThreadUsers') {
            UserActionCreators.ignoreUser(userId, recommendation.id, ORIGIN_CONTEXT.RECOMMENDATIONS_PAGE, thread.name);
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
                UserActionCreators.dislikeUser(userId, recommendation.id, ORIGIN_CONTEXT.RECOMMENDATIONS_PAGE, thread.name);
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
                UserActionCreators.likeUser(userId, recommendation.id, ORIGIN_CONTEXT.RECOMMENDATIONS_PAGE, thread.name);
            }
        } else if (thread.category === 'ThreadContent') {
            if (recommendation.rate && recommendation.rate !== -1) {
                UserActionCreators.deleteRateContent(userId, recommendation.content.id);
            } else {
                UserActionCreators.likeContent(userId, recommendation.content.id, ORIGIN_CONTEXT.RECOMMENDATIONS_PAGE, thread.name);
            }
        }
    }

    handleScroll() {
        const {recommendations, userId, isLoadingComparedQuestions, isLoadingComparedInterests} = this.props;
        const {swiper, currentTab} = this.state;
        const activeIndex = swiper.activeIndex;
        const recommendation = recommendations[activeIndex];
        let pagination = null;
        switch (currentTab) {
            case 'questions':
                pagination = QuestionStore.getPagination(recommendation.id);
                break;
            case 'interests':
                pagination = InterestStore.getPagination(recommendation.id);
                break;
        }

        let nextLink = pagination && pagination.hasOwnProperty('nextLink') ? pagination.nextLink : null;
        let offsetTop = parseInt(document.getElementsByClassName('view')[0].scrollTop + document.getElementsByClassName('view')[0].offsetHeight);
        let offsetTopMax = parseInt(document.getElementsByClassName('paginated-' + recommendation.id)[0].offsetHeight) + 700;

        if (pagination && nextLink && offsetTop >= offsetTopMax) {
            document.getElementsByClassName('view')[0].removeEventListener('scroll', this.handleScroll);
            if (currentTab == 'questions' && !isLoadingComparedQuestions) {
                QuestionActionCreators.requestNextComparedQuestions(userId, recommendation.id, nextLink);
            } else if (currentTab == 'interests' && !isLoadingComparedInterests) {
                InterestsActionCreators.requestComparedInterests(userId, recommendation.id, 'Link', 1, nextLink);
            }
        }
    }

    onOtherUserTabClick(currentTab) {
        this.setState({currentTab: currentTab});
    }

    render() {
        const {recommendations, thread, user, filters, strings} = this.props;
        return (
            <div className="view view-main" onScroll={this.state.currentTab ? this.handleScroll : null}>
                {Object.keys(thread).length > 0 ?
                    <TopNavBar leftMenuIcon={true} centerText={strings.discover} rightIcon={'edit'} onRightLinkClickHandler={this.editThread}/>
                    : <TopNavBar leftMenuIcon={true} centerText={strings.discover}/>}
                <div className="page">
                    <div id="page-content" className="recommendation-page lite">
                        {Object.keys(thread).length > 0 && recommendations.length > 0 && filters && Object.keys(filters).length > 0 ?
                            <RecommendationList recommendations={recommendations} thread={thread} userId={user.id} 
                                                filters={thread.category === 'ThreadUsers' ? filters.userFilters : filters.contentFilters}
                                                ownPicture={user.photo.thumbnail.small || null}
                                                currentTab={this.state.currentTab}
                                                onTabClick={this.onOtherUserTabClick}
                            />
                            : <EmptyMessage text={strings.loadingMessage} loadingGif={true} />
                        }
                    </div>
                </div>
                {recommendations.length > 0 && filters && Object.keys(filters).length > 0 ?
                    <ThreadToolBar recommendation={this.state.swiper ? recommendations[this.state.swiper.activeIndex] : null} like={this.like} dislike={this.dislike} ignore={this.ignore} category={thread.category}/>
                    : null}
            </div>
        );
    }
};

DiscoverLitePage.defaultProps = {
    strings: {
        discover        : 'Discover',
        loadingMessage  : 'Loading recommendations',
        confirmReplace  : 'We have improve your recommendations. Do you whant to reload them?'
    }
};