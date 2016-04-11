import React, { PropTypes, Component } from 'react';
import { IMAGES_ROOT } from '../constants/Constants';
import RegularTopNavbar from '../components/ui/RegularTopNavbar';
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
@translate('ConnectSocialNetworksOnSignUpPage')
@connectToStores([WorkersStore], getState)
export default class ConnectSocialNetworksOnSignUpPage extends Component {

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

    constructor(props) {
        super(props);
        this.goToRegisterLandingPage = this.goToRegisterLandingPage.bind(this);
    }

    goToRegisterLandingPage() {
        this.context.history.pushState(null, 'register-questions-landing')
    }

    render() {

        const {networks, user, strings} = this.props;
        const username = user.username;
        const picture = user && user.picture ? `${IMAGES_ROOT}media/cache/resolve/user_avatar_180x180/user/images/${user.picture}` : `${IMAGES_ROOT}media/cache/user_avatar_180x180/bundles/qnoowweb/images/user-no-img.jpg`;

        return (
            <div className="view view-main">
                <RegularTopNavbar centerText={''} rightText={strings.next} onRightLinkClickHandler={this.goToRegisterLandingPage}/>
                <div data-page="index" className="page connect-social-networks-page">
                    <div id="page-content" className="connect-social-networks-content">
                        <div className="title">{strings.welcome} <br />{username}</div>
                        <div className="excerpt">{strings.excerpt}</div>
                        <br />
                        <SocialWheels networks={networks} picture={picture}/>
                    </div>
                </div>
            </div>
        );
    }
};

ConnectSocialNetworksOnSignUpPage.defaultProps = {
    strings: {
        next   : 'Continue',
        welcome: 'Welcome to Nekuno',
        excerpt: 'Connect to Nekuno all social networks that you want, to improve the results of the recommended content.'
    }
};