import React, { PropTypes, Component } from 'react';
import AuthenticatedComponent from '../components/AuthenticatedComponent'

export default AuthenticatedComponent(class AboutPage extends Component {

    render() {
        return (
            <div>
                <h1> {this.props.user ? this.props.user.username + '\'s private stuff' : ''}</h1>
                <h1>About</h1>
                <p>About page</p>
            </div>
        );
    }
});