import React, { PropTypes, Component } from 'react';
import selectn from 'selectn';
import RegularTopNavbar from '../components/ui/RegularTopNavbar';
import TextInput from '../components/ui/TextInput';
import PasswordInput from '../components/ui/PasswordInput';
import DateInput from '../components/ui/DateInput';
import LocationInput from '../components/ui/LocationInput';
import FullWidthButton from '../components/ui/FullWidthButton';
import InputCheckbox from '../components/ui/InputCheckbox';
import TextRadios from '../components/ui/TextRadios';
import translate from '../i18n/Translate';
import connectToStores from '../utils/connectToStores';
import LoginActionCreators from '../actions/LoginActionCreators';
import ConnectActionCreators from '../actions/ConnectActionCreators';
import * as UserActionCreators from '../actions/UserActionCreators';
import ConnectStore from '../stores/ConnectStore';
import ProfileStore from '../stores/ProfileStore';
import RegisterStore from '../stores/RegisterStore';
import { getValidationErrors } from '../utils/StoreUtils';

function getState(props) {

    const token = ConnectStore.token;
    const accessToken = ConnectStore.accessToken;
    const resource = ConnectStore.resource;
    const userId = ConnectStore.userId;
    const profile = ConnectStore.profile;
    const metadata = ProfileStore.getMetadata();
    const error = RegisterStore.error;
    const validUsername = RegisterStore.validUsername();

    if (error) {
        let displayErrors = getValidationErrors(error);
        if (displayErrors) {
            nekunoApp.alert(displayErrors);
        }
    }

    if (!validUsername) {
        nekunoApp.alert(props.strings.notAvailable);
    }

    return {
        token,
        accessToken,
        resource,
        userId,
        profile,
        metadata,
        error,
        validUsername
    };
}

@translate('RegisterJoinPage')
@connectToStores([ConnectStore, ProfileStore, RegisterStore], getState)
export default class RegisterJoinPage extends Component {

    static contextTypes = {
        history: PropTypes.object.isRequired
    };

    static propTypes = {
        // Injected by @translate:
        strings      : PropTypes.object,
        // Injected by @connectToStores:
        token        : PropTypes.string,
        accessToken  : PropTypes.string,
        resource     : PropTypes.string,
        userId       : PropTypes.string,
        profile      : PropTypes.object,
        metadata     : PropTypes.object,
        error        : PropTypes.object,
        validUsername: PropTypes.bool
    };

    constructor() {
        super();
        this.onUsernameChange = this.onUsernameChange.bind(this);
        this.onClickGender = this.onClickGender.bind(this);
        this.onClickDescriptiveGender = this.onClickDescriptiveGender.bind(this);
        this.onSuggestSelect = this.onSuggestSelect.bind(this);
        this.onClickShowDescriptiveGender = this.onClickShowDescriptiveGender.bind(this);
        this.state = {
            gender               : '',
            location             : {},
            descriptiveGender    : [],
            showDescriptiveGender: false
        };
    }

    register(e) {
        e.preventDefault();
        let user = {
            username     : this.refs.username.getValue(),
            plainPassword: this.refs.plainPassword.getValue(),
            email        : this.refs.email.getValue(),
            picture      : this.props.profile.picture
        };
        let profile = {
            interfaceLanguage  : 'es',
            orientationRequired: false,
            birthday           : this.refs.birthday.getValue(),
            gender             : this.state.gender,
            descriptiveGender  : this.state.descriptiveGender,
            location           : this.state.location
        };
        let token = this.props.token;
        let oauth = {
            accessToken: this.props.accessToken,
            resource   : this.props.resource
        };

        switch (oauth.resource) {
            case 'facebook':
                user.facebookID = this.props.userId;
                break;
            case 'twitter':
                user.twitterID = this.props.userId;
                break;
            case 'google':
                user.googleID = this.props.userId;
                break;
            case 'spotify':
                user.spotifyID = this.props.userId;
                break;
        }

        LoginActionCreators.register(user, profile, token, oauth);
    }

    onUsernameChange() {
        clearTimeout(this.usernameTimeout);
        this.usernameTimeout = setTimeout(() => {
            let username = this.refs.username.getValue();
            ConnectActionCreators.validateUsername(username);
        }, 500);
    }

    onClickGender(gender) {
        this.setState({
            gender: gender
        })
    }

    onClickDescriptiveGender(checked, value) {

        let descriptiveGender = this.state.descriptiveGender;
        if (descriptiveGender.length === 5 && checked && descriptiveGender.indexOf(value) === -1) {
            nekunoApp.alert(this.props.strings.maxDescriptiveGender);
        } else {
            if (checked) {
                descriptiveGender.push(value);
            } else {
                descriptiveGender = descriptiveGender.filter(val => val !== value);
            }
        }
        this.setState({
            descriptiveGender: descriptiveGender
        });
    }

