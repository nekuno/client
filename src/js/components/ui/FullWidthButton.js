import React, { PropTypes, Component } from 'react';
import shouldPureComponentUpdate from 'react-pure-render/function';

export default class FullWidthButton extends Component {

    shouldComponentUpdate = shouldPureComponentUpdate;

    render() {
        return (
            <button {...this.props} className="button button-fill button-big button-round">{this.props.children}</button>
        );
    }
}