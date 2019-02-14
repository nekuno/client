import PropTypes from 'prop-types';
import React, { Component } from 'react';
import translate from '../i18n/Translate';
import connectToStores from '../utils/connectToStores';
import AuthenticatedComponent from '../components/AuthenticatedComponent';
import BottomNavBar from '../components/BottomNavBar/BottomNavBar.js';
import TopNavBar from '../components/TopNavBar/TopNavBar.js';
import OwnProposalCard from '../components/Proposal/OwnProposalCard/OwnProposalCard.js';
import WorkersStore from '../stores/WorkersStore';
import '../../scss/pages/proposal-detail.scss';
import CarouselContinuous from "../components/ui/CarouselContinuous/CarouselContinuous";
import ProposalStore from "../stores/ProposalStore";
import * as UserActionCreators from "../actions/UserActionCreators";
import * as QuestionActionCreators from "../actions/QuestionActionCreators";
import * as ProposalActionCreators from "../actions/ProposalActionCreators";
import RoundedIcon from "../components/ui/RoundedIcon/RoundedIcon";
import ProposalFilterPreview from "../components/ui/ProposalFilterPreview/ProposalFilterPreview";
import ProfileStore from "../stores/ProfileStore";
import TagSuggestionsStore from "../stores/TagSuggestionsStore";
import RouterActionCreators from "../actions/RouterActionCreators";
import RoundedImage from "../components/ui/RoundedImage/RoundedImage";
import SelectCollapsible from "../components/ui/SelectCollapsible/SelectCollapsible";
import SelectCollapsibleInterest from "../components/ui/SelectCollapsibleInterest/SelectCollapsibleInterest";

/**
 * Requests data from server for current props.
 */
function requestData(props) {
    ProposalActionCreators.requestOwnProposals();
}

function getState(props) {
    const proposalId = props.params.proposalId;
    const proposal = ProposalStore.getOwnProposal(proposalId);

    const metadata = ProfileStore.getMetadata();
    const industryChoices = metadata && metadata.industry ? metadata.industry.choices : [];

    return {
        proposal,
        industryChoices,
    };
}

@AuthenticatedComponent
@translate('ProposalDetailMatchesPage')
@connectToStores([ProposalStore, ProfileStore, TagSuggestionsStore], getState)
export default class ProposalDetailMatchesPage extends Component {

    static propTypes = {
        params           : PropTypes.shape({
            proposalId: PropTypes.string.isRequired
        }).isRequired,
        // Injected by @AuthenticatedComponent
        user        : PropTypes.object.isRequired,
        // Injected by @translate:
        strings     : PropTypes.object,
        // Injected by @connectToStores:
        proposal    : PropTypes.object,
        industryChoices : PropTypes.array,

        // networks    : PropTypes.array.isRequired,
        // error       : PropTypes.bool,
        // isLoading   : PropTypes.bool,
        // ownProposals: PropTypes.array,
    };

    constructor(props) {
        super(props);

        this.topNavBarLeftLinkClick = this.topNavBarLeftLinkClick.bind(this);
    }

    static contextTypes = {
        router: PropTypes.object.isRequired
    };

    componentDidMount() {
        requestData(this.props);
    }

    removeProposalClick() {
        // remove proposal
    }

    handleContinueClick() {
        // Go edit proposal
    }

    topNavBarLeftLinkClick() {
        const {params} = this.props;

        this.context.router.push(`/proposal/` + params.proposalId);
    }

    render() {
        const {params, user, strings, proposal} = this.props;

        const orderOptions = [
            {
                id: 'compatibility',
                text: strings.compatibility
            },
            {
                id: 'similarity',
                text: strings.similarity
            },
            {
                id: 'coincidences',
                text: strings.coincidences
            }
        ];

        return (
            proposal ?
                <div className="proposal-detail-view">
                    <TopNavBar
                        iconLeft={'arrow-left'}
                        boxShadow={true}
                        searchInput={true}
                        textSize={'small'}
                        onLeftLinkClickHandler={this.topNavBarLeftLinkClick}
                        textCenter={strings.topNavBarText}
                        onSearchChange={this.handleSearch}>
                        <SelectCollapsible options={orderOptions} selected={'compatibility'} title={strings.orderedBy}/>
                    </TopNavBar>
                    <div className="proposals-project-preview-wrapper">

                    </div>
                </div>
                : null
        );
    }

}

ProposalDetailMatchesPage.defaultProps = {
    strings: {
        topNavBarText: 'People Nekuno',
        orderedBy    : 'Ordered by',
        compatibility: 'compatibility',
        similarity   : 'similarity',
        coincidences : 'coincidences'
    }
};