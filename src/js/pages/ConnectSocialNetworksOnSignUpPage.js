import React, { PropTypes, Component } from 'react';
import { IMAGES_ROOT } from '../constants/Constants';
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

@AuthenticatedComponent
@connectToStores([WorkersStore], getState)
export default class ConnectSocialNetworksOnSignUpPage extends Component {

    static contextTypes = {
        history: PropTypes.object.isRequired
    };
    static propTypes = {
        // Injected by @AuthenticatedComponent
        user    : PropTypes.object.isRequired,
        networks: PropTypes.array.isRequired
    };

    constructor(props) {
        super(props);
        this.goToRegisterLandingPage = this.goToRegisterLandingPage.bind(this);
    }

    render() {

        const networks = this.props.networks;
        const username = this.props.user.username;
        const picture = this.props.user && this.props.user.picture ? `${IMAGES_ROOT}media/cache/resolve/user_avatar_180x180/user/images/${this.props.user.picture}` : `${IMAGES_ROOT}media/cache/user_avatar_180x180/bundles/qnoowweb/images/user-no-img.jpg`;

        return (
            <div className="view view-main">
                <RegularTopNavbar centerText={''} rightText={'Continuar'} onRightLinkClickHandler={this.goToRegisterLandingPage}/>
                <div data-page="index" className="page connect-social-networks-page">
                    <div id="page-content" className="connect-social-networks-content">
                        <div className="title">Bienvenido a Nekuno <br />{username}</div>
                        <div className="excerpt">
                            Conecta con Nekuno todas las redes sociales que quieras para mejorar
                            los resultados de los contenidos recomendados.
                        </div>
                        <br />
                        <SocialWheels networks={networks} picture={picture}/>
                    </div>
                </div>
            </div>
        );
    }

    goToRegisterLandingPage() {
        this.context.history.pushState(null, 'register-questions-landing')
    }
};