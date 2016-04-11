import React, { PropTypes, Component } from 'react';
import { IMAGES_ROOT } from '../constants/Constants';
import LeftBackIconTopNavbar from '../components/ui/LeftBackIconTopNavbar';
import SocialWheels from '../components/ui/SocialWheels';
import AuthenticatedComponent from '../components/AuthenticatedComponent';
import translate from '../i18n/Translate';
import connectToStores from '../utils/connectToStores';
import WorkersStore from '../stores/WorkersStore';

function getState(props) {

    const networks = WorkersStore.getAll();

    return {
        networks
    };
}

@AuthenticatedComponent
@translate('ConnectSocialNetworksPage')
@connectToStores([WorkersStore], getState)
export default class ConnectSocialNetworksPage extends Component {

    static contextTypes = {
        history: PropTypes.object.isRequired
    };

    static propTypes = {
        // Injected by @AuthenticatedComponent
        user    : PropTypes.object.isRequired,
        // Injected by @translate:
        strings : PropTypes.object,
        // Injected by @connectToStores:
        networks: PropTypes.array.isRequired
    };

    render() {

        const {networks, user, strings} = this.props;
        const picture = user && user.picture ? `${IMAGES_ROOT}media/cache/resolve/user_avatar_180x180/user/images/${user.picture}` : `${IMAGES_ROOT}media/cache/user_avatar_180x180/bundles/qnoowweb/images/user-no-img.jpg`;

        return (
            <div className="view view-main">
                <LeftBackIconTopNavbar centerText={strings.top}/>
                <div data-page="index" className="page connect-social-networks-page">
                    <div id="page-content" className="connect-social-networks-content">
                        <div className="title">{strings.title}</div>
                        <div className="excerpt">{strings.excerpt}</div>
                        <br />
                        <SocialWheels networks={networks} picture={picture}/>
                    </div>
                </div>
            </div>
        );
    }
};

ConnectSocialNetworksPage.defaultProps = {
    strings: {
        top    : 'Social Networks',
        title  : 'Connect to your world',
        excerpt: 'Connect your social networks with Nekuno to improve the results of the recommended content.'
    }
};