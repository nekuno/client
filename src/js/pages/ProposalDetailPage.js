import PropTypes from 'prop-types';
import React, { Component } from 'react';
import translate from '../i18n/Translate';
import connectToStores from '../utils/connectToStores';
import AuthenticatedComponent from '../components/AuthenticatedComponent';
import TopNavBar from '../components/TopNavBar/TopNavBar.js';
import '../../scss/pages/proposal-detail.scss';
import ProposalStore from "../stores/ProposalStore";
import * as ProposalActionCreators from "../actions/ProposalActionCreators";
import RoundedIcon from "../components/ui/RoundedIcon/RoundedIcon";
import ProposalFilterPreview from "../components/ui/ProposalFilterPreview/ProposalFilterPreview";
import ProfileStore from "../stores/ProfileStore";
import TagSuggestionsStore from "../stores/TagSuggestionsStore";
import RoundedImage from "../components/ui/RoundedImage/RoundedImage";
import ChatUserStatusStore from "../stores/ChatUserStatusStore";
import ChatActionCreators from "../actions/ChatActionCreators";
import CreatingProposalStore from "../stores/CreatingProposalStore";

/**
 * Requests data from server for current props.
 */
function requestData(props) {
    ProposalActionCreators.requestOwnProposals();
}

function getState(props) {
    const proposalId = props.params.proposalId;
    const proposal = ProposalStore.getOwnProposal(proposalId) ? ProposalStore.getOwnProposal(proposalId) : ProposalStore.getAnyById(proposalId);

    const metadata = ProfileStore.getMetadata();
    const industrySectorChoices = metadata && metadata.industry ? metadata.industry.choices : null;

    const onlineUserIds = ChatUserStatusStore.getOnlineUserIds() || [];

    let experienceOptions = null;
    if (proposal) {
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
    }

    return {
        proposal,
        industrySectorChoices,
        onlineUserIds,
        experienceOptions,
    };
}

