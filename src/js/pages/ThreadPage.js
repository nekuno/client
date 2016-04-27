import React, { PropTypes, Component } from 'react';
import ThreadList from '../components/threads/ThreadList';
import LeftMenuRightIconTopNavbar from '../components/ui/LeftMenuRightIconTopNavbar';
import AuthenticatedComponent from '../components/AuthenticatedComponent';
import translate from '../i18n/Translate';
import connectToStores from '../utils/connectToStores';
import * as UserActionCreators from '../actions/UserActionCreators';
import * as ThreadActionCreators from '../actions/ThreadActionCreators';
import ThreadStore from '../stores/ThreadStore';
import ProfileStore from '../stores/ProfileStore';
import ThreadsByUserStore from '../stores/ThreadsByUserStore';
import FilterStore from '../stores/FilterStore';

/**
 * Requests data from server for current props.
 */
function requestData(props) {
    const userId = props.user.id;
    ThreadActionCreators.requestThreadPage(userId);
    UserActionCreators.requestProfile(userId);
    ThreadActionCreators.requestFilters();
}

/**
 * Retrieves state from stores for current props.
 */
function getState(props) {
    const threadIds = ThreadsByUserStore.getThreadsFromUser(props.user.id);
    const threads = threadIds ? threadIds.map(ThreadStore.get) : [];
    const profile = ProfileStore.get(props.user.id) || {};
    const filters = FilterStore.filters;
    return {
        filters,
        threads,
        profile
    };
}

@AuthenticatedComponent
@translate('ThreadPage')
@connectToStores([ThreadStore, ThreadsByUserStore, ProfileStore, FilterStore], getState)
export default class ThreadPage extends Component {

    static propTypes = {
        // Injected by @AuthenticatedComponent
        user   : PropTypes.object.isRequired,
        // Injected by @translate:
        strings: PropTypes.object,
        // Injected by @connectToStores:
        threads: PropTypes.array,
        profile: PropTypes.object,
        filters: PropTypes.object
    };

    static contextTypes = {
        history: PropTypes.object.isRequired
    };

    constructor(props) {
        super(props);

        this.onAddThreadClickHandler = this.onAddThreadClickHandler.bind(this);
    }

    componentWillMount() {
        requestData(this.props);
    }

    onAddThreadClickHandler() {
        this.context.history.pushState(null, '/create-thread');
    }

    render() {
        const {threads, filters, profile, strings, user} = this.props;
        if (!filters || !threads) {
            return null;
        }
        return (
            <div className="view view-main">
                <LeftMenuRightIconTopNavbar centerText={strings.threads} centerTextSize={'large'} rightIcon={'plus'} onRightLinkClickHandler={this.onAddThreadClickHandler}/>
                <div className="page threads-page">
                    <div id="page-content">
                        {filters && threads && profile ?
                            <ThreadList threads={threads} userId={user.id} profile={profile} filters={filters}/> : ''
                        }
                    </div>
                </div>
            </div>
        );
    }
};

ThreadPage.defaultProps = {
    strings: {
        threads: 'Threads'
    }
};