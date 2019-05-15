import PropTypes from 'prop-types';
import React, { Component } from 'react';
import translate from '../i18n/Translate';
import connectToStores from '../utils/connectToStores';
import AuthenticatedComponent from '../components/AuthenticatedComponent';
import TopNavBar from '../components/TopNavBar/TopNavBar.js';
import '../../scss/pages/proposal-detail.scss';
import ProposalStore from "../stores/ProposalStore";
import RouterActionCreators from '../actions/RouterActionCreators';
import * as ProposalActionCreators from "../actions/ProposalActionCreators";
import ProposalFilterPreview from "../components/ui/ProposalFilterPreview/ProposalFilterPreview";
import TagSuggestionsStore from "../stores/TagSuggestionsStore";
import RoundedImage from "../components/ui/RoundedImage/RoundedImage";
import ChatUserStatusStore from "../stores/ChatUserStatusStore";
import ProposalIcon from "../components/ui/ProposalIcon/ProposalIcon";
import AvailabilityPreview from "../components/ui/AvailabilityPreview/AvailabilityPreview";
import ProposalFieldsPreview from "../components/ui/ProposalFieldsPreview/ProposalFieldsPreview";

/**
 * Requests data from server for current props.
 */
function requestData(props) {
    ProposalActionCreators.requestOwnProposals();
}

function getState(props) {
    const proposalId = props.params.proposalId;
    const proposal = ProposalStore.getOwnProposal(proposalId) ? ProposalStore.getOwnProposal(proposalId) : ProposalStore.getAnyById(proposalId);

    const onlineUserIds = ChatUserStatusStore.getOnlineUserIds() || [];


    return {
        proposal,
        onlineUserIds,};
}

