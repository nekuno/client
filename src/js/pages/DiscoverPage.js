import React, { PropTypes, Component } from 'react';
import TopNavBar from '../components/ui/TopNavBar';
import CardUserList from '../components/user/CardUserList';
import QuestionsBanner from '../components/questions/QuestionsBanner';
import ProcessesProgress from '../components/processes/ProcessesProgress';
import AuthenticatedComponent from '../components/AuthenticatedComponent';
import translate from '../i18n/Translate';
import tutorial from '../components/tutorial/Tutorial';
import connectToStores from '../utils/connectToStores';
import * as ThreadActionCreators from '../actions/ThreadActionCreators';
import * as QuestionActionCreators from '../actions/QuestionActionCreators';
import ThreadStore from '../stores/ThreadStore';
import FilterStore from '../stores/FilterStore';
import QuestionStore from '../stores/QuestionStore';
import RecommendationStore from '../stores/RecommendationStore';
import WorkersStore from '../stores/WorkersStore';
import Joyride from 'react-joyride';

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
    if (ThreadStore.noThreads() || ThreadStore.isAnyPopular()) {
        ThreadActionCreators.requestThreadPage(userId);
        ThreadActionCreators.requestFilters();
        QuestionActionCreators.requestQuestions(userId);
    }
}

/**
 * Retrieves state from stores for current props.
 */
function getState(props) {

    let userId = parseId(props.user);
    let pagination = QuestionStore.getPagination(userId) || {};
    let isSomethingWorking = WorkersStore.isSomethingWorking();
    let filters = {};
    let recommendations = [];
    let thread = ThreadStore.getAll().find((thread) => {
            recommendations = RecommendationStore.get(parseThreadId(thread)) || [];
            return recommendations.length > 0;
        }) || {};
    if (parseThreadId(thread)) {
        if (Object.keys(thread).length !== 0) {
            thread.isEmpty = RecommendationStore.isEmpty(parseThreadId(thread));
        }
        filters = FilterStore.filters;
        recommendations = RecommendationStore.get(parseThreadId(thread)) ? RecommendationStore.get(parseThreadId(thread)) : [];
    }

    return {
        pagination,
        isSomethingWorking,
        filters,
        recommendations,
        thread,
    };
}

@AuthenticatedComponent
@translate('DiscoverPage')
@tutorial()
@connectToStores([ThreadStore, RecommendationStore, FilterStore, WorkersStore], getState)
export default class DiscoverPage extends Component {

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
        pagination        : PropTypes.object,
        isSomethingWorking: PropTypes.bool,
        filters           : PropTypes.object,
        recommendations   : PropTypes.array,
        thread            : PropTypes.object
    };

    static contextTypes = {
        history: PropTypes.object.isRequired
    };

    constructor(props) {
        super(props);

        this.editThread = this.editThread.bind(this);
    }

    componentWillMount() {
        requestData(this.props);
    }

    componentDidUpdate() {
        if (this.props.thread) {
            window.setTimeout(() => this.props.startTutorial(this.refs.joyrideThreads), 1000);
        }
    }

    componentWillUnmount() {
        this.props.resetTutorial(this.refs.joyrideThreads);
    }

    editThread() {
        this.context.history.pushState(null, `edit-thread/${parseThreadId(this.props.thread)}`);
    }

    render() {
        const {user, strings, steps, endTutorialHandler, tutorialLocale, pagination, isSomethingWorking, filters, recommendations, thread} = this.props;
        return (
            <div className="view view-main">
                {Object.keys(thread).length > 0 ?
                    <TopNavBar leftMenuIcon={true} centerText={strings.discover} rightIcon={'edit'} onRightLinkClickHandler={this.editThread}/>
                    : <TopNavBar leftMenuIcon={true} centerText={strings.discover}/>}
                <Joyride ref="joyrideThreads" steps={steps} locale={tutorialLocale} callback={endTutorialHandler} type="continuous"/>
                <div className="page discover-page">
                    <div id="page-content">
                        <ProcessesProgress />
                        {filters && thread ? <QuestionsBanner user={user} questionsTotal={pagination.total || 0}/> : '' }
                        <CardUserList recommendations={recommendations} userId={user.id} s/>
                    </div>
                </div>
            </div>
        );
    }
};

DiscoverPage.defaultProps = {
    strings: {
        discover               : 'Discover',
        create                 : 'New',
        loadingMessage         : 'Loading yarns',
        tutorialFirstStepTitle : 'Yarns',
        tutorialFirstStep      : 'In a Nekuno yarn you will find that which is most compatible with you; you can delete or edit them to introduce new filters on the issues you want.',
        tutorialSecondStepTitle: 'Create a yarn',
        tutorialSecondStep     : 'Here you can create a new yarn about what most interests you.',
        tutorialThirdStepTitle : 'Menu',
        tutorialThirdStep      : 'This is the button to open the menu and this green dot indicates you have new messages. We invite you to explore all Nekuno! Thank you for participating in this private Beta!'
    },
    steps  : [
        {
            titleRef: 'tutorialFirstStepTitle',
            textRef : 'tutorialFirstStep',
            selector: '#joyride-1-yarns',
            position: 'bottom',
        },
        {
            titleRef: 'tutorialSecondStepTitle',
            textRef : 'tutorialSecondStep',
            selector: '#joyride-2-create-yarn',
            position: 'bottom',
        },
        {
            titleRef: 'tutorialThirdStepTitle',
            textRef : 'tutorialThirdStep',
            selector: '#joyride-3-menu',
            position: 'bottom',
        }
    ]
};