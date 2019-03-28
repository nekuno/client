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
import RoundedIcon from "../../../components/ui/RoundedIcon/RoundedIcon";
import FilterStore from "../../../stores/FilterStore";
import ProposalFilterPreview from "../../../components/ui/ProposalFilterPreview/ProposalFilterPreview";
import ProfileStore from "../../../stores/ProfileStore";
import ProposalIcon from "../../../components/ui/ProposalIcon/ProposalIcon";

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

    const metadata = ProfileStore.getMetadata();
    const industrySectorChoices = metadata && metadata.industry ? metadata.industry.choices : null;

    let experienceOptions = null;
    switch (CreatingProposalStore.proposal.type) {
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
        industrySectorChoices,
        experienceOptions,
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
        industrySectorChoices: PropTypes.array,
        experienceOptions : PropTypes.array,

    };

    static contextTypes = {
        router : PropTypes.object.isRequired
    };

    constructor(props) {
        super(props);

        this.state = {
            loading : false,
        };

        // this.topNavBarRightLinkClick = this.topNavBarRightLinkClick.bind(this);
        this.topNavBarLeftLinkClick = this.topNavBarLeftLinkClick.bind(this);
        this.handleStepsBarClick = this.handleStepsBarClick.bind(this);
    }

    componentDidMount() {
        requestData(this.props);
    }

    componentWillMount() {
        // if (CreatingProposalStore.proposal.participantLimit) {
        //     this.setState({
        //         participantLimit : CreatingProposalStore.proposal.participantLimit,
        //     });
        //     if (CreatingProposalStore.proposal.participantLimit > 1) {
        //         this.setState({
        //             disableSubstract : false,
        //         });
        //     }
        // }
    }

    topNavBarLeftLinkClick() {
        this.context.router.goBack();
    }

    // topNavBarRightLinkClick() {
    //     ProposalActionCreators.cleanCreatingProposal();
    //     this.context.router.push('/proposals');
    // }

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
        const {strings, proposal, industrySectorChoices, experienceOptions} = this.props;

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
            <div className="views">
                <div className="view view-main proposals-preview-view">
                    <TopNavBar
                        position={'absolute'}
                        background={'transparent'}
                        iconLeft={'arrow-left'}
                        textSize={'small'}
                        onLeftLinkClickHandler={this.topNavBarLeftLinkClick}/>
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
                                                    {industrySectorChoices.find(x => x.id === item).text}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    : null
                                }
                                {proposal.fields.profession ?
                                <div className={'information-wrapper'}>
                                    <div className={'rounded-icon-wrapper'}>
                                        <ProposalIcon size={'medium-small'} icon={'skills'} background={'white'}/>
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
                                                    {experienceOptions.find(x => x.id === item).text}
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
                                                    {experienceOptions.find(x => x.id === item).text}
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
                                                    {experienceOptions.find(x => x.id === item).text}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    : null
                                }



                                <div className={'information-wrapper'}>
                                    <div className={'rounded-icon-wrapper'}>
                                        <ProposalIcon size={'medium-small'} icon={'availability'} background={'white'}/>
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
    }
};