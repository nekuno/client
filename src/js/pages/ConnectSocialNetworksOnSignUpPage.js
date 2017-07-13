import PropTypes from 'prop-types';
import React, { Component } from 'react';
import TopNavBar from '../components/ui/TopNavBar';
import SocialWheels from '../components/ui/SocialWheels';
import AuthenticatedComponent from '../components/AuthenticatedComponent';
import translate from '../i18n/Translate';
import connectToStores from '../utils/connectToStores';
import WorkersStore from '../stores/WorkersStore';

function getState(props) {

    const networks = WorkersStore.getAll();
    const error = WorkersStore.getConnectError();

    return {
        networks,
        error
    };
}

@AuthenticatedComponent
@translate('ConnectSocialNetworksOnSignUpPage')
@connectToStores([WorkersStore], getState)
export default class ConnectSocialNetworksOnSignUpPage extends Component {

    static contextTypes = {
        router: PropTypes.object.isRequired
    };

    static propTypes = {
        // Injected by @AuthenticatedComponent
        user    : PropTypes.object.isRequired,
        // Injected by @translate:
        strings : PropTypes.object,
        // Injected by @connectToStores:
        networks: PropTypes.array.isRequired,
        error   : PropTypes.bool,
    };

    constructor(props) {
        super(props);
        this.goToRegisterLandingPage = this.goToRegisterLandingPage.bind(this);
    }

    goToRegisterLandingPage() {
        this.context.router.push('register-questions-landing');
    }

    render() {

        const {networks, error, user, strings} = this.props;
        const username = user.username;
        const picture = user && user.photo ? user.photo.thumbnail.medium : 'img/no-img/medium.jpg';

        return (
            <div className="views">
                <TopNavBar centerText={''} rightText={strings.next} onRightLinkClickHandler={this.goToRegisterLandingPage}/>
                <div className="view view-main">
                    <div data-page="index" className="page connect-social-networks-page">
                        <div id="page-content" className="connect-social-networks-content">
                            <div className="title">{strings.welcome} <br />{username}</div>
                            <div className="excerpt">{strings.excerpt}</div>
                            <br />
                            <SocialWheels networks={networks} picture={picture} error={error ? strings.error : null}/>
                            <div className="excerpt">{strings.footer}</div>
                        </div>
                        <br />
                        <br />
                    </div>
                </div>
            </div>
        );
    }
}

ConnectSocialNetworksOnSignUpPage.defaultProps = {
    strings: {
        next   : 'Continue',
        welcome: 'Welcome to Nekuno',
        excerpt: 'At last your data will work for you! The more interest you contribute, the better recommendations you’ll get!',
        footer : 'Nekuno primarily works with the social networks you have synced. We don’t post anything. You can control the information you give and block information if you so desire.',
        error  : 'Error connecting network. You may have connected it with other user.',
    }
};