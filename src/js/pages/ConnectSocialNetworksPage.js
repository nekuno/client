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
    const isLoading = WorkersStore.isLoading();

    return {
        networks,
        error,
        isLoading,
    };
}

@AuthenticatedComponent
@translate('ConnectSocialNetworksPage')
@connectToStores([WorkersStore], getState)
export default class ConnectSocialNetworksPage extends Component {

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

    render() {

        const {networks, error, user, strings, isLoading} = this.props;
        const picture = user && user.photo ? user.photo.thumbnail.medium : 'img/no-img/medium.jpg';

        return (
            <div className="views">
                <TopNavBar leftMenuIcon={true} centerText={strings.top}/>
                <div className="view view-main">
                    <div data-page="index" className="page connect-social-networks-page">
                        <div id="page-content" className="connect-social-networks-content">
                            <div className="title">{strings.title}</div>
                            <div className="excerpt">{strings.excerpt}</div>
                            <br />
                            <SocialWheels networks={networks} picture={picture} error={error ? strings.error : null} isLoading={isLoading}/>
                        </div>
                        <br />
                        <br />
                    </div>
                </div>
            </div>
        );
    }
}

ConnectSocialNetworksPage.defaultProps = {
    strings  : {
        top    : 'Social Networks',
        title  : 'Connect to your world',
        excerpt: 'At last your data will work for you! The more interest you contribute, the better recommendations you’ll get!',
        error  : 'Error connecting network. You may have connected it with other user.',
    },
    isLoading: false,
};