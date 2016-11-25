import React, { PropTypes, Component } from 'react';
import shouldPureComponentUpdate from 'react-pure-render/function';

export default class RegularTopTitle extends Component {
    static propTypes = {
        text          : PropTypes.string.isRequired,
        onClickHandler: PropTypes.func,
        textSize      : PropTypes.string,
        bottomText    : PropTypes.string
    };

    shouldComponentUpdate = shouldPureComponentUpdate;

    render() {
        const {text, onClickHandler, textSize, bottomText} = this.props;
        return (
            <div className={textSize === 'large' ? "col-40 center large" : "col-40 center"} onClick={onClickHandler}>
                {text}
                {bottomText ? <div className="bottom-text">{bottomText}</div> : null}
            </div>
        );
    }
}