@AuthenticatedComponent
@translate('ProposalDetailPage')
@connectToStores([ProposalStore, TagSuggestionsStore, ChatUserStatusStore], getState)
export default class ProposalDetailPage extends Component {

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
        industrySectorChoices: PropTypes.array,
        onlineUserIds : PropTypes.array,
        experienceOptions : PropTypes.array,
    };

    constructor(props) {
        super(props);

        this.topNavBarLeftLinkClick = this.topNavBarLeftLinkClick.bind(this);
        this.handleContinueClick = this.handleContinueClick.bind(this);
        this.removeProposalClick = this.removeProposalClick.bind(this);
        this.viewAllMatchesClick = this.viewAllMatchesClick.bind(this);
    }

    static contextTypes = {
        router: PropTypes.object.isRequired
    };

    componentDidMount() {
        requestData(this.props);
    }

    removeProposalClick() {
        ProposalActionCreators.deleteProposal(this.props.params.proposalId);
    }

    handleContinueClick() {
        this.context.router.push('/proposal-basic-edit/' + this.props.params.proposalId);
    }

    topNavBarLeftLinkClick() {
        RouterActionCreators.previousRoute(this.context.router.getCurrentLocation().pathname);
    }

    viewAllMatchesClick() {
        this.context.router.push(`/proposal/` + this.props.params.proposalId + `/matches`);
    }

    renderFloatingIcon() {
        const {proposal} = this.props;
        let icon = '';

        switch (proposal.type) {
            case 'work':
                icon = 'icon-project';
                break;
            case 'sports':
                icon = 'icon-hobbie';
                break;
            case 'hobbies':
                icon = 'icon-hobbie';
                break;
            case 'games':
                icon = 'icon-hobbie';
                break;
            case 'shows':
                icon = 'icon-experience';
                break;
            case 'restaurants':
                icon = 'icon-experience';
                break;
            case 'plans':
                icon = 'icon-experience';
                break;
            default:
                break;
        }

        return (
            <span className={icon}>
                <span className="path1"></span>
                <span className="path2"></span>
                <span className="path3"></span>
                <span className="path4"></span>
                <span className="path5"></span>
                <span className="path6"></span>
                <span className="path7"></span>
            </span>
        );
    }

    render() {
        const {strings, proposal, onlineUserIds} = this.props;

        return (
            proposal ?
                <div className="other-user-proposal-detail-view">
                    <TopNavBar
                        position={'absolute'}
                        background={'transparent'}
                        iconLeft={'arrow-left'}
                        textSize={'small'}
                        onLeftLinkClickHandler={this.topNavBarLeftLinkClick}
                        onRightLinkClickHandler={this.topNavBarRightLinkClick}/>
                    <div className="other-user-proposal-detail-wrapper">
                        <div className={"proposal-floating-icon-container"}>
                            {this.renderFloatingIcon()}
                        </div>
                        <div className={'image-wrapper'}>
                            <img src={'https://via.placeholder.com/480x240'}/>
                            <h2 className={'bottom-left'}>{proposal.fields.title}</h2>
                        </div>
                        <div className={'content-wrapper'}>

                            <div className={'proposal-users-match'}>
                                <div className={'proposal-users-match-header'}>
                                    <div className={'matches-number'}>{strings.numberOfMatches.replace("%numberOfMatches%", proposal.countMatches)}</div>
                                    <div className={'view-all'} onClick={this.viewAllMatchesClick}>{strings.viewAll}</div>
                                </div>
                                <div className={'proposal-users-match-body'}>
                                    {proposal.matches.map((item, index) =>
                                        <div key={index} className={'proposal-users-image'}>
                                            <RoundedImage url={item.photo.thumbnail.small} size={'x-small'}/>
                                            <div className={"status " + onlineUserIds.find(x => x === item.id) ? 'online' : 'offline'}></div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <p className={'category'}>{strings.project}</p>
                            <p>{proposal.fields.description}</p>

                            <ProposalFieldsPreview proposal={proposal}/>

                            <div className={'information-wrapper'}>
                                <AvailabilityPreview availability={proposal.fields.availability}/>
                            </div>

                            <div className={'information-wrapper'}>
                                <div className={'rounded-icon-wrapper'}>
                                    <ProposalIcon size={'medium-small'} icon={'participants'} background={'white'}/>
                                </div>
                                <div className={'text-wrapper'}>
                                    <div className={'title small'}>{strings.numberOfMembers}</div>
                                    <div className={'resume small'}>{proposal.fields.participantLimit} {strings.people}</div>
                                </div>
                            </div>
                            {proposal.filters ?
                                <ProposalFilterPreview proposalFilters={proposal.filters.userFilters}/>
                                : null
                            }
                        </div>

                        <div className={'remove-proposal-container'}>
                            <div className={'remove-proposal-title'} onClick={this.removeProposalClick}>{strings.deleteProposal}</div>
                            <div className={'remove-proposal-description'}>{strings.deleteProposalDescription}</div>
                        </div>
                    </div>

                    <div className="skip-nav-bar" onClick={this.handleContinueClick}>
                        <div className="text">{strings.editProposal}</div>
                    </div>
                </div>
                : null
        );
    }

}

ProposalDetailPage.defaultProps = {
    strings: {
        numberOfMatches: 'Good! %numberOfMatches% matches',
        publishProposal          : 'Publish proposal',
        editProposal             : 'Edit proposal',
        work           : 'Project',
        leisure        : 'Leisure',
        experience     : 'Experience',
        availability   : 'Availability',
        numberOfMembers: 'Number of members',
        filterText     : 'Filters to your proposal target',
        basics         : 'Basics',
        culture        : 'Culture and languages',
        drugs          : 'Drugs and other services',
        familiar       : 'Familiar aspects',
        people         : 'people',
        years          : 'years',
        withinRadioOf  : 'within radio of',
        deleteProposal  : 'Delete proposal',
        deleteProposalDescription : 'If you delete the proposal the data will be completely deleted and will no longer be visible to users who have matched this.',
    }
};