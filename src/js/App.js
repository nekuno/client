import React, { PropTypes, Component } from 'react';
import { Link } from 'react-router'

export default class App extends Component {
    static propTypes = {
        children: PropTypes.object
    };

    render() {
        return (
            <div className="App">
                <h1>Nekuno</h1>
                <ul>
                    <li><Link to="/">Home</Link></li>
                    <li><Link to="/about">About</Link></li>
                    <li><Link to="/login">Login</Link></li>
                </ul>
                <hr />
                {this.props.children}
            </div>
        );
    }
}
