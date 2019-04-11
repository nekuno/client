import PropTypes from 'prop-types';
import React, {Component} from 'react';
import translate from '../i18n/Translate';
import connectToStores from '../utils/connectToStores';
import AuthenticatedComponent from '../components/AuthenticatedComponent';
import TopNavBar from '../components/TopNavBar/TopNavBar.js';
import '../../scss/pages/other-user-proposal-detail.scss';
import ProposalStore from "../stores/ProposalStore";
import * as UserActionCreators from "../actions/UserActionCreators";
import * as ProposalActionCreators from "../actions/ProposalActionCreators";
import RoundedImage from "../components/ui/RoundedImage/RoundedImage";
import MatchingBars from "../components/ui/MatchingBars/MatchingBars";
import UserStore from "../stores/UserStore";
import ProfileStore from "../stores/ProfileStore";
import ProposalIcon from "../components/ui/ProposalIcon/ProposalIcon";
import AvailabilityPreview from "../components/ui/AvailabilityPreview/AvailabilityPreview";

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

    const metadata = ProfileStore.getMetadata();
    const industrySectorChoices = metadata && metadata.industry ? metadata.industry.choices : null;

    let experienceOptions = null;
    switch (proposal.type) {
        case 'shows':
            experienceOptions = metadata && metadata.shows ? metadata.shows.choices : [];
            break;
        case 'restaurants':
            experienceOptions = metadata && metadata.restaurants ? metadata.restaurants.choices : [];
            break;
        case 'plans':
            experienceOptions = metadata && metadata.plans ? metadata.plans.choices : [];
            break;
        default:
            break;
    }

    return {
        proposal,
        otherUser,
        otherUserProfile,
        industrySectorChoices,
        experienceOptions,
    };
}

@AuthenticatedComponent
@translate('OtherUserProposalDetailPage')
@connectToStores([ProposalStore, UserStore, ProfileStore], getState)
export default class OtherUserProposalDetailPage extends Component {

