import PropTypes from 'prop-types';
import React, { Component } from 'react';
import translate from '../i18n/Translate';
import connectToStores from '../utils/connectToStores';
import AuthenticatedComponent from '../components/AuthenticatedComponent';
import ProposalRecommendationList from '../components/ui/ProposalRecommendationList/ProposalRecommendationList';
import BottomNavBar from '../components/BottomNavBar/BottomNavBar.js';
import TopNavBar from '../components/TopNavBar/TopNavBar.js';
import BottomNotificationBar from "../components/ui/BottomNotificationBar/BottomNotificationBar";
import WorkersStore from '../stores/WorkersStore';
import ProposalStore from '../stores/ProposalStore';
import ProposalRecommendationsStore from '../stores/ProposalRecommendationsStore';
import '../../scss/pages/proposals.scss';
import * as ProposalActionCreators from "../actions/ProposalActionCreators";

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

    render() {
        const {recommendations, notifications, strings} = this.props;

        return (
            <div className="views">
                <div className="view view-main proposals-view">
                    <TopNavBar isLeftProfile={true} textCenter={strings.discover} firstIconRight={'clock'} onRightLinkClickHandler={this.goToEditAvailability} boxShadow={true} iconsRightColor={'#756EE5'} />
                    <ProposalRecommendationList recommendations={recommendations}/>
                    <BottomNotificationBar/>
                    <BottomNavBar current={'proposals'} notifications={notifications}/>
                </div>
            </div>
        );
    }

}

ProposalsPage.defaultProps = {
    strings: {
        discover: 'Discover proposals',
    }
};