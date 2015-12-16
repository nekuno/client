import React, { Component } from 'react';
import { Router, Route } from 'react-router';

import App from './App';
import AboutPage from './pages/AboutPage';
import LoginPage from './pages/LoginPage';
import UserPage from './pages/UserPage';
import ThreadPage from './pages/ThreadPage'

export default class Root extends Component {

    render() {
        return (
            <Router>
                <Route name="home" path="/" component={App}>
                    <Route name="about" path="/about" component={AboutPage}/>
                    <Route name="login" path="/login" component={LoginPage}/>
                    <Route name="user" path="/login/:login" component={UserPage}/>
                    <Route name="threads" path="/threads/:login" component={ThreadPage}/>
                </Route>
            </Router>
        );
    }
}