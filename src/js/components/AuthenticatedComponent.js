import React, { PropTypes, Component } from 'react';
import connectToStores from '../utils/connectToStores';
import LoginStore from '../stores/LoginStore';

export default (ComposedComponent) => {

    function getState(props) {

        return {
            userLoggedIn: LoginStore.isLoggedIn(),
            isGuest     : LoginStore.isGuest(),
            user        : LoginStore.user,
            jwt         : LoginStore.jwt
        };
    }

    @connectToStores([LoginStore], getState)
    class AuthenticatedComponent extends Component {

        static propTypes = {
            // Injected by @connectToStores:
            userLoggedIn: PropTypes.bool,
            isGuest     : PropTypes.bool,
            user        : PropTypes.object,
            jwt         : PropTypes.string
        };

        render() {
            return (
                <ComposedComponent {...this.props} user={this.props.user} jwt={this.props.jwt} userLoggedIn={this.props.userLoggedIn} isGuest={this.props.isGuest}/>
            );
        }
    }

    return AuthenticatedComponent;
};
