import PropTypes from 'prop-types';
import React, { Component } from 'react';
import UserPage from './UserPage';
import OtherUserPage from './OtherUserPage';
import SharedUserPage from './SharedUserPage';
import connectToStores from '../utils/connectToStores';
import LoginStore from '../stores/LoginStore';

/**
 * Retrieves state from stores for current props.
 */
function getState(props) {
    const isLoggedIn = LoginStore.isLoggedIn();
    const isTryingToLogin = LoginStore.isTryingToLogin;
    const user = LoginStore.user;

    return {
        isLoggedIn,
        isTryingToLogin,
        user
    };
}

@connectToStores([LoginStore], getState)
export default class ProfilePage extends Component {
    static propTypes = {
        params           : PropTypes.shape({
            slug: PropTypes.string.isRequired
        }).isRequired,
        // Injected by @connectToStores:
        isLoggedIn         : PropTypes.bool,
        isTryingToLogin    : PropTypes.bool,
        user               : PropTypes.object,
    };

    render() {
        const { isLoggedIn, isTryingToLogin, user, params } = this.props;
        const { slug } = params;

        if (isTryingToLogin || user && !user.slug) {
            return null;
        }

        return (
            isLoggedIn ?
                user.slug === slug ?
                    <UserPage {...this.props}/>
                    :
                    <OtherUserPage {...this.props}/>
                :
                <SharedUserPage {...this.props}/>
        );
    }
}