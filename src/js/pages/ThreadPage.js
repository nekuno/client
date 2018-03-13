import PropTypes from 'prop-types';
import React, { Component } from 'react';
import ThreadList from '../components/threads/ThreadList';
import TopNavBar from '../components/ui/TopNavBar';
import QuestionsBanner from '../components/questions/QuestionsBanner';
import EmptyMessage from '../components/ui/EmptyMessage';
import ProcessesProgress from '../components/processes/ProcessesProgress';
import AuthenticatedComponent from '../components/AuthenticatedComponent';
import translate from '../i18n/Translate';
import tutorial from '../components/tutorial/Tutorial';
import connectToStores from '../utils/connectToStores';
import * as UserActionCreators from '../actions/UserActionCreators';
import * as ThreadActionCreators from '../actions/ThreadActionCreators';
import * as QuestionActionCreators from '../actions/QuestionActionCreators';
import ThreadStore from '../stores/ThreadStore';
import ProfileStore from '../stores/ProfileStore';
import FilterStore from '../stores/FilterStore';
import QuestionStore from '../stores/QuestionStore';
import RecommendationStore from '../stores/RecommendationStore';
import WorkersStore from '../stores/WorkersStore';
import Joyride from 'react-joyride';

/**
 * Requests data from server for current props.
 */
function requestData(props) {
    const userId = props.user.id;
    if (ThreadStore.noThreads() || ThreadStore.isAnyPopular()) {
        ThreadActionCreators.requestThreadPage(userId);
        UserActionCreators.requestOwnProfile(props.user.slug);
        ThreadActionCreators.requestFilters();
        QuestionActionCreators.requestQuestions(userId);
    }
}

/**
 * Retrieves state from stores for current props.
 */
function getState(props) {
    const threads = Object.keys(ThreadStore.getAll()).map(threadId => ThreadStore.getAll()[threadId]);
    threads.forEach(thread => {
        thread.disabled = ThreadStore.isDisabled(thread.id);
        thread.isEmpty = RecommendationStore.isEmpty(thread.id);
        thread.cached =  RecommendationStore.getFirst(thread.id, 5);
    });

    const profile = ProfileStore.get(props.user.slug) || {};
    const filters = FilterStore.filters;
    const pagination = QuestionStore.getPagination(props.user.id) || {};
    const isSomethingWorking = WorkersStore.isSomethingWorking();

    return {
        filters,
        threads,
        profile,
        pagination,
        isSomethingWorking
    };
}

@AuthenticatedComponent
@translate('ThreadPage')
@tutorial()
@connectToStores([ThreadStore, RecommendationStore, ProfileStore, FilterStore, WorkersStore], getState)
export default class ThreadPage extends Component {

    static propTypes = {
        // Injected by @AuthenticatedComponent
        user              : PropTypes.object.isRequired,
        // Injected by @translate:
        strings           : PropTypes.object,
        // Injected by @tutorial:
        steps             : PropTypes.array,
        startTutorial     : PropTypes.func,
        resetTutorial     : PropTypes.func,
        endTutorialHandler: PropTypes.func,
        tutorialLocale    : PropTypes.object,
        // Injected by @connectToStores:
        threads           : PropTypes.array,
        profile           : PropTypes.object,
        filters           : PropTypes.object
    };

    static contextTypes = {
        router: PropTypes.object.isRequired
    };

    constructor(props) {
        super(props);

        this.onAddThreadClickHandler = this.onAddThreadClickHandler.bind(this);
    }

    componentWillMount() {
        requestData(this.props);
    }

    componentDidUpdate() {
        if (Object.keys(this.props.threads).length > 0) {
            window.setTimeout(() => this.props.startTutorial(this.refs.joyrideThreads), 1000);
        }
    }

    componentWillUnmount() {
        this.props.resetTutorial(this.refs.joyrideThreads);
    }

    onAddThreadClickHandler() {
        this.context.router.push('/create-thread');
    }

    render() {
        const {threads, filters, profile, strings, user, isSomethingWorking, steps, tutorialLocale, endTutorialHandler} = this.props;
        return (
            <div className="views">
                <TopNavBar leftMenuIcon={true} centerText={strings.threads} centerTextSize={'large'} rightText={strings.create} rightIcon={'plus'} onRightLinkClickHandler={this.onAddThreadClickHandler}/>
                <div className="view view-main">
                    <Joyride ref="joyrideThreads" steps={steps} locale={tutorialLocale} callback={endTutorialHandler} type="continuous"/>
                    <div className="page threads-page">
                        <div id="page-content">
                            <ProcessesProgress />
                            {filters && threads && profile ?
                                <ThreadList threads={threads} userId={user.id} profile={profile} isSomethingWorking={isSomethingWorking} filters={filters}/> : <EmptyMessage text={strings.loadingMessage} loadingGif={true} />
                            }
                            {filters && threads && profile ?
                                <QuestionsBanner user={user} questionsTotal={this.props.pagination.total || 0}/> : ''
                            }
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

ThreadPage.defaultProps = {
    strings: {
        threads                : 'Discover',
        create                 : 'New',
        loadingMessage         : 'Loading yarns',
        tutorialFirstStepTitle : 'Yarns',
        tutorialFirstStep      : 'In a Nekuno yarn you will find that which is most compatible with you; you can delete or edit them to introduce new filters on the issues you want.',
        tutorialSecondStepTitle: 'Create a yarn',
        tutorialSecondStep     : 'Here you can create a new yarn about what most interests you.',
        tutorialThirdStepTitle : 'Menu',
        tutorialThirdStep      : 'This is the button to open the menu and this green dot indicates you have new messages. We invite you to explore all Nekuno! Thank you for participating in this private Beta!'
    },
    steps: [
        {
            titleRef: 'tutorialFirstStepTitle',
            textRef: 'tutorialFirstStep',
            selector: '#joyride-1-yarns',
            position: 'bottom',
        },
        {
            titleRef: 'tutorialSecondStepTitle',
            textRef: 'tutorialSecondStep',
            selector: '#joyride-2-create-yarn',
            position: 'bottom',
        },
        {
            titleRef: 'tutorialThirdStepTitle',
            textRef: 'tutorialThirdStep',
            selector: '#joyride-3-menu',
            position: 'bottom',
        }
    ]
};