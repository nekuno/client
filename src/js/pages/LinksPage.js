import React, { PropTypes, Component } from 'react';
import { Link } from 'react-router';

export default class LinksPage extends Component {

    render() {
        return (
            <ul>
                <li><Link to="/">Home</Link></li>
                <li><Link to="/splash">Splash</Link></li>
                <li><Link to="/about">About</Link></li>
                <li><Link to="/login">Login</Link></li>
            </ul>
        );
    }
}