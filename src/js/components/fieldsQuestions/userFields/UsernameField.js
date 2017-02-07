import React, { PropTypes, Component } from 'react';
import TextInput from '../../ui/TextInput';
import FullWidthButton from '../../ui/FullWidthButton';
import translate from '../../../i18n/Translate';
import  * as UserActionCreators from '../../../actions/UserActionCreators';

@translate('UsernameField')
export default class UsernameField extends Component {
    static propTypes = {
        isUsernameValid: PropTypes.bool,
        username       : PropTypes.string,
        onSaveHandler  : PropTypes.func,
        // Injected by @translate:
        strings        : PropTypes.object
    };

    onUsernameChange() {
        if (typeof this.usernameTimeout !== 'undefined') {
            clearTimeout(this.usernameTimeout);
        }
        this.usernameTimeout = setTimeout(() => {
            let username = this.refs.username.getValue();
            UserActionCreators.validateUsername(username);
        }, 500);
    }
    
    handleClickSave() {
        this.props.onSaveHandler('username', this.refs.username.getValue());
    }

    render() {
        const {username, isUsernameValid, strings} = this.props;
        return (
            <div>
                <div className="answer-question">
                    <div className="title answer-question-title">
                        {strings.title}
                    </div>
                    <div className="list-block">
                        <ul>
                            <TextInput defaultValue={username} placeholder={strings.username} ref="username" maxLength="25" onChange={this.onUsernameChange.bind(this)} style={isUsernameValid ? {} : {color: 'red'}}/>
                        </ul>
                    </div>
                </div>
                <br />
                <br />
                {isUsernameValid ? <FullWidthButton type="submit" onClick={this.handleClickSave.bind(this)}>{strings.save}</FullWidthButton> : null}
            </div>
        );
    }
}

UsernameField.defaultProps = {
    strings: {
        username       : 'username',
        title          : 'Choose your username',
        save           : 'Save',
        invalidUsername: 'This username is not available'
    }
};
