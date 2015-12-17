import React, { PropTypes, Component } from 'react';
import shouldPureComponentUpdate from 'react-pure-render/function';

export default class FullWidthButton extends Component {
    static propTypes = {
        text: PropTypes.string.isRequired
    };

    shouldComponentUpdate = shouldPureComponentUpdate;

    render() {
        return (
            <button className="button button-fill button-big button-round">{this.props.text}</button>
        );
    }
}