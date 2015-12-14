import React, { PropTypes, Component } from 'react';
import shouldPureComponentUpdate from 'react-pure-render/function';

export default class RegularTopTitle extends Component {
    static propTypes = {
        text: PropTypes.string.isRequired
    };

    shouldComponentUpdate = shouldPureComponentUpdate;

    render() {
        return (
            <div className="col-50 center">
                {this.props.text}
            </div>
        );
    }
}