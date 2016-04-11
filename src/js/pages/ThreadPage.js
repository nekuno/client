import React, { PropTypes, Component } from 'react';
import * as UserActionCreators from '../actions/UserActionCreators';
import ThreadStore from '../stores/ThreadStore';
import ProfileStore from '../stores/ProfileStore';
import ThreadsByUserStore from '../stores/ThreadsByUserStore';
import ThreadList from '../components/threads/ThreadList';
import LeftMenuTopNavbar from '../components/ui/LeftMenuTopNavbar';
import connectToStores from '../utils/connectToStores';
import AuthenticatedComponent from '../components/AuthenticatedComponent';

function parseId(params) {
    return params.userId;
}

/**
 * Requests data from server for current props.
 */
function requestData(props) {
    const { params } = props;
    const userId = parseId(params);

    UserActionCreators.requestThreadPage(userId);
    UserActionCreators.requestProfile(userId);
}

/**
 * Retrieves state from stores for current props.
 */
function getState(props) {
    const threadIds = ThreadsByUserStore.getThreadsFromUser(props.user.qnoow_id);
    const threads = threadIds ? threadIds.map(ThreadStore.get) : [];
    let profile = ProfileStore.get(props.user.qnoow_id);
    profile = profile !== undefined? profile : {} ;
    return {
        threads,
        profile
    };
}

@connectToStores([ThreadStore, ThreadsByUserStore, ProfileStore], getState)
export default AuthenticatedComponent(class ThreadPage extends Component {
    static propTypes = {
        // Injected by React Router:
        params: PropTypes.shape({
            userId: PropTypes.string.isRequired
        }).isRequired,

        // Injected by @connectToStores:
        threads: PropTypes.array,
        profile: PropTypes.object
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

        return (
            <div className="view view-main">
                <LeftMenuTopNavbar centerText={'Hilos'} centerTextSize={'large'} />
                <div className="page threads-page">
                    <div id="page-content">
                        <ThreadList threads={this.props.threads} userId={this.props.user.qnoow_id} profile={this.props.profile} />
                    </div>
                </div>
            </div>
        );
    }
});