    onSuggestSelect(location) {
        this.setState({
            location: location
        });
    }

    onClickShowDescriptiveGender() {
        this.setState(
            {showDescriptiveGender: !this.state.showDescriptiveGender}
        );
    }

    componentWillMount() {
        if (!this.props.token || !this.props.accessToken || !this.props.resource || !this.props.userId) {
            this.context.history.pushState(null, '/register');
        }
        UserActionCreators.requestMetadata();
    }

    render() {

        const {metadata, error, profile, strings} = this.props;
        const descriptiveGenderChoices = selectn('descriptiveGender.choices', metadata) || {};
        const descriptiveGenderChoicesLength = Object.keys(descriptiveGenderChoices).length || 0;
        let descriptiveGenderFirstColumnCounter = 0;
        let descriptiveGenderSecondColumnCounter = 0;

        return (
            <div className="view view-main">
                <RegularTopNavbar leftText={strings.cancel} centerText={strings.create}/>
                <div className="page">
                    <div id="page-content" className="register-join-content">
                        <div className="list-block">
                            <ul>
                                <TextInput defaultValue={profile ? profile.username : null} placeholder={strings.username} ref="username" onChange={this.onUsernameChange}/>
                                <TextInput defaultValue={profile ? profile.email : null} placeholder={strings.email} ref="email"/>
                                <PasswordInput placeholder={strings.password} ref="plainPassword"/>
                                <DateInput defaultValue={profile ? profile.birthday: null} label={strings.birthday} ref="birthday"/>
                            </ul>
                            <LocationInput initialValue={profile ? profile.location : null} placeholder={strings.location} onSuggestSelect={this.onSuggestSelect}/>
                        </div>

                        <TextRadios title={strings.include} labels={[
						{key: 'male', text: strings.male},
						{key: 'female', text: strings.female}
					]} onClickHandler={this.onClickGender} value={profile ? profile.gender : null}/>
                        <div style={{textAlign: 'center', marginBottom: '20px'}}>
                            <a onClick={this.onClickShowDescriptiveGender}>{ this.state.showDescriptiveGender ? strings.hideDescriptiveGender : strings.showDescriptiveGender}</a>
                        </div>
                        { this.state.showDescriptiveGender && descriptiveGenderChoices ?
                            <div className="list-block">
                                <ul className="checkbox-genders-list">
                                    {Object.keys(descriptiveGenderChoices).map((id) => {
                                        descriptiveGenderFirstColumnCounter++;
                                        if (descriptiveGenderFirstColumnCounter > descriptiveGenderChoicesLength / 2) {
                                            return '';
                                        }
                                        let text = metadata.descriptiveGender.choices[id];
                                        let checked = this.state.descriptiveGender.indexOf(id) !== -1;
                                        return (
                                            <li key={id}>
                                                <InputCheckbox value={id} name={'descriptiveGender[]'} text={text} checked={checked} defaultChecked={false} onClickHandler={this.onClickDescriptiveGender} reverse={true}/>
                                            </li>
                                        )
                                    })}
                                </ul>
                                <ul className="checkbox-genders-list">
                                    {Object.keys(descriptiveGenderChoices).map((id) => {
                                        descriptiveGenderSecondColumnCounter++;
                                        if (descriptiveGenderSecondColumnCounter <= descriptiveGenderChoicesLength / 2) {
                                            return '';
                                        }
                                        let text = metadata.descriptiveGender.choices[id];
                                        let checked = this.state.descriptiveGender.indexOf(id) !== -1;
                                        return (<li key={id}>
                                            <InputCheckbox value={id} name={'descriptiveGender[]'} text={text} checked={checked} defaultChecked={false} onClickHandler={this.onClickDescriptiveGender} reverse={true}/>
                                        </li>)
                                    })}
                                </ul>
                            </div>

                            :
                            ''
                        }

                        <FullWidthButton type="submit" onClick={this.register.bind(this)}>{strings.complete}</FullWidthButton>
                        <div style={{color: '#FFF'}}>
                            <p>{ error ? error.error : ''}</p>
                        </div>
                    </div>
                    <br />
                    <br />
                    <br />
                    <br />
                    <br />
                    <br />
                </div>
            </div>
        );
    }
};

RegisterJoinPage.defaultProps = {
    strings: {
        cancel               : 'Cancel',
        create               : 'Create account',
        username             : 'Username',
        email                : 'Email',
        password             : 'Password',
        birthday             : 'Birthday',
        location             : 'Location',
        include              : 'Include on searches as',
        male                 : 'Male',
        female               : 'Female',
        showDescriptiveGender: 'Show other genres',
        hideDescriptiveGender: 'Hide other genres',
        complete             : 'Complete registration',
        notAvailable         : 'Sorry, this username is not available',
        maxDescriptiveGender : 'The maximum number of options permitted is 5, uncheck any other options to choose this one'
    }
};
