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
        descriptiveGender: metadata ? metadata.descriptiveGender : null
    };
}

@connectToStores([ConnectStore, ProfileStore], getState)
export default class RegisterJoinPage extends Component {

    static contextTypes = {
        history: PropTypes.object.isRequired
    };

    static propTypes = {
        // Injected by @connectToStores:
        token            : PropTypes.string,
        accessToken      : PropTypes.string,
        resource         : PropTypes.string,
        descriptiveGender: PropTypes.object
    };

    constructor() {
        super();
        this.onClickGender = this.onClickGender.bind(this);
        this.onClickDescriptiveGender = this.onClickDescriptiveGender.bind(this);
        this.state = {
            user    : '',
            password: '',
            birthday: '',
            gender  : ''
        };
    }

    register(e) {
        e.preventDefault();
        console.log(this.state, this.props);
    }

    linkState(key) {
        return new ReactLink(this.state[key], ReactStateSetters.createStateKeySetter(this, key));
    }

    onClickGender(gender) {
        this.setState({
            gender: gender
        })
    }

    onClickDescriptiveGender(checked, value) {
        console.log(checked, value);
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
        const descriptiveGender = this.props.descriptiveGender;

        return (
            <div className="view view-main">
                <RegularTopNavbar leftText={'Cancelar'} centerText={'Crear cuenta'}/>
                <div data-page="index" className="page">
                    <div id="page-content" className="login-content">
                        <div className="list-block">
                            <ul>
                                <TextInput placeholder={'Nombre de usuario'} valueLink={this.linkState('user')}/>
                                <PasswordInput placeholder={'Contraseña'} valueLink={this.linkState('password')}/>
                                <DateInput label={'Fecha de nacimiento'} valueLink={this.linkState('birthday')}/>
                            </ul>
                        </div>
                        <RegisterGender onClickHandler={this.onClickGender}/>
                        { descriptiveGender ?
                            <div className="list-block">
                                <ul>
                                    {Object.keys(descriptiveGender.choices).map((id) => {
                                        let text = descriptiveGender.choices[id];
                                        return (<li key={id}>
                                            <InputCheckbox value={id} name={'alternativeGender[]'} text={text} checked={false} defaultChecked={false} onClickHandler={this.onClickDescriptiveGender}/>
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
