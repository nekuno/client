import PropTypes from 'prop-types';
import React, { Component } from 'react';
import translate from '../i18n/Translate';
import connectToStores from '../utils/connectToStores';
import AuthenticatedComponent from '../components/AuthenticatedComponent';
import * as UserActionCreators from '../actions/UserActionCreators';
import * as ThreadActionCreators from '../actions/ThreadActionCreators';
import ThreadStore from '../stores/ThreadStore';
import FilterStore from '../stores/FilterStore';
import QuestionStore from '../stores/QuestionStore';
import RecommendationStore from '../stores/RecommendationStore';
import WorkersStore from '../stores/WorkersStore';
import ProfileStore from '../stores/ProfileStore';
import RoundedIcon from '../components/ui/RoundedIcon/RoundedIcon.js';
import SelectCollapsible from '../components/ui/SelectCollapsible/SelectCollapsible.js';
import InfiniteScroll from "../components/scroll/InfiniteScroll";
import TopNavBar from '../components/TopNavBar/TopNavBar.js';
import CardUser from '../components/OtherUser/CardUser/CardUser.js';
import '../../scss/pages/persons-all.scss';

function parseId(user) {
    return user.id;
}

function parseThreadId(thread) {
    return thread && thread.hasOwnProperty('id') ? thread.id : null;
}

function requestData(props) {
    if (!props.profile && props.user.slug) {
        UserActionCreators.requestOwnProfile(props.user.slug);
    }
    if (Object.keys(props.thread).length === 0) {
        const userId = parseId(props.user);
        ThreadActionCreators.requestThreads(userId);
    }
    ThreadActionCreators.requestFilters();
}

function getDisplayedThread(props) {

    if (props.params.groupId) {
        return ThreadStore.getByGroup(props.params.groupId) || {};
    }

    return ThreadStore.getMainDiscoverThread();
}

function getState(props) {

    const order = 'compatibility';
    let userId = parseId(props.user);
    const profile = ProfileStore.get(props.user.slug);
    const orientationMustBeAsked = ProfileStore.orientationMustBeAsked();
    const questionsTotal = QuestionStore.ownAnswersLength(userId);
    let isSomethingWorking = WorkersStore.isSomethingWorking();
    let filters = {};
    let recommendations = [];
    let thread = getDisplayedThread(props);
    const threadId = parseThreadId(thread);
    const isLoadingThread = ThreadStore.isRequesting();
    let isLoadingRecommendations = false;
    if (threadId) {
        if (Object.keys(thread).length !== 0) {
            thread.isEmpty = RecommendationStore.isEmpty(threadId);
            isLoadingRecommendations = RecommendationStore.isLoadingRecommendations(threadId);
        }
        filters = FilterStore.filters;
        recommendations = RecommendationStore.get(threadId) ? RecommendationStore.get(threadId) : [];
    }
    const networks = WorkersStore.getAll();
    const isThreadGroup = thread.groupId !== null;
    const recommendationUrl = RecommendationStore.getRecommendationUrl(threadId);
    const isInitialRequest = RecommendationStore.isInitialRequestUrl(recommendationUrl, threadId);
    const editThreadUrl = ThreadStore.getEditThreadUrl(threadId);

    return {
        profile,
        orientationMustBeAsked,
        questionsTotal,
        isSomethingWorking,
        filters,
        recommendations,
        thread,
        isLoadingRecommendations,
        isLoadingThread,
        networks,
        isThreadGroup,
        recommendationUrl,
        isInitialRequest,
        editThreadUrl,
        order
    };
}

@AuthenticatedComponent
@translate('PersonsAllPage')
@connectToStores([ThreadStore, RecommendationStore, FilterStore, WorkersStore, ProfileStore, QuestionStore], getState)
export default class PersonsAllPage extends Component {

    static propTypes = {
        // Injected by @AuthenticatedComponent
        user     : PropTypes.object.isRequired,
        // Injected by @translate:
        strings  : PropTypes.object,
        // Injected by @connectToStores:
        networks : PropTypes.array.isRequired,
        error    : PropTypes.bool,
        isLoading: PropTypes.bool,
    };

    static contextTypes = {
        router: PropTypes.object.isRequired
    };

