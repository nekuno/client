import React, { PropTypes, Component } from 'react';
import TopNavBar from '../components/ui/TopNavBar';
import CardUserList from '../components/user/CardUserList';
import EmptyMessage from '../components/ui/EmptyMessage';
import ChipList from './../components/ui/ChipList';
import QuestionsBanner from '../components/questions/QuestionsBanner';
import ProcessesProgress from '../components/processes/ProcessesProgress';
import OrientationRequiredPopup from '../components/ui/OrientationRequiredPopup';
import AuthenticatedComponent from '../components/AuthenticatedComponent';
import translate from '../i18n/Translate';
import connectToStores from '../utils/connectToStores';
import * as UserActionCreators from '../actions/UserActionCreators';
import * as ThreadActionCreators from '../actions/ThreadActionCreators';
import * as QuestionActionCreators from '../actions/QuestionActionCreators';
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

/**
 * Requests data from server for current props.
 */
function requestData(props) {
    const userId = parseId(props.user);
    ThreadActionCreators.requestThreadPage(userId);
    ThreadActionCreators.requestFilters();
    QuestionActionCreators.requestQuestions(userId);
    UserActionCreators.requestMetadata();
}

/**
 * Retrieves state from stores for current props.
 */
function getState(props) {

    let userId = parseId(props.user);
    const profile = ProfileStore.get(userId);
    let pagination = QuestionStore.getPagination(userId) || {};
    let isSomethingWorking = WorkersStore.isSomethingWorking();
    let filters = {};
    let recommendations = [];
    let thread = ThreadStore.getAll().find((thread) => {
            let items = RecommendationStore.get(parseThreadId(thread)) || [];
            return items.length > 0 && thread.category === 'ThreadUsers';
        }) || ThreadStore.getAll().find((thread) => {
            return thread.category === 'ThreadUsers';
        }) || {};
    let isLoadingRecommendations = true;
    if (parseThreadId(thread)) {
        if (Object.keys(thread).length !== 0) {
            thread.isEmpty = RecommendationStore.isEmpty(parseThreadId(thread));
        }
        filters = FilterStore.filters;
        recommendations = RecommendationStore.get(parseThreadId(thread)) ? RecommendationStore.get(parseThreadId(thread)) : [];
        isLoadingRecommendations = RecommendationStore.isLoadingRecommendations(parseThreadId(thread));
    }

    return {
        profile,
        pagination,
        isSomethingWorking,
        filters,
        recommendations,
        thread,
        isLoadingRecommendations
    };
}

@AuthenticatedComponent
@translate('DiscoverPage')
@connectToStores([ThreadStore, RecommendationStore, FilterStore, WorkersStore, ProfileStore], getState)
export default class DiscoverPage extends Component {

    static propTypes = {
        // Injected by @AuthenticatedComponent
        user                    : PropTypes.object.isRequired,
        // Injected by @translate:
        strings                 : PropTypes.object,
        // Injected by @connectToStores:
        profile                 : PropTypes.object,
        pagination              : PropTypes.object,
        isSomethingWorking      : PropTypes.bool,
        filters                 : PropTypes.object,
        recommendations         : PropTypes.array,
        thread                  : PropTypes.object,
        isLoadingRecommendations: PropTypes.bool
    };

    static contextTypes = {
        history: PropTypes.object.isRequired
    };

    constructor(props) {
        super(props);

        this.editThread = this.editThread.bind(this);
        this.handleScroll = this.handleScroll.bind(this);
        this.goToProfile = this.goToProfile.bind(this);
        this.selectProfile = this.selectProfile.bind(this);

        this.state = {
            selectedUserId: null
        };
    }

    componentWillMount() {
        requestData(this.props);
    }

    componentDidUpdate() {

    }

    componentWillUnmount() {
        document.getElementsByClassName('view')[0].removeEventListener('scroll', this.handleScroll);
    }

    editThread() {
        this.context.history.pushState(null, `edit-thread/${parseThreadId(this.props.thread)}`);
    }

    handleScroll() {
        let offsetTop = parseInt(document.getElementsByClassName('view')[0].scrollTop + document.getElementsByClassName('view')[0].offsetHeight - 58);
        let offsetTopMax = parseInt(document.getElementById('page-content').offsetHeight);

        if (offsetTop >= offsetTopMax) {
            document.getElementsByClassName('view')[0].removeEventListener('scroll', this.handleScroll);
            ThreadActionCreators.recommendationsNext(parseThreadId(this.props.thread));
        }
    }

    goToProfile() {
        const {selectedUserId} = this.state;
        this.context.history.pushState(null, `/profile/${selectedUserId}`);
    }

    selectProfile(userId) {
        this.setState({selectedUserId: userId});
    }

    renderChipList = function(thread, filters) {
        if (thread && filters && Object.keys(thread).length > 0 && Object.keys(filters).length > 0) {
            let threadFilters = thread.category === 'ThreadUsers' ? thread.filters.userFilters : thread.filters.contentFilters;
            let chips = [];
            let currentFilters = thread.category === 'ThreadUsers' ? filters.userFilters : filters.contentFilters;
            Object.keys(threadFilters).filter(key => typeof currentFilters[key] !== 'undefined').forEach(key => {
                chips.push({label: FilterStore.getFilterLabel(currentFilters[key], threadFilters[key])})
            });
            return (
                <ChipList chips={chips} small={true}/>
            );
        }
    };

    render() {
        const {user, profile, strings, pagination, isSomethingWorking, filters, recommendations, thread, isLoadingRecommendations} = this.props;
        return (
            <div className="view view-main" onScroll={this.handleScroll}>
                {Object.keys(thread).length > 0 ?
                    <TopNavBar leftMenuIcon={true} centerText={strings.discover} rightIcon={'edit'} onRightLinkClickHandler={this.editThread}/>
                    : <TopNavBar leftMenuIcon={true} centerText={strings.discover}/>}
                <div className="page discover-page">
                    <div id="page-content">
                        {this.renderChipList(thread, filters)}
                        <ProcessesProgress />
                        {profile && filters && thread ? <QuestionsBanner user={user} questionsTotal={pagination.total || 0}/> : '' }
                        {profile && recommendations.length > 0 ?
                            <CardUserList recommendations={recommendations} userId={user.id} profile={profile} handleSelectProfile={this.selectProfile}/>
                            :
                            <EmptyMessage text={isLoadingRecommendations ? strings.loadingMessage : strings.noRecommendations}/>}
                        <br />
                        <div className="loading-gif" style={isLoadingRecommendations ? {} : {display: 'none'}}></div>
                    </div>
                </div>
                {profile && !profile.orientation ? <OrientationRequiredPopup profile={profile} onContinue={this.goToProfile}/> : null}
            </div>
        );
    }
};

DiscoverPage.defaultProps = {
    strings: {
        discover         : 'Discover',
        loadingMessage   : 'Loading recommendations',
        noRecommendations: 'There are no recommendations with selected filters'
    }
};