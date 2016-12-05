import React, { PropTypes, Component } from 'react';
import LeftPanel from './components/LeftPanel';
import HomePage from './pages/HomePage';
import TranslationProvider from './i18n/TranslationProvider';
import GuestBanner from './components/GuestBanner';
import connectToStores from './utils/connectToStores';
import LoginStore from './stores/LoginStore';

function getState(props) {
    const isLoggedIn = LoginStore.isLoggedIn();
    const isGuest = LoginStore.isGuest();
    return {isLoggedIn, isGuest};
}

@connectToStores([LoginStore], getState)
export default class App extends Component {

    static contextTypes = {
        history: PropTypes.object.isRequired
    };

    static propTypes = {
        children  : PropTypes.object,
        // Injected by @connectToStores:
        isLoggedIn: PropTypes.bool.isRequired,
        isGuest   : PropTypes.bool.isRequired
    };

    render() {
        const {children, isLoggedIn, isGuest} = this.props;
        return (
            <TranslationProvider>
                <div className="App">
                    { isLoggedIn ? <LeftPanel/> : '' }
                    <div className="views">
                        {children ? children : <HomePage {...this.props}/>}
                    </div>
                    { isGuest ? <GuestBanner/> : ''}
                </div>
            </TranslationProvider>
        );
    }
}