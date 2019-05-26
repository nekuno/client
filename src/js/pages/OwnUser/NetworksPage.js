import PropTypes from 'prop-types';
import React, { Component } from 'react';
import styles from './NetworksPage.scss';
import translate from '../../i18n/Translate';
import connectToStores from "../../utils/connectToStores";
import AuthenticatedComponent from "../../components/AuthenticatedComponent";
import TopNavBar from '../../components/TopNavBar/TopNavBar.js';
import OwnUserBottomNavBar from "../../components/ui/OwnUserBottomNavBar/OwnUserBottomNavBar";
import StatsStore from "../../stores/StatsStore";
import NetworkInformation from "../../components/ui/NetworkInformation/NetworkInformation";
import UnconnectedNetworkCard from "../../components/ui/UnconnectedNetworkCard/UnconnectedNetworkCard";
import RouterStore from '../../stores/RouterStore';

/**
 * Retrieves state from stores for current props.
 */
function getState(props) {
    const networks = StatsStore.networks;
    const unconnectedNetworks = StatsStore.unconnectedNetworks;

    const routes = RouterStore._routes;

    return {
        networks,
        unconnectedNetworks,
        routes
    };
}

@AuthenticatedComponent
@translate('NetworksPage')
@connectToStores([StatsStore], getState)
export default class NetworksPage extends Component {

    static propTypes = {
        strings            : PropTypes.object,
        // Injected by @connectToStores:
        networks           : PropTypes.object.isRequired,
        unconnectedNetworks: PropTypes.array,
        routes   : PropTypes.array,
    };

    static contextTypes = {
        router: PropTypes.object.isRequired
    };

    constructor(props) {

        super(props);

        this.getNetworkCards = this.getNetworkCards.bind(this);
        this.getUnconnectedNetworks = this.getUnconnectedNetworks.bind(this);
    }

    getNetworkCards() {
        const {networks} = this.props;

        return Object.keys(networks).map((network) => {
            const data = networks[network];
            return <div key={network} className={styles.networkCard}><NetworkInformation network={network} data={data}/></div>
        });
    }

    getUnconnectedNetworks() {
        const {unconnectedNetworks} = this.props;

        return unconnectedNetworks.map((network) => {
            return <div key={network} className={styles.unconnectedNetworkCard}><UnconnectedNetworkCard network={network}/></div>
        });
    }

    goBack(routes) {
        const regex = /^(\/p\/.*)*(\/networks)*(\/friends)*(\/answers)*(\/interests)*$/
        const next = routes.reverse().find((route) => {
            return !regex.test(route)
        })

        this.context.router.push(next || '');
    }

    render() {
        const {strings, networks, routes} = this.props;
        const networksAmount = Object.keys(networks).length;
        const networksTitle = strings.networksTitle.replace('%amount%', networksAmount);

        return (
            <div className={styles.view}>
                <div className={styles.topNavBar}>
                    <TopNavBar
                        background={'transparent'}
                        iconLeft="arrow-left"
                        onLeftLinkClickHandler={() => this.goBack(routes)}
                        textCenter={strings.topNavBarText}
                    />
                </div>

                <div className={styles.main}>
                    <div className={styles.connectedNetworks}>
                        <div className={styles.connectedNetworksTitle}>{networksTitle}</div>
                        <div className={styles.connectedNetworksCards}>
                            {this.getNetworkCards()}
                        </div>
                    </div>

                    <div className={styles.connectMore}>
                        <div className={styles.connectMoreTitle}>{strings.connectMore}</div>

                        <div className={styles.unconnectedNetworks}>
                            {this.getUnconnectedNetworks()}
                        </div>

                    </div>
                </div>


                <div className={styles.navbarWrapper}>
                    <OwnUserBottomNavBar current={'networks'}/>
                </div>
            </div>
        );
    }
}

NetworksPage.defaultProps = {
    strings: {
        networksTitle: 'You have %amount% networks connected',
        connectMore  : 'Connect More Networks',
        topNavBarText: 'Interests'
    }
};