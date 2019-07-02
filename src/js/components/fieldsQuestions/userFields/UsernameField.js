import PropTypes from 'prop-types';
import React, { Component } from 'react';
import Input from '../../ui/Input/index';
import FullWidthButton from '../../ui/FullWidthButton';
import translate from '../../../i18n/Translate';
import * as UserActionCreators from '../../../actions/UserActionCreators';
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
            validationPromise: Promise.resolve(true),
            shownameCoupled  : true,
            shownameEntered  : false,
        };

        this.onUsernameChange = this.onUsernameChange.bind(this);
        this.onShownameChange = this.onShownameChange.bind(this);
    }

    //https://gist.github.com/hagemann/382adfc57adbd5af078dc93feef01fe1
    slugify(string) {
        const a = 'àáäâãåăæçèéëêǵḧìíïîḿńǹñòóöôœøṕŕßśșțùúüûǘẃẍÿź·/_,:;';
        const b = 'aaaaaaaaceeeeghiiiimnnnooooooprssstuuuuuwxyz------';
        const p = new RegExp(a.split('').join('|'), 'g');
        return string.toString().toLowerCase()
            .replace(/\s+/g, '-') // Replace spaces with -
            .replace(p, c => b.charAt(a.indexOf(c))) // Replace special characters
            .replace(/&/g, '-and-') // Replace & with ‘and’
            .replace(/[^\w\-]+/g, '') // Remove all non-word characters
            .replace(/\-\-+/g, '-') // Replace multiple - with single -
            .replace(/^-+/, '') // Trim - from start of text
            .replace(/-+$/, '') // Trim - from end of text
    }

    onShownameChange() {
        const {shownameCoupled} = this.state;
        if (!shownameCoupled) {
            return;
        }

        const showname = this.showname.getValue();
        const slug = this.slugify(showname);

        if (slug.length > 2) {
            this.username.setValue(slug);
            this.setState({shownameEntered: true})
        }
    }

    onUsernameChange(byUser = false) {
        if (byUser) {
            this.setState({shownameCoupled: false});
        }
        const {validationPromise} = this.state;
        if (typeof validationPromise.cancel !== 'undefined') {
            validationPromise.cancel();
        }

        if (typeof this.usernameTimeout !== 'undefined') {
            clearTimeout(this.usernameTimeout);
        }
        this.usernameTimeout = setTimeout(() => {
            let username = this.username.getValue();
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
        let username = this.username.getValue();
        let showname = this.showname.getValue();
        UserActionCreators.validateUsername(username).then(() => {
            this.props.onSaveHandler(username, showname);
        }).catch(() => {
            this.setState({registering: false});
            Framework7Service.nekunoApp().alert(strings.invalidUsername);
        });
    }

    render() {
        const {username, isUsernameValid, strings} = this.props;
        const {registering, shownameEntered} = this.state;
        const shownameClass = shownameEntered ? "" : "showname-hidden";
        return (
            <div>
                <div className="answer-question username-question">

                    <div className="list-block">
                        <div className="title answer-question-title">
                            {strings.showname}
                        </div>
                        <ul>
                            <Input defaultValue={username} placeholder={strings.showname} ref={c => this.showname = c} maxLength="25" onChange={this.onShownameChange.bind(this)} style={isUsernameValid ? {} : {color: 'red'}}/>
                        </ul>
                        <div className={shownameClass}>
                            <div className="title answer-question-title">
                                {strings.title}
                            </div>
                            <ul>
                                <Input defaultValue={username} placeholder={strings.username} ref={c => this.username = c} maxLength="25" onChange={this.onUsernameChange.bind(this, true)} style={isUsernameValid ? {} : {color: 'red'}}/>
                            </ul>
                        </div>
                    </div>
                </div>
                <br/>
                <br/>
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
