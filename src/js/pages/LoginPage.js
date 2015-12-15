import React, { PropTypes, Component } from 'react';
import SearchUser from '../components/SearchUser';
import RegularTopNavbar from '../components/ui/RegularTopNavbar';
import TextInput from '../components/ui/TextInput';
import PasswordInput from '../components/ui/PasswordInput';
import FullWidthButton from '../components/ui/FullWidthButton';

export default class LoginPage extends Component {

    render() {
        return (
            <div className="view view-main">
                <RegularTopNavbar leftText={'Cancelar'} centerText={'Iniciar sesión'} />
                <div data-page="index" className="page">
                    <div id="page-content" className="login-content">
                        <div className="list-block">
                            <ul>
                                <TextInput placeholder={'Usuario o email'} value={''} />
                                <PasswordInput placeholder={'Contraseña'} value={''} />
                            </ul>
                        </div>
                        <FullWidthButton text={'Iniciar Sesión'} />
                        <SearchUser {...this.props} />
                    </div>
                </div>
            </div>
        );
    }
}
