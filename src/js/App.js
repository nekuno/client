import PropTypes from 'prop-types';
import React, { Component } from 'react';
import LeftPanel from './components/LeftPanel';
import HomePage from './pages/NewHomePage';
import TranslationProvider from './i18n/TranslationProvider';
import GuestBanner from './components/GuestBanner';
import connectToStores from './utils/connectToStores';
import LoginStore from './stores/LoginStore';
import RouterActionCreators from './actions/RouterActionCreators';
import Framework7Service from './services/Framework7Service';

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
            Framework7Service.nekunoApp().closePanel();
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