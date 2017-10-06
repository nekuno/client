import PropTypes from 'prop-types';
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
import * as ThreadActionCreators from '../actions/ThreadActionCreators';
import ThreadStore from '../stores/ThreadStore';
import FilterStore from '../stores/FilterStore';
import QuestionStore from '../stores/QuestionStore';
import RecommendationStore from '../stores/RecommendationStore';
import WorkersStore from '../stores/WorkersStore';
import ProfileStore from '../stores/ProfileStore';

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

/**
 * Requests data from server for current props.
 */
function requestData(props) {
    if (Object.keys(props.thread).length === 0) {
        const userId = parseId(props.user);
        ThreadActionCreators.requestThreads(userId);
    }
    ThreadActionCreators.requestFilters();
}

/**
 * Retrieves state from stores for current props.
 */
function getState(props) {

    let userId = parseId(props.user);
    const profile = ProfileStore.get(userId);
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
    };
}

@AuthenticatedComponent
@translate('DiscoverPage')
@connectToStores([ThreadStore, RecommendationStore, FilterStore, WorkersStore, ProfileStore, QuestionStore], getState)
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

        this.editThread = this.editThread.bind(this);
        this.leftClickHandler = this.leftClickHandler.bind(this);
        this.onBottomScroll = this.onBottomScroll.bind(this);
        this.goToProfile = this.goToProfile.bind(this);
        this.selectProfile = this.selectProfile.bind(this);

        this.state = {
            selectedUserSlug: null
        };
    }

    componentDidMount() {
        requestData(this.props);
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

    editThread() {
        this.context.router.push(this.props.editThreadUrl);
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
            return ThreadActionCreators.requestRecommendations(threadId, recommendationUrl);
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
            Object.keys(threadFilters).filter(key => typeof currentFilters[key] !== 'undefined').forEach(key => {
                if (key !== 'order') {
                    chips.push({label: FilterStore.getFilterLabel(currentFilters[key], threadFilters[key])})
                }
            });
            return (
                <ChipList chips={chips} small={true} onClick={this.editThread}/>
            );
        }
    };

    getEditButton() {
        const {strings, profile, thread, filters} = this.props;

        if (profile && thread && filters && Object.keys(thread).length > 0) {
            return <div className="edit-thread-button">
                <Button onClick={this.editThread}><span className="icon-edit"></span> {strings.editFilters}</Button>
            </div>
        } else {
            return '';
        }
    }

    getProcessesProgress() {
        return <ProcessesProgress />
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
            <div key="chip-list">{this.renderChipList.bind(this)()}</div>,
            <div key="edit-button">{this.getEditButton.bind(this)()}</div>,
            <div key="banner">{this.getBanner.bind(this)()}</div>,
            <div key="processes-progress">{this.getProcessesProgress.bind(this)()}</div>
        ];

        const noRecommendations = this.props.recommendations.length === 0;
        const isSomethingLoading = Object.keys(this.props.thread).length === 0 || this.props.isLoadingRecommendations;
        const noUserInfo = Object.keys(this.props.profile).length === 0;

        if ((isSomethingLoading && noRecommendations ) || noUserInfo) {
            firstItems.push(this.getEmptyMessage(this.props, !this.props.isLoadingRecommendations));
        }

        return firstItems;
    }

    getEmptyMessage(props, loadingGif) {
        const text = this.getEmptyMessageText(props);

        return <div key="empty-message"><EmptyMessage text={text} loadingGif={loadingGif}/></div>;
    }

    getEmptyMessageText(props) {
        const {thread, isLoadingRecommendations, strings} = props;
        return !parseThreadId(thread) || isLoadingRecommendations ? strings.loadingMessage : strings.noRecommendations;
    }

    render() {
        const {user, profile, orientationMustBeAsked, strings, recommendations, thread, isLoadingRecommendations, isThreadGroup} = this.props;
        const title = isThreadGroup ? thread.name : strings.discover;

        return (
            <div id="discover-views" className="views">
                {Object.keys(thread).length > 0 ?
                    <TopNavBar leftMenuIcon={!isThreadGroup} leftIcon="left-arrow" centerText={title} onLeftLinkClickHandler={this.leftClickHandler}/>
                    : <TopNavBar leftMenuIcon={true} centerText={title}/>}
                <div className="view view-main" id="discover-view-main" style={{overflow: 'hidden'}}>
                    <div className="page discover-page">
                        <div id="page-content">
                            {profile ?
                                <CardUserList firstItems={this.getFirstItems.bind(this)()} recommendations={recommendations} user={user} profile={profile}
                                              handleSelectProfile={this.selectProfile} onBottomScroll={this.onBottomScroll} isLoading={isLoadingRecommendations}
                                              orientationMustBeAsked={orientationMustBeAsked}/>
                                :
                                this.getEmptyMessage(this.props, true)
                            }
                            <br />
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
        editFilters      : 'Edit filters',
        loadingMessage   : 'Loading recommendations',
        noRecommendations: 'There are no recommendations with selected filters'
    }
};