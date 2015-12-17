import React, { PropTypes, Component } from 'react';
import { Link } from 'react-router';
import LeftPanel from './components/LeftPanel';
import HomePage from './pages/HomePage';
import * as UserActionCreators from './actions/UserActionCreators';
import UserStore from './stores/UserStore';
import connectToStores from './utils/connectToStores';


function parseLogin(params) {
    return params.login;
}

/**
 * Requests data from server for current props.
 */
function requestData(props) {
    const { params } = props;
    const userLogin = parseLogin(params);

    UserActionCreators.requestUser(userLogin, ['username', 'email', 'picture', 'status']);
}

/**
 * Retrieves state from stores for current props.
 */
function getState(props) {
    const children = props.children;

    const login = parseLogin(props.params);
    const user = UserStore.get(login);

    return {
        'user': user,
        'children': children
    };
}

@connectToStores([UserStore], getState)
export default class App extends Component {
    static propTypes = {
        children: PropTypes.object,
        // Injected by React Router:
        params: PropTypes.shape({
            login: PropTypes.string.isRequired
        }).isRequired,

        // Injected by @connectToStores:
        user: PropTypes.object
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
        const { children, user } = this.props;
        return (
            <div className="App">
                { user ? <LeftPanel user={user} /> : '' }
                <div className="views">
                    {children ? children : <HomePage />}
                </div>
            </div>
        );
    }
}
