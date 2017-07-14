import PropTypes from 'prop-types';
import React, { Component } from 'react';

export default class EmptyMessage extends Component {

    static propTypes = {
        text          : PropTypes.string.isRequired,
        loadingGif    : PropTypes.bool,
        shortMarginTop: PropTypes.bool,
    };

    render() {
        const {text, loadingGif, shortMarginTop} = this.props;
        return (
            <div className={shortMarginTop ? "short-margin-top empty-message" : "empty-message"}>
                <div className="empty-message-text">{text}</div>
                <div className="empty-message-gif">
                    {loadingGif ? <div className="loading-gif"></div> : ''}
                </div>
            </div>
        );
    }
}