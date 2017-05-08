import React, { PropTypes, Component } from 'react';
import Input from '../../ui/Input';
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
            UserActionCreators.validateUsername(username).then(() => {
                // Username valid
            }).catch(() => {
                nekunoApp.alert(this.props.strings.invalidUsername);
            });
        }, 500);
    }
    
    handleClickSave() {
        const {strings} = this.props;
        let username = this.refs.username.getValue();
        UserActionCreators.validateUsername(username).then(() => {
            this.props.onSaveHandler(username);
        }).catch(() => {
            nekunoApp.alert(strings.invalidUsername);
        });
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
                            <Input defaultValue={username} placeholder={strings.username} ref="username" maxLength="25" onChange={this.onUsernameChange.bind(this)} style={isUsernameValid ? {} : {color: 'red'}}/>
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
        invalidUsername: 'Username is invalid or already in use. Valid characters are letters, numbers and _.'
    }
};
