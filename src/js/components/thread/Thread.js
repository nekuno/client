import React, { PropTypes, Component } from 'react';
import shouldPureComponentUpdate from 'react-pure-render/function';

export default class Thread extends Component {
    static propTypes = {
        thread: PropTypes.object.isRequired
    };

    shouldComponentUpdate = shouldPureComponentUpdate;

    render() {
        return (
            <div>{this.props.thread.name}</div>
        );
    }
}