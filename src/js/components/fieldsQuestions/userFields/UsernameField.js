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

        this.onShownameChange = this.onShownameChange.bind(this);
    }
	
	randomize(length) {
		return Math.round((Math.pow(26, length + 1) - Math.random() * Math.pow(26, length))).toString(26).slice(1);
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
        const slug = (this.randomize(6) + '_' + this.slugify(showname)).substr(0, 25);
        this.setState({shownameEntered: true, username: slug});
    }

    handleClickSave() {
        const {strings} = this.props;
        this.setState({registering: true});
        let username = this.state.username;
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
        const {registering} = this.state;
        return (
            <div>
                <div className="answer-question username-question">

                    <div className="list-block">
                        <div className="title answer-question-title">
                            {strings.showname}
                        </div>
                        <ul>
                            <Input defaultValue={username} placeholder={strings.username} ref={c => this.showname = c} maxLength="25" onChange={this.onShownameChange.bind(this)} style={isUsernameValid ? {} : {color: 'red'}}/>
                        </ul>
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
