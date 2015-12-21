import React, { PropTypes, Component } from 'react';
import LeftPanel from './components/LeftPanel';
import LinksPage from './pages/LinksPage';
import * as UserActionCreators from './actions/UserActionCreators';
import UserStore from './stores/UserStore';

export default class App extends Component {

    static propTypes = {
        children: PropTypes.object
    };

    render() {
        const { children, user } = this.props;
        return (
            <div className="App">
                { user ? <LeftPanel user={user}/> : '' }
                <div className="views">
                    {children ? children : <LinksPage />}
                </div>
            </div>
        );
    }
}
