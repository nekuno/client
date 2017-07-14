import PropTypes from 'prop-types';
import React, { Component } from 'react';
import translate from '../../i18n/Translate';

@translate('MessagesToolBarDisabled')
export default class MessagesToolBarDisabled extends Component {

    static propTypes = {
        text          : PropTypes.string.isRequired,
        // Injected by @translate:
        strings    : PropTypes.object
    };

    constructor(props) {
        super(props);

        this.alertDisabled=this.alertDisabled.bind(this);
    }

    alertDisabled() {
        nekunoApp.alert(this.props.strings.forbidden);
    }

    render() {
        const {text} = this.props;
        return (
            <div className="toolbar messagebar">
                <div className="toolbar-inner" onClick={this.alertDisabled}>
                    <textarea placeholder={this.props.strings.forbidden} ref="textarea" disabled/>
                    <a className="link" disabled="disabled" style={{color: "#F44336"}}>{text}</a>
                </div>
            </div>
        );
    }
}

MessagesToolBarDisabled.defaultProps = {
    strings: {
        forbidden:'This user does not accept messages right now'
    }
};