import PropTypes from 'prop-types';
import React, { Component } from 'react';

export default class Answer extends Component {
    static propTypes = {
        text          : PropTypes.string,
        answered      : PropTypes.bool.isRequired,
        ownPicture    : PropTypes.string.isRequired,
        defaultPicture: PropTypes.string,
        accepted      : PropTypes.bool,
        locked        : PropTypes.bool,
        grayed        : PropTypes.bool,
    };

    render() {
        const {text, answered, ownPicture, defaultPicture, locked, accepted, grayed} = this.props;
        const prefix = answered ? 'answer-answered' : 'answer-not-answered';

        return (
            <div className={`${prefix}`}>
                <div className={`${prefix}-picture`}>
                    <img src={answered ? ownPicture : defaultPicture}/>
                </div>
                
                { locked ?
                    <div className="answer-locked-text">
                        <span className="text-placeholder"></span>
                        <span className="lock mdi mdi-lock"></span>
                    </div>
                    :
                    <div className={`${prefix}-text ${grayed ? 'grayed' : ''}`} style={accepted ? {} : {textDecoration: "line-through"}}>
                        {text || ''}
                    </div>
                }
            </div>
        );
    }
}
