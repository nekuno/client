import PropTypes from 'prop-types';
import React, { Component } from 'react';
import styles from './ProposalsPage.scss';
import translate from '../../../i18n/Translate';
import connectToStores from '../../../utils/connectToStores';
import AuthenticatedComponent from '../../../components/AuthenticatedComponent';
import ProposalRecommendationList from '../../../components/ui/ProposalRecommendationList/ProposalRecommendationList';
import BottomNavBar from '../../../components/BottomNavBar/BottomNavBar.js';
import TopNavBar from '../../../components/TopNavBar/TopNavBar.js';
import BottomNotificationBar from "../../../components/ui/BottomNotificationBar/BottomNotificationBar";
import LoadingGif from "../../../components/ui/LoadingGif/LoadingGif";
import WorkersStore from '../../../stores/WorkersStore';
import ProposalStore from '../../../stores/ProposalStore';
import ProposalRecommendationsStore from '../../../stores/ProposalRecommendationsStore';
import '../../../../scss/pages/proposals.scss';
import * as ProposalActionCreators from "../../../actions/ProposalActionCreators";

function requestData() {
    ProposalActionCreators.requestRecommendations();
}

function getState(props) {
    const networks = WorkersStore.getAll();
    const error = WorkersStore.getConnectError();
    const isLoading = WorkersStore.isLoading();

    const recommendations = ProposalRecommendationsStore.getAll();

    return {
        networks,
        error,
        isLoading,
        recommendations
    };
}

@AuthenticatedComponent
@translate('ProposalsPage')
@connectToStores([WorkersStore, ProposalStore, ProposalRecommendationsStore], getState)
export default class ProposalsPage extends Component {

    static propTypes = {
        // Injected by @AuthenticatedComponent
        user           : PropTypes.object.isRequired,
        // Injected by @translate:
        strings        : PropTypes.object,
        // Injected by @connectToStores:
        networks       : PropTypes.array.isRequired,
        error          : PropTypes.bool,
        isLoading      : PropTypes.bool,
        recommendations: PropTypes.array.isRequired,
    };

    static contextTypes = {
        router: PropTypes.object.isRequired
    };

    constructor(props) {
        super(props);

        ProposalActionCreators.cleanCreatingProposal();

        this.onLeftLinkClickHandler = this.onLeftLinkClickHandler.bind(this);
        this.goToEditAvailability = this.goToEditAvailability.bind(this);

        this.state = {
            current: 0
        };
    }

    componentDidMount() {
        requestData(this.props);
    }

    onLeftLinkClickHandler() {
        this.context.router.push(`/about-me`);
    }

    goToEditAvailability() {
        this.context.router.push('/availability-edit');
    }

    renderEmptyMessage() {
        return <div className={styles.empty}>strings.empty</div>
    }

    render() {
        const {recommendations, notifications, strings, isLoading} = this.props;

        return (
            <div className={'views'}>
                <div className={styles.topNavBar}>
                    <TopNavBar isLeftProfile={true} textCenter={strings.discover} firstIconRight={'clock'} onRightLinkClickHandler={this.goToEditAvailability} boxShadow={true} iconsRightColor={'#756EE5'}/>
                </div>
                <div className={styles.view}>
                    {isLoading ?
                        <LoadingGif/>
                        : <ProposalRecommendationList recommendations={recommendations}/>
                    }
                </div>
                <BottomNotificationBar/>
                <BottomNavBar current={'proposals'} notifications={notifications}/>
            </div>
        );
    }

}

ProposalsPage.defaultProps = {
    strings: {
        discover: 'Discover proposals',
    }
};