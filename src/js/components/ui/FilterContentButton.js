import PropTypes from 'prop-types';
import React, { Component } from 'react';

export default class FilterContentButton extends Component {

    static propTypes = {
        wrapperClass  : PropTypes.string,
        onClickHandler: PropTypes.func,
        text          : PropTypes.string.isRequired,
        icon          : PropTypes.string.isRequired,
        active        : PropTypes.bool,
        count         : PropTypes.number,
        loading       : PropTypes.bool,
    };

    render() {
        const {wrapperClass, text, active, onClickHandler, count, loading} = this.props;
        const fullWrapperClass = wrapperClass ? active ? wrapperClass + " icons-large-wrapper active" : wrapperClass + " icons-large-wrapper" : active ? "icons-large-wrapper active" : "icons-large-wrapper";
        const iconClass = loading && active ? "icon icon-spinner rotation-animation" : " icon icon-" + this.props.icon;

        return (
            <div className={fullWrapperClass} onClick={onClickHandler} disabled={loading ? 'disabled' : null}>
                <div className={iconClass} disabled={loading ? 'disabled' : null}></div>
                <div className={loading && active ? "icons-large-text spinner-text" : "icons-large-text"}>{count}<br/>{text}</div>
            </div>
        );
    }
}

FilterContentButton.defaultProps = {
    onClickHandler: () => {
    },
    active        : false,
    count         : 0,
    loading       : false
};