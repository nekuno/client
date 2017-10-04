import PropTypes from 'prop-types';
import React, { Component } from 'react';
import ButtonFloating from '../components/ui/ButtonFloating';
import SocialWheels from '../components/ui/SocialWheels';
import AuthenticatedComponent from '../components/AuthenticatedComponent';
import translate from '../i18n/Translate';
import connectToStores from '../utils/connectToStores';
import WorkersStore from '../stores/WorkersStore';
import RouterActionCreators from '../actions/RouterActionCreators';

function getState(props) {

    const networks = WorkersStore.getAll();
    const error = WorkersStore.getConnectError();
    const isLoading = WorkersStore.isLoading();

    return {
        networks,
        error,
        isLoading,
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
        user     : PropTypes.object.isRequired,
        // Injected by @translate:
        strings  : PropTypes.object,
        // Injected by @connectToStores:
        networks : PropTypes.array.isRequired,
        error    : PropTypes.bool,
        isLoading: PropTypes.bool,
    };

    constructor(props) {
        super(props);
        this.goToRegisterLandingPage = this.goToRegisterLandingPage.bind(this);
    }

    goToRegisterLandingPage() {
        RouterActionCreators.replaceRoute('/register-questions-landing');
    }

    render() {

        const {networks, error, user, strings, isLoading} = this.props;
        const username = user.username;
        const picture = user && user.photo ? user.photo.thumbnail.medium : 'img/no-img/medium.jpg';

        return (
            <div className="views">
                <div className="view view-main">
                    <div data-page="index" className="page connect-social-networks-page connect-social-networks-on-sign-up-page">
                        <div id="page-content" className="connect-social-networks-content">
                            <div className="title">{strings.welcome} {username}</div>
                            <div className="excerpt">{strings.excerpt1}</div>
                            <div className="excerpt">{strings.excerpt2}</div>
                            <br />
                            <SocialWheels networks={networks} picture={picture} error={error ? strings.error : null} isLoading={isLoading}/>
                        </div>
                        <br />
                        <br />
                    </div>
                </div>
                <ButtonFloating onClickHandler={this.goToRegisterLandingPage} icon="arrow-right"/>
            </div>
        );
    }
}

ConnectSocialNetworksOnSignUpPage.defaultProps = {
    strings  : {
        next    : 'Continue',
        welcome : 'Welcome',
        excerpt1: 'Make your data work for you!',
        excerpt2: 'Feed Nekuno with your networks for better recommendations!',
        error   : 'Error connecting network. You may have connected it with other user.',
    },
    isLoading: false,
};