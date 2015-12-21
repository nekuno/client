import React, { PropTypes, Component } from 'react';
import { Link } from 'react-router';
import LoginActionCreators from '../actions/LoginActionCreators';

export default class LinksPage extends Component {

    logout(e) {
        e.preventDefault();
        LoginActionCreators.logoutUser();
    }

    render() {
        return (
            <ul>
                <li><Link to="/">Home</Link></li>
                <li><Link to="/splash">Splash</Link></li>
                <li><Link to="/about">About</Link></li>
                <li><Link to="/login">Login</Link></li>
                <li><Link to="" onClick={this.logout}>Logout</Link></li>
            </ul>
        );
    }
}