import React, { PropTypes, Component } from 'react';
import SearchUser from '../components/SearchUser';

export default class LoginPage extends Component {

    render() {
        return (
            <div>
                <h1>Login</h1>
                <p>Login page</p>
                <SearchUser {...this.props} />
            </div>
        );
    }
}