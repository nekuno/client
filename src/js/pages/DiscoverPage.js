import PropTypes from 'prop-types';
import selectn from 'selectn';
import React, { Component } from 'react';
import TopNavBar from '../components/ui/TopNavBar';
import CardUserList from '../components/user/CardUserList';
import EmptyMessage from '../components/ui/EmptyMessage';
import ChipList from './../components/ui/ChipList';
import Button from './../components/ui/Button';
import ProcessesProgress from '../components/processes/ProcessesProgress';
import OrientationRequiredPopup from '../components/ui/OrientationRequiredPopup';
import QuestionsBanner from '../components/questions/QuestionsBanner';
import SocialNetworksBanner from '../components/socialNetworks/SocialNetworksBanner';
import AuthenticatedComponent from '../components/AuthenticatedComponent';
import translate from '../i18n/Translate';
import connectToStores from '../utils/connectToStores';
import * as UserActionCreators from '../actions/UserActionCreators';
import * as ThreadActionCreators from '../actions/ThreadActionCreators';
import ThreadStore from '../stores/ThreadStore';
import FilterStore from '../stores/FilterStore';
import QuestionStore from '../stores/QuestionStore';
import RecommendationStore from '../stores/RecommendationStore';
import WorkersStore from '../stores/WorkersStore';
import ProfileStore from '../stores/ProfileStore';
import Image from '../components/ui/Image';
import TextRadios from '../components/ui/TextRadios';
import LikedUsersStore from '../stores/LikedUsersStore';

function parseId(user) {
    return user.id;
}

function parseThreadId(thread) {
    return thread && thread.hasOwnProperty('id') ? thread.id : null;
}

function getDisplayedThread(props) {

    if (props.params.groupId) {
        return ThreadStore.getByGroup(props.params.groupId) || {};
    }

    return ThreadStore.getMainDiscoverThread();
}

function isLocationLiked() {
    return document.location.hash === '#/liked';
}

/**
 * Requests data from server for current props.
 */
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

function getRecommendationsFromStore(threadId) {
    if (isLocationLiked()) {
        return LikedUsersStore.get();
    }

    return RecommendationStore.get(threadId) ? RecommendationStore.get(threadId) : [];
}

function getIsLoadingFromStore(threadId) {
    if (isLocationLiked()) {
        return LikedUsersStore.isLoading();
    }

    if (threadId) {
        return RecommendationStore.isLoadingRecommendations(threadId);
    }
}

function getRecommendationUrlFromStore(threadId) {
    if (isLocationLiked()) {
        return LikedUsersStore.getRequestUrl();
    }

    return RecommendationStore.getRecommendationUrl(threadId);
}

/**
 * Retrieves state from stores for current props.
 */
function getState(props) {
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
    let isLoadingRecommendations = getIsLoadingFromStore(threadId);
    if (threadId) {
        if (Object.keys(thread).length !== 0) {
            thread.isEmpty = RecommendationStore.isEmpty(threadId);
        }
        filters = FilterStore.filters;
        recommendations = getRecommendationsFromStore(threadId)
    }
    const networks = WorkersStore.getAll();
    const isThreadGroup = thread.groupId !== null;
    const recommendationUrl = getRecommendationUrlFromStore(threadId);
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
    };
}

@AuthenticatedComponent
@translate('DiscoverPage')
@connectToStores([ThreadStore, RecommendationStore, LikedUsersStore, FilterStore, WorkersStore, ProfileStore, QuestionStore], getState)
export default class DiscoverPage extends Component {

    static propTypes = {
        // Injected by @AuthenticatedComponent
        user                    : PropTypes.object.isRequired,
        // Injected by @translate:
        strings                 : PropTypes.object,
        // Injected by @connectToStores:
        profile                 : PropTypes.object,
        orientationMustBeAsked  : PropTypes.bool,
        questionsTotal          : PropTypes.number,
        isSomethingWorking      : PropTypes.bool,
        filters                 : PropTypes.object,
        recommendations         : PropTypes.array,
        thread                  : PropTypes.object,
        isLoadingRecommendations: PropTypes.bool,
        isLoadingThread         : PropTypes.bool,
        networks                : PropTypes.array.isRequired,
        isThreadGroup           : PropTypes.bool,
        recommendationUrl       : PropTypes.string,
        isInitialRequest        : PropTypes.bool,
        editThreadUrl           : PropTypes.string,
    };

    static contextTypes = {
        router: PropTypes.object.isRequired
    };

    constructor(props) {
        super(props);

        this.requestNewItems = this.requestNewItems.bind(this);
        this.editThread = this.editThread.bind(this);
        this.leftClickHandler = this.leftClickHandler.bind(this);
        this.onBottomScroll = this.onBottomScroll.bind(this);
        this.goToProfile = this.goToProfile.bind(this);
        this.goToDiscover = this.goToDiscover.bind(this);
        this.selectProfile = this.selectProfile.bind(this);
        this.selectOrder = this.selectOrder.bind(this);
        this.changeOrder = this.changeOrder.bind(this);
        this.renderNoRecommendations = this.renderNoRecommendations.bind(this);

        this.state = {
            selectedUserSlug: null,
            orderSelected: false,
        };
    }

