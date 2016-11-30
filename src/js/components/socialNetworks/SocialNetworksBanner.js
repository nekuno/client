import React, { PropTypes, Component } from 'react';
import LoadingSpinnerCSS from '../ui/LoadingSpinnerCSS';
import translate from '../../i18n/Translate';
import SocialBox from '../ui/SocialBox';
import ConnectActionCreators from '../../actions/ConnectActionCreators';
import SocialNetworkService from '../../services/SocialNetworkService';

@translate('SocialNetworksBanner')
export default class SocialNetworksBanner extends Component {

    static contextTypes = {
        history: PropTypes.object.isRequired
    };

    static propTypes = {
        user: PropTypes.object.isRequired,
        networks: PropTypes.array.isRequired,
        // Injected by @translate:
        strings: PropTypes.object
    };

    constructor(props) {
        super(props);
    }

    connect = function(resource, scope) {
        SocialNetworkService.login(resource, scope, true).then(() => {
            ConnectActionCreators.connect(resource, SocialNetworkService.getAccessToken(resource), SocialNetworkService.getResourceId(resource), SocialNetworkService.getExpireTime(resource), SocialNetworkService.getRefreshToken(resource));
        }, (status) => {
            nekunoApp.alert(resource + ' login failed: ' + status.error.message);
        });
    };

    goToSocialNetworks() {
        this.context.history.pushState(null, '/social-networks');
    }

    render() {

        const {strings, networks, user} = this.props;
        const ownPicture = user && user.photo ? user.photo.thumbnail.medium : 'img/no-img/medium.jpg';
        const connectedNetworks = networks.filter(network => network.fetching || network.fetched || network.processing || network.processed);

        return (
            <div className="social-networks-link-container">
                <div onClick={this.goToSocialNetworks}>
                    <div className="title social-networks-link-title">{strings.title}</div>
                    <div className="social-networks-link-text">{strings.text}</div>
                    <div className="social-networks-link-stats">
                        {connectedNetworks.length > 1 ? <SocialBox onClickHandler={this.connect} excludedResources={connectedNetworks.map(network => network.resource)} />
                            : <div><LoadingSpinnerCSS /></div>}
                        <p>{strings.publishMessage}</p>
                    </div>
                    <div className="social-networks-link-picture">
                        <img src={ownPicture}/>
                    </div>
                </div>
            </div>
        );
    }
}

SocialNetworksBanner.defaultProps = {
    strings: {
        title         : 'Do you want us to walk a fine line?',
        text          : 'Let`s discover your interests automatically',
        publishMessage: 'We won`t publish anything'
    }
};