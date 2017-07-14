import PropTypes from 'prop-types';
import React, { Component } from 'react';
import LoadingSpinnerCSS from './LoadingSpinnerCSS'

export default class FilterContentButton extends Component {

    static propTypes = {
        onClickHandler: PropTypes.func,
        text          : PropTypes.string.isRequired,
        icon          : PropTypes.string.isRequired,
        active        : PropTypes.bool,
        count         : PropTypes.number,
        loading       : PropTypes.bool,
    };

    render() {
        const {text, active, onClickHandler, count, loading} = this.props;
        const iconClass = loading && active ? "icon icon-spinner rotation-animation" : " icon icon-" + this.props.icon;

        return (
            <div className={active ? "icons-large-wrapper active" : "icons-large-wrapper"} onClick={onClickHandler} disabled={loading ? 'disabled' : null}>
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