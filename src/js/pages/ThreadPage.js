import React, { PropTypes, Component } from 'react';
import ThreadList from '../components/threads/ThreadList';
import LeftMenuTopNavbar from '../components/ui/LeftMenuTopNavbar';
import AuthenticatedComponent from '../components/AuthenticatedComponent';
import translate from '../i18n/Translate';
import connectToStores from '../utils/connectToStores';
import * as UserActionCreators from '../actions/UserActionCreators';
import ThreadStore from '../stores/ThreadStore';
import ProfileStore from '../stores/ProfileStore';
import ThreadsByUserStore from '../stores/ThreadsByUserStore';

/**
 * Requests data from server for current props.
 */
function requestData(props) {
    const userId = props.user.id;
    UserActionCreators.requestThreadPage(userId);
    UserActionCreators.requestProfile(userId);
    UserActionCreators.requestFilters(userId);
}

/**
 * Retrieves state from stores for current props.
 */
function getState(props) {
    const threadIds = ThreadsByUserStore.getThreadsFromUser(props.user.id);
    const threads = threadIds ? threadIds.map(ThreadStore.get) : [];
    const profile = ProfileStore.get(props.user.id) || {};
    return {
        threads,
        profile
    };
}

@AuthenticatedComponent
@translate('ThreadPage')
@connectToStores([ThreadStore, ThreadsByUserStore, ProfileStore], getState)
export default class ThreadPage extends Component {

    static propTypes = {
        // Injected by @AuthenticatedComponent
        user   : PropTypes.object.isRequired,
        // Injected by @translate:
        strings: PropTypes.object,
        // Injected by @connectToStores:
        threads: PropTypes.array,
        profile: PropTypes.object
    };

    componentWillMount() {
        requestData(this.props);
    }

    render() {
        const strings = this.props.strings;
        return (
            <div className="view view-main">
                <LeftMenuTopNavbar centerText={strings.threads} centerTextSize={'large'}/>
                <div className="page threads-page">
                    <div id="page-content">
                        <ThreadList threads={this.props.threads} userId={this.props.user.id} profile={this.props.profile}/>
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