    constructor(props) {
        super(props);

        this.handleSearch = this.handleSearch.bind(this);
        this.goToPersonsFilters = this.goToPersonsFilters.bind(this);
        this.onBottomScroll = this.onBottomScroll.bind(this);
        this.onResize = this.onResize.bind(this);
    }

    componentDidMount() {
        const {thread, recommendationUrl, isLoadingRecommendations, recommendations} = this.props;
        requestData(this.props);
        const threadId = parseId(thread);
        const canRequestFirstInterests = recommendationUrl && recommendations.length === 0;
        if (canRequestFirstInterests && !isLoadingRecommendations && threadId) {
            ThreadActionCreators.requestRecommendations(threadId, recommendationUrl);
        }
    }

    componentDidUpdate(prevProps) {
        const {thread, recommendationUrl, isLoadingRecommendations, recommendations} = this.props;
        const threadId = parseId(thread);
        const receivedThread = parseId(prevProps.thread) !== threadId;
        const canRequestFirstInterests = recommendationUrl && recommendations.length === 0;
        if ((receivedThread || canRequestFirstInterests) && !isLoadingRecommendations && threadId) {
            ThreadActionCreators.requestRecommendations(threadId, recommendationUrl);
        }
    }

    handleSearch(value) {
        // TODO: Call endpoint for filtering users by name
    }

    handleChangeOrder(order) {
        // TODO: Call endpoint for new order
    }

    onBottomScroll() {
        const {thread, recommendationUrl, isLoadingRecommendations, isLoadingThread, isInitialRequest} = this.props;
        const threadId = parseThreadId(thread);
        if (threadId && recommendationUrl && !isInitialRequest && !isLoadingRecommendations && !isLoadingThread) {
            return ThreadActionCreators.requestRecommendations(threadId, recommendationUrl);
        } else {
            return Promise.resolve();
        }
    }

    getItemHeight = function() {
        const iW = window.innerWidth;
        const photoHeight = iW >= 480 ? 230.39 : iW / 2 - 4 * iW / 100;
        const bottomHeight = 137;

        return photoHeight + bottomHeight;
    };

    onResize() {
        this.setState({itemHeight: this.getItemHeight()});
    }

    goToPersonsFilters() {
        const {thread} = this.props;
        const threadId = parseThreadId(thread);

        this.context.router.push(`/persons-filter/${threadId}`);
    }

    render() {
        const {order, recommendations, isLoadingThread, isLoadingRecommendations, strings} = this.props;
        const orderOptions = [
            {
                id: 'compatibility',
                text: strings.compatibility
            },
            {
                id: 'similarity',
                text: strings.similarity
            },
            {
                id: 'coincidences',
                text: strings.coincidences
            }
        ];

        return (
            <div className="views">
                <div className="view view-main persons-all-view">
                    <TopNavBar textCenter={strings.title} textSize={'small'} iconLeft={'arrow-left'} boxShadow={true} searchInput={true} onSearchChange={this.handleSearch}>
                        <SelectCollapsible options={orderOptions} selected={order} title={strings.orderedBy + ' ' + strings[order].toLowerCase()} onClickHandler={this.handleChangeOrder}/>
                    </TopNavBar>
                    <div id="scroll-wrapper" className="persons-all-wrapper">
                        <div id="persons" className="persons">
                            {recommendations && recommendations.length > 0 ?
                                <InfiniteScroll
                                    items={recommendations.map((recommendation, index) =>
                                        <div key={index} className="person">
                                            <CardUser {...recommendation} size="small"/>
                                        </div>
                                    )}
                                    itemHeight={this.getItemHeight()}
                                    onResize={this.onResize}
                                    columns={2}
                                    onInfiniteLoad={this.onBottomScroll}
                                    containerId="scroll-wrapper"
                                    loading={isLoadingThread || isLoadingRecommendations}
                                />
                                : null
                            }

                        </div>
                    </div>
                    <div className="filters-button">
                        <div className="filters-button-fixed">
                            <RoundedIcon icon={'filter'} size={'large'} background={'#928BFF'} fontSize={'35px'} onClickHandler={this.goToPersonsFilters}/>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

}

PersonsAllPage.defaultProps = {
    strings: {
        title        : 'Nekuno People',
        orderedBy    : 'Ordered by',
        compatibility: 'compatibility',
        similarity   : 'similarity',
        coincidences : 'coincidences'
    }
};