import React, { PropTypes, Component } from 'react';
import shouldPureComponentUpdate from 'react-pure-render/function';

export default class RegularTopTitle extends Component {
    static propTypes = {
        text: PropTypes.string.isRequired,
        textSize: PropTypes.string
    };

    shouldComponentUpdate = shouldPureComponentUpdate;

    render() {
        const {textSize, text} = this.props;
        return (
            <div className={textSize === 'large' ? "col-40 center large" : "col-40 center"}>
                {text}
            </div>
        );
    }
}