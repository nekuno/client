import React, { PropTypes, Component } from 'react';
import LeftPanel from './components/LeftPanel';
import HomePage from './pages/HomePage';
import * as UserActionCreators from './actions/UserActionCreators';
import LoginStore from './stores/LoginStore';
import RegisterStore from './stores/RegisterStore';
import RouterStore from './stores/RouterStore';
import RouterActionCreators from './actions/RouterActionCreators';

export default class App extends Component {

    static propTypes = {
        children: PropTypes.object
    };

    constructor() {
        super();

        //set initial state dircetly when extending React.Component
        //use getInitialState hook when using React.createClass();
        this.state = this._getLoginState();
    }

    static contextTypes = {
        history: PropTypes.object.isRequired
    };

    _getLoginState() {
        return {
            user        : LoginStore.user,
            userLoggedIn: LoginStore.isLoggedIn(),
            userRegistered: RegisterStore.user
        };
    }

    componentWillMount() {
        //register change listener with LoginStore
        this.changeListener = this._onLoginChange.bind(this);
        LoginStore.addChangeListener(this.changeListener);
    }

    /*
     This event handler deals with all code-initiated routing transitions
     when logging in or logging out
     */
    _onLoginChange() {
        //get a local up-to-date record of the logged-in state
        //see https://facebook.github.io/react/docs/component-api.html
        let userLoggedInState = this._getLoginState();
        this.setState(userLoggedInState);

        //get any nextTransitionPath - NB it can only be got once then it self-nullifies
        let transitionPath = RouterStore.nextTransitionPath || '/';

        const userJustRegistered = userLoggedInState.userRegistered !== null;

        //trigger router change
        console.log("&*&*&* App onLoginChange event: loggedIn=", userLoggedInState.userLoggedIn, "nextTransitionPath=", transitionPath);

        if (userLoggedInState.userLoggedIn) {
            let nextPath = userJustRegistered ? '/register-questions-landing' : '/threads/' + userLoggedInState.user.qnoow_id;
            setTimeout(() => {
                this.context.history.replaceState(null, nextPath);
            });
        } else {
            this.context.history.replaceState(null, '/login');
        }
    }

    componentWillUnmount() {
        LoginStore.removeChangeListener(this.changeListener);
    }

    render() {
        const { children } = this.props;
        return (
            <div className="App">
                <LeftPanel/>
                <div className="views">
                    {children ? children : <HomePage />}
                </div>
            </div>
        );
    }
}