    static propTypes = {
        params: PropTypes.shape({
            slug: PropTypes.string.isRequired,
            proposalId: PropTypes.string.isRequired
        }).isRequired,
        // Injected by @AuthenticatedComponent
        user: PropTypes.object.isRequired,
        // Injected by @translate:
        strings: PropTypes.object,
        // Injected by @connectToStores:
        proposal: PropTypes.object,
        otherUser: PropTypes.object,
        industrySectorChoices: PropTypes.array,
        otherUserProfile: PropTypes.array,
        experienceOptions : PropTypes.array,
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
        const {strings, proposal, otherUser, otherUserProfile, industrySectorChoices, experienceOptions} = this.props;


        return (
            <div className="other-user-proposal-detail-view">
                <TopNavBar
                    position={'absolute'}
                    background={'transparent'}
                    iconLeft={'arrow-left'}
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
                            <RoundedImage size={'small'} url={otherUser.photo.thumbnail.small}/>
                            <div className={'user-text'}>
                                <div className={'username'}>{otherUser.username}</div>
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

                            <div className={'information-wrapper'}>
                                <div className={'rounded-icon-wrapper'}>
                                    <ProposalIcon size={'medium-small'} icon={'sectors'} background={'white'}/>
                                </div>
                                <div className={'text-wrapper'}>
                                    <div className={'title small'}>{strings.sectors}</div>
                                    {industrySectorChoices && proposal && proposal.fields.industry?
                                        proposal.fields.industry.map((item, index) =>
                                            <div className={'small'} key={index}>
                                                {industrySectorChoices.find(x => x.id === item.value).text}
                                            </div>
                                        )
                                        : null
                                    }
                                </div>
                            </div>

                            {proposal.fields.profession ?
                                <div className={'information-wrapper'}>
                                    <div className={'rounded-icon-wrapper'}>
                                        <ProposalIcon size={'medium-small'} icon={'sectors'} background={'white'}/>
                                    </div>
                                    <div className={'text-wrapper'}>
                                        <div className={'title small'}>{strings.profession}</div>
                                        {proposal.fields.profession.map((item, index) =>
                                            <div className={'small'} key={index}>
                                                {item}
                                            </div>
                                        )}
                                    </div>
                                </div>
                                : null
                            }



                            {proposal.fields.sports ?
                                <div className={'information-wrapper'}>
                                    <div className={'rounded-icon-wrapper'}>
                                        <ProposalIcon size={'medium-small'} icon={'sectors'} background={'white'}/>
                                    </div>
                                    <div className={'text-wrapper'}>
                                        <div className={'title small'}>{strings.sports}</div>
                                        {proposal.fields.sports.map((item, index) =>
                                            <div className={'small'} key={index}>
                                                {item}
                                            </div>
                                        )}
                                    </div>
                                </div>
                                : null
                            }

                            {proposal.fields.hobbies ?
                                <div className={'information-wrapper'}>
                                    <div className={'rounded-icon-wrapper'}>
                                        <ProposalIcon size={'medium-small'} icon={'sectors'} background={'white'}/>
                                    </div>
                                    <div className={'text-wrapper'}>
                                        <div className={'title small'}>{strings.hobbies}</div>
                                        {proposal.fields.hobbies.map((item, index) =>
                                            <div className={'small'} key={index}>
                                                {item}
                                            </div>
                                        )}
                                    </div>
                                </div>
                                : null
                            }

                            {proposal.fields.games ?
                                <div className={'information-wrapper'}>
                                    <div className={'rounded-icon-wrapper'}>
                                        <ProposalIcon size={'medium-small'} icon={'sectors'} background={'white'}/>
                                    </div>
                                    <div className={'text-wrapper'}>
                                        <div className={'title small'}>{strings.games}</div>
                                        {proposal.fields.games.map((item, index) =>
                                            <div className={'small'} key={index}>
                                                {item}
                                            </div>
                                        )}
                                    </div>
                                </div>
                                : null
                            }



                            {proposal.fields.shows ?
                                <div className={'information-wrapper'}>
                                    <div className={'rounded-icon-wrapper'}>
                                        <ProposalIcon size={'medium-small'} icon={'sectors'} background={'white'}/>
                                    </div>
                                    <div className={'text-wrapper'}>
                                        <div className={'title small'}>{strings.shows}</div>
                                        {proposal.fields.shows.map((item, index) =>
                                            <div className={'small'} key={index}>
                                                {experienceOptions.length > 0 ?
                                                    experienceOptions.find(x => x.id === item.value).text
                                                    : null}
                                            </div>
                                        )}
                                    </div>
                                </div>
                                : null
                            }

                            {proposal.fields.restaurants ?
                                <div className={'information-wrapper'}>
                                    <div className={'rounded-icon-wrapper'}>
                                        <ProposalIcon size={'medium-small'} icon={'sectors'} background={'white'}/>
                                    </div>
                                    <div className={'text-wrapper'}>
                                        <div className={'title small'}>{strings.restaurants}</div>
                                        {proposal.fields.restaurants.map((item, index) =>
                                            <div className={'small'} key={index}>
                                                {experienceOptions.length > 0 ?
                                                    experienceOptions.find(x => x.id === item.value).text
                                                    : null}
                                            </div>
                                        )}
                                    </div>
                                </div>
                                : null
                            }

                            {proposal.fields.plans ?
                                <div className={'information-wrapper'}>
                                    <div className={'rounded-icon-wrapper'}>
                                        <ProposalIcon size={'medium-small'} icon={'sectors'} background={'white'}/>
                                    </div>
                                    <div className={'text-wrapper'}>
                                        <div className={'title small'}>{strings.plans}</div>
                                        {proposal.fields.plans.map((item, index) =>
                                            <div className={'small'} key={index}>
                                                {experienceOptions.length > 0 ?
                                                    experienceOptions.find(x => x.id === item.value).text
                                                    : null}
                                            </div>
                                        )}
                                    </div>
                                </div>
                                : null
                            }

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
            </div>
        );
    }
}

OtherUserProposalDetailPage.defaultProps = {
    strings: {
        project    : 'Project',
        leisure    : 'Leisure',
        experience : 'Experience',

        sectors: 'Sectors',
        skills: 'Skills',
    }
};