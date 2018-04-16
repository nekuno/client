import PropTypes from 'prop-types';
import React, { Component } from 'react';
import Input from '../../ui/Input';
import FullWidthButton from '../../ui/FullWidthButton';
import translate from '../../../i18n/Translate';
import  * as UserActionCreators from '../../../actions/UserActionCreators';
import Framework7Service from '../../../services/Framework7Service';

@translate('UsernameField')
export default class UsernameField extends Component {
    static propTypes = {
        isUsernameValid: PropTypes.bool,
        username       : PropTypes.string,
        onSaveHandler  : PropTypes.func,
        // Injected by @translate:
        strings        : PropTypes.object
    };

    constructor(props) {
        super(props);

        this.state = {
            registering      : false,
            validationPromise: Promise.resolve(true)
        };
    }

    onUsernameChange() {
        const {validationPromise} = this.state;
        if (typeof validationPromise.cancel !== 'undefined') {
            validationPromise.cancel();
        }

        if (typeof this.usernameTimeout !== 'undefined') {
            clearTimeout(this.usernameTimeout);
        }
        this.usernameTimeout = setTimeout(() => {
            let username = this.refs.username.getValue();
            let newPromise = UserActionCreators.validateUsername(username).then(() => {
                // Username valid
            }).catch(() => {
                Framework7Service.nekunoApp().alert(this.props.strings.invalidUsername);
            });
            this.setState({validationPromise: newPromise});
        }, 1000);
    }
    
    handleClickSave() {
        const {strings} = this.props;
        this.setState({registering: true});
        let username = this.refs.username.getValue();
        UserActionCreators.validateUsername(username).then(() => {
            this.props.onSaveHandler(username);
        }).catch(() => {
            this.setState({registering: false});
            Framework7Service.nekunoApp().alert(strings.invalidUsername);
        });
    }

    render() {
        const {username, isUsernameValid, strings} = this.props;
        const {registering} = this.state;
        return (
            <div>
                <div className="answer-question username-question">
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
                {!registering && isUsernameValid ? <FullWidthButton type="submit" onClick={this.handleClickSave.bind(this)}>{strings.save}</FullWidthButton> : null}
            </div>
        );
    }
}

UsernameField.defaultProps = {
    strings: {
        username       : 'username',
        title          : 'Choose your username',
        save           : 'Continue',
        invalidUsername: 'Username is invalid or already in use. Valid characters are letters, numbers and _.'
    }
};
