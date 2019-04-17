import PropTypes from 'prop-types';
import React, { Component } from 'react';
import translate from '../../../i18n/Translate';
import AuthenticatedComponent from "../../../components/AuthenticatedComponent";
import connectToStores from "../../../utils/connectToStores";
import TopNavBar from '../../../components/TopNavBar/TopNavBar.js';
import StepsBar from "../../../components/ui/StepsBar/StepsBar";
import CreatingProposalStore from '../../../stores/CreatingProposalStore';
import * as ProposalActionCreators from "../../../actions/ProposalActionCreators";
import ProposalStore from "../../../stores/ProposalStore";
import '../../../../scss/pages/proposals/edit/preview-page.scss';
import FilterStore from "../../../stores/FilterStore";
import ProposalFilterPreview from "../../../components/ui/ProposalFilterPreview/ProposalFilterPreview";
import ProfileStore from "../../../stores/ProfileStore";
import ProposalIcon from "../../../components/ui/ProposalIcon/ProposalIcon";
import AvailabilityPreview from "../../../components/ui/AvailabilityPreview/AvailabilityPreview";
import ProposalFieldsPreview from "../../../components/ui/ProposalFieldsPreview/ProposalFieldsPreview";

/**
 * Requests data from server (or store) for current props.
 */
function requestData(props) {
    ProposalActionCreators.requestOwnProposals();
}

/**
 * Retrieves state from stores for current props.s
 */
function getState() {
    const proposal = CreatingProposalStore.proposal;

    return {
        proposal
    };
}

@AuthenticatedComponent
@translate('ProposalPreviewPage')
@connectToStores([CreatingProposalStore, FilterStore, ProposalStore, ProfileStore], getState)
export default class ProposalPreviewPage extends Component {

    static propTypes = {
        params           : PropTypes.shape({
            proposalId: PropTypes.string
        }).isRequired,
        // Injected by @AuthenticatedComponent
        user        : PropTypes.object.isRequired,
        // Injected by @translate:
        strings     : PropTypes.object,
        // Injected by @connectToStores:
        proposal    : PropTypes.object,

    };

    static contextTypes = {
        router : PropTypes.object.isRequired
    };

    constructor(props) {
        super(props);

        this.state = {
            loading : false,
        };

        this.handleStepsBarClick = this.handleStepsBarClick.bind(this);
    }

    componentDidMount() {
        requestData(this.props);
    }

    handleStepsBarClick() {
        const {params} = this.props;
        if (!this.state.loading) {
            this.setState({loading: true});
            if (params.proposalId) {
                ProposalActionCreators.updateProposal(CreatingProposalStore.proposal.id, CreatingProposalStore.proposal)
                    .then(() => {
                        ProposalActionCreators.cleanCreatingProposal();
                        this.context.router.push('/proposals');
                    }, () => {
                        this.setState({loading: false});
                    });
            } else {
                ProposalActionCreators.createProposal(CreatingProposalStore.proposal)
                    .then(() => {
                        ProposalActionCreators.cleanCreatingProposal();
                        this.context.router.push('/proposals');
                    }, () => {
                        this.setState({loading: false});
                    });
            }
        }
    }

    getProposalColor() {
        let color;

        if (CreatingProposalStore.proposal.selectedType) {
            switch (CreatingProposalStore.proposal.selectedType) {
                case 'leisure':
                    color = 'pink';
                    break;
                case 'experience':
                    color = 'green';
                    break;
                default:
                    color = 'blue';
                    break;
            }
        } else {
            switch (CreatingProposalStore.proposal.type) {
                case 'sports':
                case 'hobbies':
                case 'games':
                    color = 'pink';
                    break;
                case 'shows':
                case 'restaurants':
                case 'plans':
                    color = 'green';
                    break;
                default:
                    color = 'blue';
                    break;
            }
        }

        return color;
    }

    getHexadecimalColor() {
        let color;

        switch (CreatingProposalStore.proposal.type) {
            case 'sports':
            case 'hobbies':
            case 'games':
                color = '#D380D3';
                break;
            case 'shows':
            case 'restaurants':
            case 'plans':
                color = '#7bd47e';
                break;
            default:
                color = '#63caff';
                break;
        }

        return color;
    }

    renderFloatingIcon() {
        const {proposal} = this.props;
        let icon = '';

        switch (proposal.type) {
            case 'work':
                icon = 'project';
                break;
            case 'sports':
            case 'hobbies':
            case 'games':
                icon = 'hobbie';
                break;
            case 'shows':
            case 'restaurants':
            case 'plans':
                icon = 'experience';
                break;
            default:
                break;
        }

        return (
            <ProposalIcon size={'medium-small'} icon={icon} background={'white'}/>
        );
    }

    render() {
        const {strings, proposal} = this.props;

        const stringProposalTypes = {
            work: strings.work,
            leisure: strings.leisure,
            experience: strings.experience,
        };

        return (
            <div className="views">
                <div className="view view-main proposals-preview-view">
                    <TopNavBar
                        position={'absolute'}
                        background={'transparent'}
                        isLeftBack={true}
                        textSize={'small'}/>
                    {proposal ?
                        <div className="proposals-preview-wrapper">

                            <div className={"proposal-floating-icon-container"}>
                                {this.renderFloatingIcon()}
                            </div>

                            <div className={'image-wrapper'}>
                                <img src={'https://via.placeholder.com/480x240'}/>
                                <h2 className={'bottom-left'}>{proposal.fields.title}</h2>
                            </div>
                            <div className={'content-wrapper'}>
                                <p className={'category'}>{stringProposalTypes[proposal.type]}</p>
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
                                {proposal.filters.userFilters ?
                                    <div className={'filters-wrapper'}>
                                        <ProposalFilterPreview proposalFilters={proposal.filters.userFilters}/>
                                    </div>
                                    : null
                                }
                            </div>
                        </div>
                        : null
                    }

                </div>
                <StepsBar
                    color={this.getProposalColor()}
                    canContinue={true}
                    continueText={CreatingProposalStore.proposal.id ? strings.editProposal : strings.publishProposal}
                    totalSteps={0}
                    onClickHandler={this.handleStepsBarClick}/>
            </div>
        );
    }
}

ProposalPreviewPage.defaultProps = {
    strings: {
        publishProposal          : 'Publish proposal',
        editProposal             : 'Edit proposal',
        work           : 'Project',
        leisure        : 'Leisure',
        experience     : 'Experience',
        sectors        : 'Sectors',
        profession     : 'Professions',
        skills         : 'Skills',
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
        shows                    : 'Events',
        restaurants              : 'Gourmet',
        plans                    : 'Plans',
        sports                   : 'Sports',
        hobbies                  : 'Hobbys',
        games                    : 'Games',
    }
};