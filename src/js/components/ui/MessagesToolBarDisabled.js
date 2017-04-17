import React, { PropTypes, Component } from 'react';
import { MAX_MESSAGES_LENGTH } from '../../constants/Constants';
import translate from '../../i18n/Translate';

export default class MessagesToolBarDisabled extends Component {

    static propTypes = {
        placeholder   : PropTypes.string.isRequired,
        text          : PropTypes.string.isRequired,
        // Injected by @translate:
        strings    : PropTypes.object
    };

    constructor(props) {
        super(props);
    }

    alertDisabled() {
        nekunoApp.alert('This user do not accept messages right now');
    }

    render() {
        const {placeholder, text} = this.props;
        return (
            <div className="toolbar messagebar">
                <div className="toolbar-inner" onClick={this.alertDisabled}>
                    <textarea placeholder={placeholder} ref="textarea" disabled/>
                    <a className="link" disabled="disabled" style={{color: "#F44336"}}>{text}</a>
                </div>
            </div>
        );
    }
}