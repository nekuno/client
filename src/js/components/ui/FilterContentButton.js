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
        grayed        : PropTypes.bool,
    };

    render() {
        const {wrapperClass, text, active, onClickHandler, count, loading, grayed} = this.props;
        const fullWrapperClass = `${wrapperClass || ''} icons-large-wrapper ${active ? 'active' : ''} ${grayed && !active ? 'grayed' : ''}`;
        const iconClass = loading && active ? "icon icon-spinner rotation-animation" : " mdi mdi-" + this.props.icon;

        return (
            <div className={fullWrapperClass} onClick={onClickHandler} disabled={loading ? 'disabled' : null}>
                <div className="icon-box">
                    <span className={iconClass} disabled={loading ? 'disabled' : null}></span>
                </div>
                <div className={loading && active ? "icons-large-text spinner-text" : "icons-large-text"}>{count}{/*<br/>{text}*/}</div>
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