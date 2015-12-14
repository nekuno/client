import React, { PropTypes, Component } from 'react';
import shouldPureComponentUpdate from 'react-pure-render/function';

export default class Button extends Component {
    static propTypes = {
        text: PropTypes.string.isRequired
    };

    shouldComponentUpdate = shouldPureComponentUpdate;

    render() {
        return (
            <a href="#" className="button button-fill button-round">{this.props.text}</a>
        );
    }
}