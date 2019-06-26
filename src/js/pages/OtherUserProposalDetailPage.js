import PropTypes from 'prop-types';
import React, { Component } from 'react';
import translate from '../i18n/Translate';
import connectToStores from '../utils/connectToStores';
import AuthenticatedComponent from '../components/AuthenticatedComponent';
import TopNavBar from '../components/ui/TopNavBar';
import '../../scss/pages/other-user-proposal-detail.scss';
import ProposalStore from "../stores/ProposalStore";
import * as UserActionCreators from "../actions/UserActionCreators";
import * as ProposalActionCreators from "../actions/ProposalActionCreators";
import RoundedImage from "../components/ui/RoundedImage";
import MatchingBars from "../components/ui/MatchingBars";
import UserStore from "../stores/UserStore";
import ProfileStore from "../stores/ProfileStore";
import ProposalIcon from "../components/ui/ProposalIcon";
import AvailabilityPreview from "../components/ui/AvailabilityPreview";
import ProposalFieldsPreview from "../components/ui/ProposalFieldsPreview";
import ButtonGoToProposalChat from "../components/ui/ButtonGoToProposalChat";

/**
 * Requests data from server for current props.
 */
function requestData(props) {
    const {slug, proposalId} = props.params;
    UserActionCreators.requestUser(slug);
    ProposalActionCreators.requestOtherProposal(proposalId, slug);
}

function getState(props) {
    const userSlug = props.params.slug;
    const proposalId = props.params.proposalId;

    const proposal = ProposalStore.get(userSlug, proposalId);
    const otherUser = UserStore.getBySlug(userSlug);

    const otherUserProfile = ProfileStore.getWithMetadata(userSlug);

    return {
        proposal,
        otherUser,
        otherUserProfile,
    };
}

@AuthenticatedComponent
@translate('OtherUserProposalDetailPage')
@connectToStores([ProposalStore, UserStore, ProfileStore], getState)
export default class OtherUserProposalDetailPage extends Component {

    static propTypes = {
        params               : PropTypes.shape({
            slug      : PropTypes.string.isRequired,
            proposalId: PropTypes.string.isRequired
        }).isRequired,
        // Injected by @AuthenticatedComponent
        user                 : PropTypes.object.isRequired,
        // Injected by @translate:
        strings              : PropTypes.object,
        // Injected by @connectToStores:
        proposal             : PropTypes.object,
        otherUser            : PropTypes.object,
        industrySectorChoices: PropTypes.array,
        otherUserProfile     : PropTypes.array,
        experienceOptions    : PropTypes.array,
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

    topNavBarLeftLinkClick() {
        this.context.router.push(`/p/` + this.props.params.slug + `/proposals`);
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

    renderProposalType() {
        const {proposal, strings} = this.props;
        let proposalType = '';

        switch (proposal.type) {
            case 'work':
                proposalType = strings.project;
                break;
            case 'sports':
            case 'hobbies':
            case 'games':
                proposalType = strings.leisure;
                break;
            case 'shows':
            case 'restaurants':
            case 'plans':
                proposalType = strings.experience;
                break;
            default:
                break;
        }
        return proposalType;
    }

    render() {
        const {strings, proposal, otherUser, otherUserProfile} = this.props;
        const availability = proposal.fields ? proposal.fields.availability : null;
        const otherUserThumbnail = otherUser ? otherUser.photo.thumbnail.small : '';
        const otherUserUsername = otherUser ? otherUser.username : '';
        const hasMatch = proposal.hasMatch ? proposal.hasMatch : null;

        return (
            <div className="other-user-proposal-detail-view">
                <TopNavBar
                    background={'transparent'}
                    leftIcon={'arrow-left'}
                    onLeftLinkClickHandler={this.topNavBarLeftLinkClick}/>
                {proposal.fields ?
                    <div className="other-user-proposal-detail-wrapper">

                        <div className={"proposal-floating-icon-container"}>
                            {this.renderFloatingIcon()}
                        </div>
                        <div className={'image-wrapper'}>
                            <img src={'https://via.placeholder.com/480x240'}/>
                            <h2 className={'bottom-left'}>{proposal.fields.title}</h2>
                        </div>

                        <div className={'user-data'}>
                            <RoundedImage size={'small'} url={otherUserThumbnail}/>
                            <div className={'user-text'}>
                                <div className={'username'}>{otherUserUsername}</div>
                                {otherUserProfile[0] ?
                                    <div className={'age-city'}>{otherUserProfile[0].fields.location.value} &bull; {otherUserProfile[0].fields.birthday.value}</div>
                                    : null
                                }
                            </div>
                        </div>
                        <MatchingBars matching={0} similarity={0}/>

                        <div className={'content-wrapper'}>
                            <p className={'category'}>{this.renderProposalType()}</p>
                            <p>{proposal.fields.description}</p>

                            <ProposalFieldsPreview proposal={proposal}/>

                            <div className={'information-wrapper'}>
                                <AvailabilityPreview availability={availability}/>
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
                        </div>


                    </div>

                    : null
                }
                {
                    hasMatch && otherUser?
                        <ButtonGoToProposalChat user={otherUser}/>
                        :
                        null
                }
            </div>
        );
    }
}

OtherUserProposalDetailPage.defaultProps = {
    strings: {
        project   : 'Project',
        leisure   : 'Leisure',
        experience: 'Experience',

        sectors: 'Sectors',
        skills : 'Skills',
    }
};