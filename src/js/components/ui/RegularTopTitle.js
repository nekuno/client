import React, { PropTypes, Component } from 'react';
import shouldPureComponentUpdate from 'react-pure-render/function';

export default class RegularTopTitle extends Component {
    static propTypes = {
        text: PropTypes.string.isRequired,
        textSize: PropTypes.string
    };

    shouldComponentUpdate = shouldPureComponentUpdate;

    render() {
        return (
            <div className={this.props.textSize === 'large' ? "col-50 center large" : "col-50 center"}>
                {this.props.text}
            </div>
        );
    }
}