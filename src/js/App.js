import React, { PropTypes, Component } from 'react';
import LeftPanel from './components/LeftPanel';
import HomePage from './pages/HomePage';
import TranslationProvider from './i18n/TranslationProvider';
import GuestBanner from './components/GuestBanner';
import connectToStores from './utils/connectToStores';
import LoginStore from './stores/LoginStore';
import RouterActionCreators from './actions/RouterActionCreators';

function getState(props) {
    const isLoggedIn = LoginStore.isLoggedIn();
    const isGuest = LoginStore.isGuest();
    return {isLoggedIn, isGuest};
}

@connectToStores([LoginStore], getState)
export default class App extends Component {

    static contextTypes = {
        router: PropTypes.object.isRequired
    };

    static propTypes = {
        children  : PropTypes.object,
        // Injected by @connectToStores:
        isLoggedIn: PropTypes.bool.isRequired,
        isGuest   : PropTypes.bool.isRequired
    };

    componentWillReceiveProps(nextProps) {
        const routeChanged = nextProps.location.pathname !== this.props.location.pathname;
        if (routeChanged) {
            setTimeout(() => RouterActionCreators.nextRoute(nextProps.location.pathname), 0);
        }
    }

    render() {
        const {children, isLoggedIn, isGuest} = this.props;
        return (
            <TranslationProvider>
                <div className="App">
                    { isLoggedIn ? <LeftPanel/> : '' }
                    { children ? children : <HomePage {...this.props}/> }
                    { isGuest ? <GuestBanner/> : ''}
                </div>
            </TranslationProvider>
        );
    }
}