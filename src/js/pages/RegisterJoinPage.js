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
import RegisterGender from '../components/ui/RegisterGender';

function getState() {

    const token = ConnectStore.token;
    const accessToken = ConnectStore.accessToken;
    const resource = ConnectStore.resource;
    const metadata = ProfileStore.getMetadata();

    return {
        token,
        accessToken,
        resource,
        metadata
    };
}

@connectToStores([ConnectStore, ProfileStore], getState)
export default class RegisterJoinPage extends Component {

    static contextTypes = {
        history: PropTypes.object.isRequired
    };

    static propTypes = {
        // Injected by @connectToStores:
        token      : PropTypes.string,
        accessToken: PropTypes.string,
        resource   : PropTypes.string,
        metadata   : PropTypes.object
    };

    constructor() {
        super();
        this.onClickGender = this.onClickGender.bind(this);
        this.onClickDescriptiveGender = this.onClickDescriptiveGender.bind(this);
        this.state = {
            username         : '',
            email            : '',
            plainPassword    : '',
            birthday         : '',
            gender           : '',
            descriptiveGender: {}
        };
    }

    register(e) {
        e.preventDefault();
        console.log(this.state, this.props);
        LoginActionCreators.register(this.state.username, this.state.plainPassword, this.state.email);
    }

    linkState(key) {
        return new ReactLink(this.state[key], ReactStateSetters.createStateKeySetter(this, key));
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

    componentWillMount() {
        if (!this.props.token) {
            //this.context.history.pushState(null, '/register');
        }
        UserActionCreators.requestMetadata();
    }

    render() {

        const error = false;
        const requesting = false;
        const metadata = this.props.metadata ? this.props.metadata.descriptiveGender : null;

        return (
            <div className="view view-main">
                <RegularTopNavbar leftText={'Cancelar'} centerText={'Crear cuenta'}/>
                <div data-page="index" className="page">
                    <div id="page-content" className="login-content">
                        <div className="list-block">
                            <ul>
                                <TextInput placeholder={'Nombre de usuario'} valueLink={this.linkState('username')}/>
                                <TextInput placeholder={'Email'} valueLink={this.linkState('email')}/>
                                <PasswordInput placeholder={'Contraseña'} valueLink={this.linkState('plainPassword')}/>
                                <DateInput label={'Fecha de nacimiento'} valueLink={this.linkState('birthday')}/>
                            </ul>
                        </div>
                        <RegisterGender onClickHandler={this.onClickGender}/>
                        { metadata ?
                            <div className="list-block">
                                <ul>
                                    {Object.keys(metadata.choices).map((id) => {
                                        let text = metadata.choices[id];
                                        return (<li key={id}>
                                            <InputCheckbox value={id} name={'alternativeGender[]'} text={text} defaultChecked={false} onClickHandler={this.onClickDescriptiveGender}/>
                                        </li>)
                                    })}
                                </ul>
                            </div>
                            :
                            ''
                        }
                        <FullWidthButton type="submit" onClick={this.register.bind(this)}>Completar registro</FullWidthButton>
                        <div style={{color: '#FFF'}}>
                            <p>{ requesting ? 'Enviando...' : ''}</p>
                            <p>{ error ? error.error : ''}</p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
