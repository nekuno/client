import React, { PropTypes, Component } from 'react';
const ReactLink = require('react/lib/ReactLink');
const ReactStateSetters = require('react/lib/ReactStateSetters');
import RegularTopNavbar from '../components/ui/RegularTopNavbar';
import TextInput from '../components/ui/TextInput';
import PasswordInput from '../components/ui/PasswordInput';
import DateInput from '../components/ui/DateInput';
import FullWidthButton from '../components/ui/FullWidthButton';
import InputCheckbox from '../components/ui/InputCheckbox';
import LoginActionCreators from '../actions/LoginActionCreators';
import * as UserActionCreators from '../actions/UserActionCreators';
import connectToStores from '../utils/connectToStores';
import ConnectStore from '../stores/ConnectStore';
import ProfileStore from '../stores/ProfileStore';
import RegisterStore from '../stores/RegisterStore';
import TextRadios from '../components/ui/TextRadios';
import { getValidationErrors } from '../utils/StoreUtils';
import Geosuggest from 'react-geosuggest';

function getState() {

    const token = ConnectStore.token;
    const accessToken = ConnectStore.accessToken;
    const resource = ConnectStore.resource;
    const metadata = ProfileStore.getMetadata();
    const error = RegisterStore.error;
    const requesting = RegisterStore.requesting();

    if (error) {
        let displayErrors = getValidationErrors(error);
        if (displayErrors) {
            nekunoApp.alert(displayErrors);
        }
    }

    return {
        token,
        accessToken,
        resource,
        metadata,
        error,
        requesting
    };
}

@connectToStores([ConnectStore, ProfileStore, RegisterStore], getState)
export default class RegisterJoinPage extends Component {

    static contextTypes = {
        history: PropTypes.object.isRequired
    };

    static propTypes = {
        // Injected by @connectToStores:
        token      : PropTypes.string,
        accessToken: PropTypes.string,
        resource   : PropTypes.string,
        metadata   : PropTypes.object,
        error      : PropTypes.object,
        requesting : PropTypes.bool
    };

    constructor() {
        super();
        this.onClickGender = this.onClickGender.bind(this);
        this.onClickDescriptiveGender = this.onClickDescriptiveGender.bind(this);
        this.onSuggestSelect = this.onSuggestSelect.bind(this);
        this.state = {
            gender           : '',
            location         : {},
            descriptiveGender: {}
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
            descriptiveGender  : Object.keys(this.state.descriptiveGender),
            location           : this.state.location
        });
    }

    onClickGender(gender) {
        this.setState({
            gender: gender
        })
    }

    onClickDescriptiveGender(checked, value, uncheck) {

        let descriptiveGender = this.state.descriptiveGender;
        if (Object.keys(descriptiveGender).length === 5 && checked && !descriptiveGender[value]) {
            nekunoApp.alert('El máximo de opciones permitidas es 5, desmarca alguna otra opción para elegir esta.');
            uncheck();
        } else {
            if (!checked) {
                delete descriptiveGender[value]
            } else {
                descriptiveGender[value] = checked;
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
        if (!this.props.token) {
            //this.context.history.pushState(null, '/register');
        }
        UserActionCreators.requestMetadata();
    }

    render() {

        const { metadata, error, requesting } = this.props;

        return (
            <div className="view view-main">
                <RegularTopNavbar leftText={'Cancelar'} centerText={'Crear cuenta'}/>
                <div data-page="index" className="page">
                    <div id="page-content" className="login-content">
                        <div className="list-block">
                            <ul>
                                <TextInput placeholder={'Nombre de usuario'} ref="username"/>
                                <TextInput placeholder={'Email'} ref="email"/>
                                <PasswordInput placeholder={'Contraseña'} ref="plainPassword"/>
                                <DateInput label={'Fecha de nacimiento'} ref="birthday"/>
                                <Geosuggest placeholder="Ubicación" onSuggestSelect={this.onSuggestSelect}/>
                            </ul>
                        </div>

                        <TextRadios title={'Incluirme en las búsquedas como'} labels={[
						{key: 'male', text: 'Hombre'},
						{key: 'female', text: 'Mujer'}
					]} onClickHandler={this.onClickGender} value={this.state.gender}/>

                        { metadata && metadata.descriptiveGender ?
                            <div className="list-block">
                                <ul>
                                    {Object.keys(metadata.descriptiveGender.choices).map((id) => {
                                        let text = metadata.descriptiveGender.choices[id];
                                        return (<li key={id}>
                                            <InputCheckbox value={id} name={'descriptiveGender[]'} text={text} defaultChecked={false} onClickHandler={this.onClickDescriptiveGender}/>
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
                </div>
            </div>
        );
    }
}
