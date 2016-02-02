import React, { PropTypes, Component } from 'react';
import selectn from 'selectn';
const ReactLink = require('react/lib/ReactLink');
const ReactStateSetters = require('react/lib/ReactStateSetters');
import RegularTopNavbar from '../components/ui/RegularTopNavbar';
import TextInput from '../components/ui/TextInput';
import PasswordInput from '../components/ui/PasswordInput';
import DateInput from '../components/ui/DateInput';
import LocationInput from '../components/ui/LocationInput';
import FullWidthButton from '../components/ui/FullWidthButton';
import InputCheckbox from '../components/ui/InputCheckbox';
import LoginActionCreators from '../actions/LoginActionCreators';
import ConnectActionCreators from '../actions/ConnectActionCreators';
import * as UserActionCreators from '../actions/UserActionCreators';
import connectToStores from '../utils/connectToStores';
import ConnectStore from '../stores/ConnectStore';
import ProfileStore from '../stores/ProfileStore';
import RegisterStore from '../stores/RegisterStore';
import TextRadios from '../components/ui/TextRadios';
import { getValidationErrors } from '../utils/StoreUtils';

function getState() {

    const token = ConnectStore.token;
    const accessToken = ConnectStore.accessToken;
    const resource = ConnectStore.resource;
    const metadata = ProfileStore.getMetadata();
    const error = RegisterStore.error;
    const requesting = RegisterStore.requesting();
    const validUsername = RegisterStore.validUsername();

    if (error) {
        let displayErrors = getValidationErrors(error);
        if (displayErrors) {
            nekunoApp.alert(displayErrors);
        }
    }

    if (!validUsername) {
        nekunoApp.alert('Lo sentimos, este nombre de usuario no está disponible');
    }

    return {
        token,
        accessToken,
        resource,
        metadata,
        error,
        requesting,
        validUsername
    };
}

@connectToStores([ConnectStore, ProfileStore, RegisterStore], getState)
export default class RegisterJoinPage extends Component {

    static contextTypes = {
        history: PropTypes.object.isRequired
    };

    static propTypes = {
        // Injected by @connectToStores:
        token        : PropTypes.string,
        accessToken  : PropTypes.string,
        resource     : PropTypes.string,
        metadata     : PropTypes.object,
        error        : PropTypes.object,
        requesting   : PropTypes.bool,
        validUsername: PropTypes.bool
    };

    constructor() {
        super();
        this.onUsernameChange = this.onUsernameChange.bind(this);
        this.onClickGender = this.onClickGender.bind(this);
        this.onClickDescriptiveGender = this.onClickDescriptiveGender.bind(this);
        this.onSuggestSelect = this.onSuggestSelect.bind(this);
        this.state = {
            gender           : '',
            location         : {},
            descriptiveGender: []
        };
    }

    register(e) {
        e.preventDefault();
        console.log(this.refs, this.state, this.props);
        LoginActionCreators.register({
            username     : this.refs.username.getValue(),
            plainPassword: this.refs.plainPassword.getValue(),
            email        : this.refs.email.getValue()
        }, {
            interfaceLanguage  : 'es',
            orientationRequired: false,
            birthday           : this.refs.birthday.getValue(),
            gender             : this.state.gender,
            descriptiveGender  : this.state.descriptiveGender,
            location           : this.state.location
        }, this.props.token, {
            accessToken: this.props.accessToken,
            resource  : this.props.resource
        });
    }

    onUsernameChange() {
        let username = this.refs.username.getValue();
        ConnectActionCreators.validateUsername(username);
    }

    onClickGender(gender) {
        this.setState({
            gender: gender
        })
    }

    onClickDescriptiveGender(checked, value) {

        let descriptiveGender = this.state.descriptiveGender;
        if (descriptiveGender.length === 5 && checked && descriptiveGender.indexOf(value) === -1) {
            nekunoApp.alert('El máximo de opciones permitidas es 5, desmarca alguna otra opción para elegir esta.');
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
        console.log(checked, value);
        console.log(descriptiveGender);
    }

    onSuggestSelect(suggest) {

        let locality = '', country = '';
        suggest.gmaps.address_components.forEach(function(component) {
            component.types.forEach(function(type) {
                if (!locality && type === 'locality') {
                    locality = component.long_name;
                }
                if (!country && type === 'country') {
                    country = component.long_name;
                }
            });
        });

        let location = {
            latitude : suggest.location.lat,
            longitude: suggest.location.lng,
            address  : suggest.label,
            locality : locality,
            country  : country
        };

        this.setState({
            location: location
        });
    }

    componentWillMount() {
        if (!this.props.token || !this.props.accessToken || !this.props.resource) {
            //this.context.history.pushState(null, '/register');
        }
        UserActionCreators.requestMetadata();
    }

    render() {

        const { metadata, error, requesting } = this.props;
        const descriptiveGenderChoices = selectn('descriptiveGender.choices', metadata) || {};
        const descriptiveGenderChoicesLength = Object.keys(descriptiveGenderChoices).length || 0;
        let descriptiveGenderFirstColumnCounter = 0;
        let descriptiveGenderSecondColumnCounter = 0;

        return (
            <div className="view view-main">
                <RegularTopNavbar leftText={'Cancelar'} centerText={'Crear cuenta'}/>
                <div data-page="index" className="page">
                    <div id="page-content" className="register-join-content">
                        <div className="list-block">
                            <ul>
                                <TextInput placeholder={'Nombre de usuario'} ref="username" onChange={this.onUsernameChange}/>
                                <TextInput placeholder={'Email'} ref="email"/>
                                <PasswordInput placeholder={'Contraseña'} ref="plainPassword"/>
                                <DateInput label={'Fecha de nacimiento'} ref="birthday"/>
                                <LocationInput placeholder="Ubicación" onSuggestSelect={this.onSuggestSelect}/>
                            </ul>
                        </div>

                        <TextRadios title={'Incluirme en las búsquedas como'} labels={[
						{key: 'male', text: 'Hombre'},
						{key: 'female', text: 'Mujer'}
					]} onClickHandler={this.onClickGender} value={this.state.gender}/>

                        { descriptiveGenderChoices ?
                            <div className="list-block">
                                <ul className="checkbox-genders-list">
                                    {Object.keys(descriptiveGenderChoices).map((id) => {
                                        descriptiveGenderFirstColumnCounter++;
                                        if (descriptiveGenderFirstColumnCounter > descriptiveGenderChoicesLength/2) {
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
                                        if (descriptiveGenderSecondColumnCounter <= descriptiveGenderChoicesLength/2) {
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

                        <FullWidthButton type="submit" onClick={this.register.bind(this)}>Completar registro</FullWidthButton>
                        <div style={{color: '#FFF'}}>
                            <p>{ requesting ? 'Registrando...' : ''}</p>
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
}
