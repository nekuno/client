import React, { PropTypes, Component } from 'react';
import { IMAGES_ROOT } from '../constants/Constants';
import LeftBackIconTopNavbar from '../components/ui/LeftBackIconTopNavbar';
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
export default class ConnectSocialNetworksPage extends Component {

    static contextTypes = {
        history: PropTypes.object.isRequired
    };
    static propTypes = {
        // Injected by AuthenticatedComponent
        user    : PropTypes.object.isRequired,
        networks: PropTypes.array.isRequired
    };

    render() {

        const networks = this.props.networks;
        const picture = this.props.user && this.props.user.picture ? `${IMAGES_ROOT}media/cache/resolve/user_avatar_180x180/user/images/${this.props.user.picture}` : `${IMAGES_ROOT}media/cache/user_avatar_180x180/bundles/qnoowweb/images/user-no-img.jpg`;

        return (
            <div className="view view-main">
                <LeftBackIconTopNavbar centerText={'Conexión con redes sociales'}/>
                <div data-page="index" className="page connect-social-networks-page">
                    <div id="page-content" className="connect-social-networks-content">
                        <div className="title">Conecta con tu mundo</div>
                        <div className="excerpt">
                            Conecta tus redes sociales con Nekuno
                            para mejorar los resultados de los
                            contenidos recomendados.
                        </div>
                        <br />
                        <SocialWheels networks={networks} picture={picture}/>
                    </div>
                </div>
            </div>
        );
    }
};