import React, { PropTypes, Component } from 'react';
import { Link } from 'react-router';
import LoginActionCreators from '../actions/LoginActionCreators';
import connectToStores from '../utils/connectToStores';
import LoginStore from '../stores/LoginStore';

function getState(props) {

    const user = LoginStore.user;
    const isLoggedIn = LoginStore.isLoggedIn();

    return {
        user,
        isLoggedIn
    };
}

@connectToStores([LoginStore], getState)
export default class LinksPage extends Component {

    static propTypes = {
        user      : PropTypes.object,
        isLoggedIn: PropTypes.bool.isRequired
    };

    logout(e) {
        e.preventDefault();
        LoginActionCreators.logoutUser();
    }

    render() {

        const { user, isLoggedIn } = this.props;

        return (
            <ul>
                <li><Link to="/">Home</Link></li>
                <li><Link to="/splash">Splash</Link></li>
                <li><Link to="/about">About</Link></li>
                { isLoggedIn ? <li><Link to="" onClick={this.logout}>Logout ({user.username})</Link></li> : <li><Link to="/login">Login</Link></li> }
            </ul>
        );
    }
}