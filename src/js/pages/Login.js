import React, { PropTypes, Component } from 'react';

export default class Login extends Component {

    render() {
        return (
            <div>
                <h1>Login</h1>
                <p>Login page</p>
                <input type="text" name="username"/>
                <input type="password" name="password"/>
            </div>
        );
    }
}