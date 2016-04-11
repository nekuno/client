import React, {PropTypes, Component} from 'react';
import LeftPanel from './components/LeftPanel';
import HomePage from './pages/HomePage';
import TranslationProvider from './i18n/TranslationProvider';

export default class App extends Component {

    static contextTypes = {
        history: PropTypes.object.isRequired
    };

    static propTypes = {
        children: PropTypes.object
    };

    render() {
        const {children} = this.props;
        return (
            <TranslationProvider>
                <div className="App">
                    <LeftPanel/>
                    <div className="views">
                        {children ? children : <HomePage />}
                    </div>
                </div>
            </TranslationProvider>
        );
    }
}