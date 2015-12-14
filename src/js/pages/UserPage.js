import React, { PropTypes, Component } from 'react';
import * as UserActionCreators from '../actions/UserActionCreators';
import UserStore from '../stores/UserStore';
import User from '../components/User';
import connectToStores from '../utils/connectToStores';

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
    const login = parseLogin(props.params);

    const user = UserStore.get(login);

    return {
        user
    };
}

@connectToStores([UserStore], getState)
export default class UserPage extends Component {
    static propTypes = {
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
        const { user, params } = this.props;
        const login = parseLogin(params);

        return (
            <div>
                {user ?
                    <User user={user}/> :
                    <h1>Loading...</h1>
                }

                <h1>List for user { login }</h1>
                {this.renderList()}
            </div>
        );
    }

    renderList() {
        const { params } = this.props;
        return (
            <div>
                <p>{params.login}</p>
                <ul>
                    <li>1</li>
                    <li>2</li>
                    <li>3</li>
                </ul>
            </div>
        );
    }
}
