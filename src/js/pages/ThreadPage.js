import React, { PropTypes, Component } from 'react';
import * as UserActionCreators from '../actions/UserActionCreators';
import ThreadStore from '../stores/ThreadStore';
import ThreadsByUserStore from '../stores/ThreadsByUserStore';
import ThreadList from '../components/threads/ThreadList';
import LeftMenuTopNavbar from '../components/ui/LeftMenuTopNavbar';
import AuthenticatedComponent from '../components/AuthenticatedComponent';
import translate from '../i18n/Translate';
import connectToStores from '../utils/connectToStores';

function parseId(params) {
    return params.userId;
}

/**
 * Requests data from server for current props.
 */
function requestData(props) {
    const userId = parseId(props.params);
    UserActionCreators.requestThreadPage(userId);
}

/**
 * Retrieves state from stores for current props.
 */
function getState(props) {
    const threadIds = ThreadsByUserStore.getThreadsFromUser(props.user.qnoow_id);
    const threads = threadIds ? threadIds.map(ThreadStore.get) : [];

    return {
        threads
    };
}

@AuthenticatedComponent
@translate('ThreadPage')
@connectToStores([ThreadStore, ThreadsByUserStore], getState)
export default class ThreadPage extends Component {
    static propTypes = {
        // Injected by React Router:
        params : PropTypes.shape({
            userId: PropTypes.string.isRequired
        }).isRequired,
        // Injected by @AuthenticatedComponent
        user   : PropTypes.object.isRequired,
        // Injected by @translate:
        strings: PropTypes.object,
        // Injected by @connectToStores:
        threads: PropTypes.array

    };

    componentWillMount() {
        requestData(this.props);
    }

    componentWillReceiveProps(nextProps) {
        if (parseId(nextProps.params) !== parseId(this.props.params)) {
            requestData(nextProps);
        }
    }

    render() {
        const strings = this.props.strings;
        return (
            <div className="view view-main">
                <LeftMenuTopNavbar centerText={strings.threads} centerTextSize={'large'}/>
                <div className="page threads-page">
                    <div id="page-content">
                        <ThreadList threads={this.props.threads} userId={this.props.user.qnoow_id}/>
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