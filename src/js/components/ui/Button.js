import PropTypes from 'prop-types';
import React, { Component } from 'react';
import shouldPureComponentUpdate from 'react-pure-render/function';

export default class Button extends Component {

    shouldComponentUpdate = shouldPureComponentUpdate;

    render() {
        return (
            <button {...this.props} className="button button-fill button-round">{this.props.children}</button>
        );
    }
}