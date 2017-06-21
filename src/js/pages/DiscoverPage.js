import React, { PropTypes, Component } from 'react';
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

function parseId(user) {
    return user.id;
}

function parseThreadId(thread) {
    return thread.id;
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
    const userId = parseId(props.user);
    const groupId = props.params.groupId || null;
    ThreadActionCreators.requestThreadPage(userId, parseInt(groupId));
    ThreadActionCreators.requestFilters();
    UserActionCreators.requestMetadata();
}

/**
 * Retrieves state from stores for current props.
 */
function getState(props) {

    let userId = parseId(props.user);
    const profile = ProfileStore.get(userId);
    const questionsTotal = QuestionStore.answersLength(userId);
    let isSomethingWorking = WorkersStore.isSomethingWorking();
    let filters = {};
    let recommendations = [];
    let thread = getDisplayedThread(props);
    let isLoadingRecommendations = true;
    if (parseThreadId(thread)) {
        if (Object.keys(thread).length !== 0) {
            thread.isEmpty = RecommendationStore.isEmpty(parseThreadId(thread));
            isLoadingRecommendations = !RecommendationStore.get(parseThreadId(thread)) || RecommendationStore.isLoadingRecommendations(parseThreadId(thread));
        }
        filters = FilterStore.filters;
        recommendations = RecommendationStore.get(parseThreadId(thread)) ? RecommendationStore.get(parseThreadId(thread)) : [];
    }
    const networks = WorkersStore.getAll();
    const similarityOrder = thread && thread.filters && thread.filters.userFilters && thread.filters.userFilters.order === 'similarity' || false;
    const isThreadGroup = thread.groupId !== null;

    return {
        profile,
        questionsTotal,
        isSomethingWorking,
        filters,
        recommendations,
        thread,
        isLoadingRecommendations,
        networks,
        similarityOrder,
        isThreadGroup
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
        questionsTotal          : PropTypes.number,
        isSomethingWorking      : PropTypes.bool,
        filters                 : PropTypes.object,
        recommendations         : PropTypes.array,
        thread                  : PropTypes.object,
        isLoadingRecommendations: PropTypes.bool,
        networks                : PropTypes.array.isRequired,
        similarityOrder         : PropTypes.bool.isRequired,
        isThreadGroup           : PropTypes.bool
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

    editThread() {
        this.context.router.push(`edit-thread/${parseThreadId(this.props.thread)}`);
    }

    leftClickHandler() {
        if (this.props.thread && this.props.thread.groupId !== null) {
            this.context.router.push(`badges`);
        }
    }

    onBottomScroll() {
        const threadId = parseThreadId(this.props.thread);
        return ThreadActionCreators.recommendationsNext(threadId);
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
        const {user, questionsTotal, networks, thread, profile, filters} = this.props;
        const connectedNetworks = networks.filter(network => network.fetching || network.fetched || network.processing || network.processed);
        const mustShowQuestionsBanner = profile && filters && thread && questionsTotal <= 100;
        const mustShowSocialNetworksBanner = profile && filters && thread && connectedNetworks.length < 3;

        const banner =
            mustShowQuestionsBanner ? <QuestionsBanner user={user} questionsTotal={questionsTotal || 0}/>
                : mustShowSocialNetworksBanner ? <SocialNetworksBanner networks={networks} user={user}/>
                : '';
        return banner;
    }
    getFirstItems() {
        return [
            this.renderChipList.bind(this)(),
            this.getEditButton.bind(this)(),
            this.getBanner.bind(this)(),
            this.getProcessesProgress.bind(this)()
        ];
    }

    render() {
        const {user, profile, strings, recommendations, thread, isLoadingRecommendations, similarityOrder, isThreadGroup} = this.props;
        const title = isThreadGroup ? thread.name : strings.discover;
        const emptyMessageText = isLoadingRecommendations ? strings.loadingMessage : strings.noRecommendations;

        return (
            <div id="discover-views" className="views">
                {Object.keys(thread).length > 0 ?
                    <TopNavBar leftMenuIcon={!isThreadGroup} leftIcon="left-arrow" centerText={title} onLeftLinkClickHandler={this.leftClickHandler}/>
                    : <TopNavBar leftMenuIcon={true} centerText={title}/>}
                <div className="view view-main" id="discover-view-main" style={{overflow: 'hidden'}}>
                    <div className="page discover-page">
                        <div id="page-content">
                            {profile ?
                                <CardUserList firstItems ={this.getFirstItems.bind(this)()} recommendations={recommendations} user={user} profile={profile}
                                              handleSelectProfile={this.selectProfile} similarityOrder={similarityOrder} onBottomScroll={this.onBottomScroll}/>
                                :
                                <EmptyMessage text={emptyMessageText} loadingGif={true}/>}
                            <br />
                        </div>
                    </div>
                    {profile ? <OrientationRequiredPopup profile={profile} onContinue={this.goToProfile}/> : null}
                </div>
            </div>
        );
    }
}
;

DiscoverPage.defaultProps = {
    strings: {
        discover         : 'Discover',
        editFilters      : 'Edit filters',
        loadingMessage   : 'Loading recommendations',
        noRecommendations: 'There are no recommendations with selected filters'
    }
};