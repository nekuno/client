import React, { PropTypes, Component } from 'react';
import RegularTopNavbar from '../components/ui/RegularTopNavbar';
import AuthenticatedComponent from '../components/AuthenticatedComponent';
import SocialWheels from '../components/ui/SocialWheels';
import WorkersStore from '../stores/WorkersStore';
import connectToStores from '../utils/connectToStores';

function getState(props) {

    const networks = WorkersStore.getAll();

    return {
        networks
    };
}

@connectToStores([WorkersStore], getState)
export default AuthenticatedComponent(class ConnectSocialNetworksPage extends Component {

    static contextTypes = {
        history: PropTypes.object.isRequired
    };
    static propTypes = {
        // Injected by AuthenticatedComponent
        user    : PropTypes.object.isRequired,
        networks: PropTypes.array.isRequired
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
                        <SocialWheels networks={this.props.networks}/>
                    </div>
                </div>
            </div>
        );
    }

    goToRegisterLandingPage() {
        this.context.history.pushState(null, 'register-questions-landing')
    }
});