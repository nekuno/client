import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { ORIGIN_CONTEXT } from '../constants/Constants';
import RecommendationList from '../components/recommendations/RecommendationList';
import TopNavBar from '../components/ui/TopNavBar';
import ThreadToolBar from '../components/ui/ThreadToolBar';
import EmptyMessage from '../components/ui/EmptyMessage/EmptyMessage';
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
import ShareService from '../services/ShareService';
import Framework7Service from '../services/Framework7Service';

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
    UserActionCreators.requestMetadata();
}

function requestRecommendationData(props, activeIndex) {
     if (props.thread.category == "ThreadUsers") {
        const userId = parseId(props.user);
        const otherUserRecommendation = props.recommendations.find((recommendation, index) => index === activeIndex) || null;
        if (otherUserRecommendation) {
            const otherUserId = parseInt(otherUserRecommendation.id);
            UserActionCreators.requestComparedStats(userId, otherUserId);
            GalleryPhotoActionCreators.getOtherPhotos(otherUserId);
            QuestionActionCreators.requestComparedQuestions(otherUserId, ['showOnlyCommon']);
            InterestsActionCreators.requestComparedInterests(userId, otherUserId, 'Link', 1);
        }
    }
}

function initSwiper(props, index = 0) {
    // Init slider
    let recommendationsSwiper = Framework7Service.nekunoApp().swiper('#recommendations-swiper-container', {
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
            if (activeIndex == RecommendationStore.getLength(props.thread.id) - 15) {
                ThreadActionCreators.recommendationsNext(props.thread.id);
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
    const threadId = parseThreadId(props.params);
    const userId = parseId(props.user);
    let thread = ThreadStore.get(threadId);
    if (Object.keys(thread).length != 0) {
        thread.isEmpty = RecommendationStore.isEmpty(thread.id);
    }
    const category = thread ? thread.category : null;
    const filters = FilterStore.filters;
    const isJustRegistered = WorkersStore.isJustRegistered();
    const isLoadingComparedQuestions = QuestionStore.isLoadingComparedQuestions();
    const isLoadingComparedInterests = InterestStore.isLoadingComparedInterests();

    const recommendations = threadId && RecommendationStore.get(threadId) ? RecommendationStore.get(threadId) : [];

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

//TODO: Remove
@AuthenticatedComponent
@translate('RecommendationPage')
@connectToStores([ThreadStore, RecommendationStore, FilterStore, LikeStore, ProfileStore, ComparedStatsStore, GalleryPhotoStore, QuestionStore, InterestStore], getState)
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
        router: PropTypes.object.isRequired
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
        if (parseThreadId(nextProps.params) !== parseThreadId(this.props.params)) {
            requestData(nextProps);
        }
        if (RecommendationStore.replaced(parseThreadId(nextProps.params))) {
            Framework7Service.nekunoApp().confirm(nextProps.strings.confirmReplace, () => {
                // No action needed
            }, () => {
                window.setTimeout(() => ThreadActionCreators.addPrevRecommendation(parseThreadId(nextProps.params)), 0);
            });
        }
    }

    componentDidMount() {
        if (this.props.isJustRegistered) {
            Framework7Service.nekunoApp().alert(this.props.strings.processingThread);
        }
        if (this.props.thread && this.props.recommendations.length > 0 && !this.state.swiper) {
            const index = RecommendationStore.getSavedIndex();
            this.state = {
                swiper: initSwiper(this.props, index)
            };
        }
    }

    componentDidUpdate() {
        if (!this.props.thread || this.props.recommendations.length == 0) {
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

    deleteThread() {
        Framework7Service.nekunoApp().confirm(this.props.strings.confirmDelete, () => {
            const threadId = this.props.thread.id;
            const router = this.context.router;
            ThreadActionCreators.deleteThread(threadId)
                .then(() => {
                    router.push('/proposals');
                }, (error) => { console.log(error) });
        });
    }

    editThread() {
        this.context.router.push(`edit-thread/${this.props.thread.id}`);
    }

    ignore() {
        const activeIndex = this.state.swiper.activeIndex;
        const {user, userId, recommendations, thread} = this.props;
        const recommendation = recommendations[activeIndex];

        if (thread.category === 'ThreadUsers') {
            UserActionCreators.ignoreUser(user.slug, recommendation.slug, ORIGIN_CONTEXT.RECOMMENDATIONS_PAGE, thread.name);
        } else if (thread.category === 'ThreadContent') {
            UserActionCreators.ignoreContent(userId, recommendation.content.id, ORIGIN_CONTEXT.RECOMMENDATIONS_PAGE, thread.name);
        }
        this.state.swiper.slideNext();
        if (thread.category == "ThreadUsers") {
            //TODO: get OtherGallery
        }
    }

    dislike() {
        const activeIndex = this.state.swiper.activeIndex;
        const {user, userId, recommendations, thread} = this.props;
        const recommendation = recommendations[activeIndex];

        if (thread.category === 'ThreadUsers') {
            if (recommendation.like === -1) {
                UserActionCreators.deleteLikeUser(user.slug, recommendation.slug);
            } else {
                UserActionCreators.dislikeUser(user.slug, recommendation.slug, ORIGIN_CONTEXT.RECOMMENDATIONS_PAGE, thread.name);
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
        const {user, userId, recommendations, thread} = this.props;
        const recommendation = recommendations[activeIndex];

        if (thread.category === 'ThreadUsers') {
            if (recommendation.like && recommendation.like !== -1) {
                UserActionCreators.deleteLikeUser(user.slug, recommendation.slug);
            } else {
                UserActionCreators.likeUser(user.slug, recommendation.slug, ORIGIN_CONTEXT.RECOMMENDATIONS_PAGE, thread.name);
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
        ShareService.share(
            recommendation.content.title,
            recommendation.content.url,
            this.onShareSuccess,
            this.onShareError,
            this.props.strings.copiedToClipboard
        );
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
        Framework7Service.nekunoApp().alert(this.props.strings.shareError)
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

        let offsetTop = parseInt(document.getElementsByClassName('view')[0].scrollTop + document.getElementsByClassName('view')[0].offsetHeight);
        let offsetTopMax = parseInt(document.getElementsByClassName('paginated-' + recommendation.id)[0].offsetHeight) + 800;

        if (pagination && nextLink && offsetTop >= offsetTopMax) {
            document.getElementsByClassName('view')[0].removeEventListener('scroll', this.handleScroll);
            if (currentTab == 'questions' && !isLoadingComparedQuestions) {
                QuestionActionCreators.requestComparedQuestions(recommendation.id, []);
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
            <div className="views">
                {Object.keys(thread).length > 0 ?
                    <TopNavBar leftIcon={'left-arrow'} centerText={''} rightIcon={'edit'} secondRightIcon={'delete'} onRightLinkClickHandler={this.editThread} onSecondRightLinkClickHandler={this.deleteThread}/>
                    :
                    <TopNavBar leftIcon={'left-arrow'} centerText={''}/>
                }
                {recommendations.length > 0 && filters && Object.keys(filters).length > 0 ?
                    <ThreadToolBar recommendation={this.state.swiper ? recommendations[this.state.swiper.activeIndex] : null} like={this.like} dislike={this.dislike} ignore={this.ignore} category={thread.category} share={this.onShare}/>
                    : null}
                <div className="view view-main" onScroll={this.state.currentTab ? this.handleScroll : null}>
                    <div className="page">
                        <div id="page-content" className="recommendation-page">
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
                </div>
            </div>
        );
    }
}

RecommendationPage.defaultProps = {
    strings: {
        loadingMessage   : 'Loading recommendations',
        confirmDelete    : 'Are you sure you want to delete this thread?',
        processingThread : 'These results are provisional, we´ll finish improving them for you soon.',
        confirmReplace   : 'We have improve your recommendations. Do you whant to reload them?',
        copiedToClipboard: 'Copied to clipboard',
        shareError       : 'An error occurred sharing the content'
    }
};