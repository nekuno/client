import React, { PropTypes, Component } from 'react';

export default class EmptyMessage extends Component {

    static propTypes = {
        text      : PropTypes.string.isRequired,
        loadingGif: PropTypes.bool
    };

    render() {
        const {text, loadingGif} = this.props;
        return (
            <div className="empty-message">
                <div className="empty-message-text">{text}</div>
                <div className="empty-message-gif">
                    {loadingGif ? <div className="loading-gif"></div> : ''}
                </div>
            </div>
        );
    }
}