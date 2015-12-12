import React, { Component } from 'react';
import { Router, Route } from 'react-router';

import App from './App';
import About from './pages/About';
import Login from './pages/Login';

export default class Root extends Component {

    render() {
        return (
            <Router>
                <Route name="home" path="/" component={App}>
                    <Route name="about" path="/about" component={About}/>
                    <Route name="login" path="/login" component={Login}/>
                </Route>
            </Router>
        );
    }
}