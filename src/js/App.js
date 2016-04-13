import React, {PropTypes, Component} from 'react';
import LeftPanel from './components/LeftPanel';
import HomePage from './pages/HomePage';
import TranslationProvider from './i18n/TranslationProvider';
import connectToStores from './utils/connectToStores';
import LoginStore from './stores/LoginStore';

function getState(props) {
    const isLoggedIn = LoginStore.isLoggedIn();
    return {isLoggedIn};
}

@connectToStores([LoginStore], getState)
export default class App extends Component {

    static contextTypes = {
        history: PropTypes.object.isRequired
    };

    static propTypes = {
        children: PropTypes.object,
        // Injected by @connectToStores:
        isLoggedIn: PropTypes.bool.isRequired
    };

    render() {
        const {children, isLoggedIn} = this.props;
        return (
            <TranslationProvider>
                <div className="App">
                    {isLoggedIn ?
                        <LeftPanel/>
                        :
                        ''
                    }
                    <div className="views">
                        {children ? children : <HomePage />}
                    </div>
                </div>
            </TranslationProvider>
        );
    }
}