    requestNewItems(threadId, recommendationUrl, loading) {
        if (loading){
            return;
        }
        if (isLocationLiked()) {
            UserActionCreators.requestOwnLiked(recommendationUrl);
        } else {
            ThreadActionCreators.requestRecommendations(threadId, recommendationUrl);
        }
    }

    componentDidMount() {
        this.setState({isLocationLiked: this.context.router.location.pathname === '/liked'});
        const {thread, recommendationUrl, isLoadingRecommendations, recommendations} = this.props;
        requestData(this.props);
        const threadId = parseId(thread);
        const canRequestFirstInterests = recommendationUrl && recommendations.length === 0;
        if (canRequestFirstInterests && !isLoadingRecommendations && threadId) {
            this.requestNewItems(threadId, recommendationUrl, isLoadingRecommendations);
        }
    }

    componentDidUpdate(prevProps) {
        const {thread, recommendationUrl, isLoadingRecommendations, recommendations} = this.props;
        const threadId = parseId(thread);
        const receivedThread = parseId(prevProps.thread) !== threadId;
        const canRequestFirstInterests = recommendationUrl && recommendations.length === 0;
        if ((receivedThread || canRequestFirstInterests) && !isLoadingRecommendations && threadId) {
            this.requestNewItems(threadId, recommendationUrl, isLoadingRecommendations);
        }
    }

    editThread() {
        this.context.router.push(this.props.editThreadUrl);
    }

    selectOrder() {
        this.setState({orderSelected: true});
    }

    changeOrder(order) {
        const userFilters = selectn('thread.filters.userFilters', this.props);
        if (!userFilters) return;
        userFilters.order = order;

        ThreadActionCreators.createThread(this.props.user.id,
            { name: this.props.thread.name, filters: {userFilters}, category: 'ThreadUsers' })
            .then((createdThread) => {
            }, () => {
            });
        this.setState({orderSelected: false});
    }

    leftClickHandler() {
        if (this.props.thread && this.props.thread.groupId !== null) {
            this.context.router.push(`badges`);
        }
    }

    onBottomScroll() {
        const {thread, recommendationUrl, isLoadingRecommendations, isLoadingThread, isInitialRequest} = this.props;
        const threadId = parseThreadId(thread);
        if (threadId && recommendationUrl && !isInitialRequest && !isLoadingRecommendations && !isLoadingThread) {
            this.requestNewItems(threadId, recommendationUrl);
        } else {
            return Promise.resolve();
        }
    }

    goToProfile() {
        const {selectedUserSlug} = this.state;
        this.context.router.push(`/p/${selectedUserSlug}`);
    }

    selectProfile(userSlug) {
        this.setState({selectedUserSlug: userSlug});
    }

    renderChipList = function() {
        const {thread, filters} = this.props;
        if (thread && filters && Object.keys(thread).length > 0 && Object.keys(filters).length > 0) {
            let threadFilters = thread.category === 'ThreadUsers' ? thread.filters.userFilters : thread.filters.contentFilters;
            let chips = [];
            let currentFilters = thread.category === 'ThreadUsers' ? filters.userFilters : filters.contentFilters;
            if (threadFilters) {
                Object.keys(threadFilters).filter(key => typeof currentFilters[key] !== 'undefined').forEach(key => {
                    if (key !== 'order') {
                        chips.push({label: FilterStore.getFilterLabel(currentFilters[key], threadFilters[key])})
                    }
                });
            }

            return (
                <ChipList chips={chips} small={true} onClick={this.editThread}/>
            );
        }
    };

    getEditButton() {
        const {strings, profile, thread, filters} = this.props;

        if (profile && thread && filters && Object.keys(thread).length > 0) {
            return <div className="edit-thread-button">
                <Button onClick={this.editThread}><span className="icon-edit"></span> <span class="text">{strings.editFilters}</span></Button>
            </div>
        } else {
            return '';
        }
    }

    renderOrderSelector() {
        const {strings} = this.props;
        const {orderSelected} = this.state;
        const value = selectn('thread.filters.userFilters.order', this.props) || 'matching';
        return orderSelected && this.props.recommendations.length > 0 ?
            <div key="order-selector" className="order-selector selected">
                <TextRadios labels={['matching', 'similarity'].map(key => ({ key, text: strings[key] }) )}
                                onClickHandler={this.changeOrder} value={value}
                                title={strings.order} />
            </div>
            :
            <div key="order-selector" className="order-selector" onClick={this.selectOrder}>
                <span className="order-selector-status">
                    {value == 'matching' ? strings.orderMatching : strings.orderSimilarity}
                </span>
                <span className="icon mdi mdi-chevron-down"></span>
            </div>;
    }