@AuthenticatedComponent
@translate('ProposalDetailPage')
@connectToStores([ProposalStore, ProfileStore, TagSuggestionsStore, ChatUserStatusStore], getState)
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
        this.context.router.push('/plans');
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
        const {params, user, strings, proposal, industrySectorChoices, onlineUserIds, experienceOptions} = this.props;

        console.log(proposal);
        console.log(experienceOptions);


        const dailyWeekdayOptions = {
            Monday   : strings.monday,
            Tuesday  : strings.tuesday,
            Wednesday: strings.wednesday,
            Thursday : strings.thursday,
            Friday   : strings.friday,
            Saturday : strings.saturday,
            Sunday   : strings.sunday
        };

        const stringRanges = {
            Morning  : strings.morning,
            Afternoon: strings.afternoon,
            Night    : strings.night,
        };

        const stringProposalTypes = {
            work: strings.work,
            leisure: strings.leisure,
            experience: strings.experience,
        };


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

                            {proposal.fields.industry && industrySectorChoices !== null ?
                                <div className={'information-wrapper'}>
                                    <div className={'rounded-icon-wrapper'}>
                                        <RoundedIcon
                                            icon={'briefcase'}
                                            size={'small'}
                                            color={'#2B3857'}
                                            background={'#FBFCFD'}
                                            border={'1px solid #F0F1FA'}/>
                                    </div>
                                    <div className={'text-wrapper'}>
                                        <div className={'title small'}>{strings.sectors}</div>
                                        {proposal.fields.industry.map((item, index) =>
                                            <div className={'small'} key={index}>
                                                {industrySectorChoices.find(x => x.id === item.value).text}
                                            </div>
                                        )}
                                    </div>
                                </div>
                                : null
                            }

                            {proposal.fields.profession ?
                                <div className={'information-wrapper'}>
                                    <div className={'rounded-icon-wrapper'}>
                                        <RoundedIcon
                                            icon={'briefcase'}
                                            size={'small'}
                                            color={'#2B3857'}
                                            background={'#FBFCFD'}
                                            border={'1px solid #F0F1FA'}/>
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
                                        <RoundedIcon
                                            icon={'briefcase'}
                                            size={'small'}
                                            color={'#2B3857'}
                                            background={'#FBFCFD'}
                                            border={'1px solid #F0F1FA'}/>
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
                                        <RoundedIcon
                                            icon={'briefcase'}
                                            size={'small'}
                                            color={'#2B3857'}
                                            background={'#FBFCFD'}
                                            border={'1px solid #F0F1FA'}/>
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
                                        <RoundedIcon
                                            icon={'briefcase'}
                                            size={'small'}
                                            color={'#2B3857'}
                                            background={'#FBFCFD'}
                                            border={'1px solid #F0F1FA'}/>
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
                                        <RoundedIcon
                                            icon={'briefcase'}
                                            size={'small'}
                                            color={'#2B3857'}
                                            background={'#FBFCFD'}
                                            border={'1px solid #F0F1FA'}/>
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
                                        <RoundedIcon
                                            icon={'briefcase'}
                                            size={'small'}
                                            color={'#2B3857'}
                                            background={'#FBFCFD'}
                                            border={'1px solid #F0F1FA'}/>
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
                                        <RoundedIcon
                                            icon={'briefcase'}
                                            size={'small'}
                                            color={'#2B3857'}
                                            background={'#FBFCFD'}
                                            border={'1px solid #F0F1FA'}/>
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
                                <div className={'rounded-icon-wrapper'}>
                                    <RoundedIcon
                                        icon={'calendar'}
                                        size={'small'}
                                        color={'#2B3857'}
                                        background={'#FBFCFD'}
                                        border={'1px solid #F0F1FA'}/>
                                </div>
                                <div className={'text-wrapper'}>
                                    <div className={'title small'}>{strings.availability}</div>
                                    {proposal.fields.availability ? (
                                        <div className="resume small">
                                            {proposal.fields.availability.dynamic.map((day, index) =>
                                                <div key={index}>
                                                    {dailyWeekdayOptions[day.weekday]}
                                                    ,
                                                    {day.range.map((range, rangeIndex) =>
                                                        <span key={rangeIndex}> {day.range.length === rangeIndex + 1 ? strings.and + ' ' + stringRanges[range] : stringRanges[range]}</span>
                                                    )}
                                                </div>
                                            )}

                                            {proposal.fields.availability.static.map((day, index) =>
                                                <div key={index}>
                                                    {strings.from} {day.days.start} {strings.to} {day.days.end}
                                                    ,
                                                    {day.range.map((range, rangeIndex) =>
                                                        <span key={rangeIndex}> {day.range.length === rangeIndex + 1 ? strings.and + ' ' + stringRanges[range] : stringRanges[range]}</span>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    ) : (
                                        <div className="resume small">{strings.availabilityDescription}</div>
                                    )}
                                </div>
                            </div>

                            <div className={'information-wrapper'}>
                                <div className={'rounded-icon-wrapper'}>
                                    <RoundedIcon
                                        icon={'users'}
                                        size={'small'}
                                        color={'#2B3857'}
                                        background={'#FBFCFD'}
                                        border={'1px solid #F0F1FA'}/>
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
        monday         : 'Monday',
        tuesday        : 'Tuesday',
        wednesday      : 'Wednesday',
        thursday       : 'Thursday',
        friday         : 'Friday',
        saturday       : 'Saturday',
        sunday         : 'Sunday',
        and            : 'and',
        morning        : 'morning',
        afternoon      : 'afternoon',
        night          : 'night',
        from           : 'From',
        to             : 'to',
        years          : 'years',
        withinRadioOf  : 'within radio of',
        shows                    : 'Events',
        restaurants              : 'Gourmet',
        plans                    : 'Plans',
        sports                   : 'Sports',
        hobbies                  : 'Hobbys',
        games                    : 'Games',
        deleteProposal  : 'Delete proposal',
        deleteProposalDescription : 'If you delete the proposal the data will be completely deleted and will no longer be visible to users who have matched this.',
    }
};