import React, { PropTypes, Component } from 'react';
import * as UserActionCreators from '../actions/UserActionCreators';
import ThreadStore from '../stores/ThreadStore';
import ThreadList from '../components/threads/ThreadList';
import LeftMenuTopNavbar from '../components/ui/LeftMenuTopNavbar';
import connectToStores from '../utils/connectToStores';
import AuthenticatedComponent from '../components/AuthenticatedComponent';

function parseLogin(params) {
    return params.login;
}

/**
 * Requests data from server for current props.
 */
function requestData(props) {
    const { params } = props;
    const userLogin = parseLogin(params);

    UserActionCreators.requestThreads(userLogin);

}

/**
 * Retrieves state from stores for current props.
 */
function getState(props) {
    const threads = ThreadStore.getAll();

    return {
        threads
    };
}

@connectToStores([ThreadStore], getState)
export default AuthenticatedComponent(class ThreadPage extends Component {
    static propTypes = {
        // Injected by React Router:
        params: PropTypes.shape({
            login: PropTypes.string.isRequired
        }).isRequired,

        // Injected by @connectToStores:
        threads: PropTypes.object
    };

    componentWillMount() {
        requestData(this.props);
    }

    componentWillReceiveProps(nextProps) {
        if (parseLogin(nextProps.params) !== parseLogin(this.props.params)) {
            requestData(nextProps);
        }
    }

    render() {

        return (
            <div className="view view-main">
                <LeftMenuTopNavbar centerText={'Hilos'} />
                <div data-page="index" className="page threads-page">
                    <div id="page-content">
                        <ThreadList threads={this.props.threads} userId={this.props.user.qnoow_id} />
                    </div>
                </div>
            </div>
        );
    }
});