    getProcessesProgress() {
        return <ProcessesProgress/>
    }

    getBanner() {
        const {user, questionsTotal, networks} = this.props;
        const connectedNetworks = networks.filter(network => network.fetching || network.fetched || network.processing || network.processed);
        const mustShowQuestionsBanner = user && questionsTotal <= 100;
        const mustShowSocialNetworksBanner = user && networks && connectedNetworks.length < 3;
        const banner =
            mustShowQuestionsBanner ? <QuestionsBanner user={user} questionsTotal={questionsTotal || 0}/>
                : mustShowSocialNetworksBanner ? <SocialNetworksBanner networks={networks} user={user}/>
                : '';
        return banner;
    }

    getFirstItems() {
        let firstItems = [
            this.renderOrderSelector(),
        ];

        if (this.props.profile) {
            firstItems.push(<div key="banner">{this.getBanner.bind(this)()}</div>);
            firstItems.push(<div key="processes-progress">{this.getProcessesProgress.bind(this)()}</div>);
        }

        const noRecommendations = this.props.recommendations.length === 0;
        const isThreadLoading = Object.keys(this.props.thread).length === 0;
        const noUserInfo = this.props.profile && Object.keys(this.props.profile).length === 0;

        /*if ((isThreadLoading && noRecommendations) || noUserInfo) {
            return [this.getLoadingMessage(this.props)];
        }*/

        return firstItems;
    }

    /*getLoadingMessage(props) {
        const {strings} = props;
        return <div key="empty-message"><EmptyMessage text={strings.loadingMessage} loadingGif={true}/></div>;
    }*/

    renderNoRecommendations()
    {
        const {strings} = this.props;
        return isLocationLiked() ?
        <div className="no-recommendations">
            <div>
                <Image className="header-image" src="img/no-recommendations.png" />
                <p className="title">{strings.noRecommendationsTitle}</p>
                <p>{strings.noLikedText}</p>
                <p><a onClick={this.goToDiscover}>{strings.noLikedAction}</a></p>
            </div>
        </div>
            :
            <div className="no-recommendations">
                <div>
                    <Image className="header-image" src="img/no-recommendations.png" />
                    <p className="title">{strings.noRecommendationsTitle}</p>
                    <p>{strings.noRecommendationsText}</p>
                    <p><a onClick={this.editThread}>{strings.noRecommendationsAction}</a></p>
                </div>
            </div>
        ;
    }

    goToDiscover() {
        this.context.router.push(`/discover`);
    }

    render() {
        const {user, profile, orientationMustBeAsked, strings, recommendations, thread, isLoadingRecommendations, isThreadGroup} = this.props;
        const title = isThreadGroup ? thread.name : isLocationLiked() ? strings.liked : strings.discover;
        const isFirstLoading = isLoadingRecommendations && recommendations.length === 0;
        const isThreadLoading = Object.keys(this.props.thread).length === 0;
        const noUserInfo = this.props.profile && Object.keys(this.props.profile).length === 0;
        const noRecommendations = !noUserInfo && !isThreadLoading && !isLoadingRecommendations && recommendations.length === 0;

        const filtersIcon = isLocationLiked() ? null : "mdi-tune-vertical";
        const filtersHandler = isLocationLiked() ? null : this.editThread;

        return (
            <div id="discover-views" className="views">
                {Object.keys(thread).length > 0 ?
                    <TopNavBar leftMenuIcon={!isThreadGroup} leftIcon="left-arrow" centerText={title} onLeftLinkClickHandler={this.leftClickHandler} rightIcon={filtersIcon} rightIconsWithoutCircle={true} onRightLinkClickHandler={filtersHandler}/>
                    : <TopNavBar leftMenuIcon={true} centerText={title} rightIcon={filtersIcon} rightIconsWithoutCircle={true} onRightLinkClickHandler={filtersHandler}/>}
                <div className="view view-main" id="discover-view-main" style={{overflow: 'hidden'}}>
                    <div className="page discover-page">
                        <div id="page-content">
                            { !noRecommendations ?
                                <CardUserList firstItems={this.getFirstItems.bind(this)()} recommendations={recommendations} user={user}
                                              handleSelectProfile={this.selectProfile} onBottomScroll={this.onBottomScroll} isLoading={isLoadingRecommendations}
                                              isFirstLoading={isFirstLoading} orientationMustBeAsked={orientationMustBeAsked}/>
                                :
                                this.renderNoRecommendations()
                            }
                        </div>
                    </div>
                    {profile ? <OrientationRequiredPopup profile={profile} onContinue={this.goToProfile}/> : null}
                </div>
            </div>
        );
    }
}

DiscoverPage.defaultProps = {
    strings: {
        discover         : 'Discover',
        liked            : 'Liked users',
        editFilters      : 'Edit filters',
        loadingMessage   : 'Loading recommendations',
        noRecommendations: 'There are no recommendations with selected filters'
    }
};