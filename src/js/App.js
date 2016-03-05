import React, { PropTypes, Component } from 'react';
import LeftPanel from './components/LeftPanel';
import HomePage from './pages/HomePage';
import * as UserActionCreators from './actions/UserActionCreators';
import LoginStore from './stores/LoginStore';
import RouterStore from './stores/RouterStore';

export default class App extends Component {

    static contextTypes = {
        history: PropTypes.object.isRequired
    };

    static propTypes = {
        children: PropTypes.object
    };

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