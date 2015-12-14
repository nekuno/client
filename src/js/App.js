import React, { PropTypes, Component } from 'react';
import { Link } from 'react-router';

export default class App extends Component {
    static propTypes = {
        children: PropTypes.object
    };

    render() {
        return (
            <div className="App">
                <div className="panel-overlay"></div>
                <div className="panel panel-left panel-reveal">
                    <div className="content-block">
                        <p>Left Panel content here</p>
                        <span className="icon-delete"></span>
                        <p><a href="#" className="close-panel">Close me</a></p>
                    </div>
                </div>
                <div className="views">
                    {this.props.children}
                </div>
            </div>
        );
    }
}
