import React, { PropTypes, Component } from 'react';
import ReactMixin from 'react-mixin';
import { History } from 'react-router'
import LeftPanel from './components/LeftPanel';
import LinksPage from './pages/LinksPage';
import * as UserActionCreators from './actions/UserActionCreators';
import LoginStore from './stores/LoginStore';
import RouterStore from './stores/RouterStore';
import LoginActionCreators from './actions/LoginActionCreators';

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

    _getLoginState() {
        return {
            userLoggedIn: LoginStore.isLoggedIn()
        };
    }

    componentDidMount() {
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

        //trigger router change
        console.log("&*&*&* App onLoginChange event: loggedIn=", userLoggedInState.userLoggedIn,
            "nextTransitionPath=", transitionPath);

        if (userLoggedInState.userLoggedIn) {
            this.history.replaceState(null, transitionPath)
        } else {
            this.history.replaceState(null, '/login')
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
                    {children ? children : <LinksPage />}
                </div>
            </div>
        );
    }
}

ReactMixin.onClass(App, History);