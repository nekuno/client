import React, { PropTypes, Component } from 'react';
import RegularTopNavbar from '../components/ui/RegularTopNavbar';
import AuthenticatedComponent from '../components/AuthenticatedComponent';
import SocialWheels from '../components/ui/SocialWheels';

export default AuthenticatedComponent(class ConnectSocialNetworksPage extends Component {
    static contextTypes = {
        history: PropTypes.object.isRequired
    };
    static propTypes = {
        // Injected by AuthenticatedComponent
        user: PropTypes.object.isRequired
    };

    constructor(props) {
        super(props);
        this.goToRegisterLandingPage = this.goToRegisterLandingPage.bind(this);
    }

    render() {
        return (
            <div className="view view-main">
                <RegularTopNavbar centerText={''} rightText={'Continuar'} onRightLinkClickHandler={this.goToRegisterLandingPage}/>
                <div data-page="index" className="page connect-social-networks-page">
                    <div id="page-content" className="connect-social-networks-content">
                        <div className="title">Bienvenido a Nekuno <br />{this.props.user.username}</div>
                        <div className="excerpt">
                            Conecta con Nekuno todas las redes sociales que quieras para mejorar
                        los resultados de los contenidos recomendados.
                        </div>
                        <br />
                        <SocialWheels />
                    </div>
                </div>
            </div>
        );
    }

    goToRegisterLandingPage() {
        this.context.history.pushState(null, 'register-questions-landing')
    }
});