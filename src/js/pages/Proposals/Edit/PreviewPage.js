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
import '../../../../scss/pages/proposals/edit/availability-page.scss';
import RoundedIcon from "../../../components/ui/RoundedIcon/RoundedIcon";
import FilterStore from "../../../stores/FilterStore";
import ProposalFilterPreview from "../../../components/ui/ProposalFilterPreview/ProposalFilterPreview";
import ProfileStore from "../../../stores/ProfileStore";

/**
 * Requests data from server (or store) for current props.
 */
function requestData(props) {
    ProposalActionCreators.requestOwnProposals();
}

/**
 * Retrieves state from stores for current props.
 */
function getState() {
    const proposal = CreatingProposalStore.proposal;

    const metadata = ProfileStore.getMetadata();
    const industrySectorChoices = metadata && metadata.industry ? metadata.industry.choices : null;

    console.log(proposal);

    return {
        proposal,
        industrySectorChoices,
    };
}

@AuthenticatedComponent
@translate('ProposalPreviewPage')
@connectToStores([CreatingProposalStore, FilterStore, ProposalStore], getState)
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
    };

    static contextTypes = {
        router : PropTypes.object.isRequired
    };

    constructor(props) {
        super(props);

        this.topNavBarRightLinkClick = this.topNavBarRightLinkClick.bind(this);
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
        // this.context.router.push('/proposals-experience-introduction');
    }

    topNavBarRightLinkClick() {
        // ProposalActionCreators.cleanCreatingProposal();
        // this.context.router.push('/proposals');
    }

    handleStepsBarClick() {
        const {params} = this.props;

        // const proposal = CreatingProposalStore.getFinalProposal();
        // ProposalActionCreators.createProposal(proposal)
        //     .then(() => {
        //         ProposalActionCreators.cleanCreatingProposal();
        //         this.context.router.push('/proposals');
        //     }, () => {
        //         // TODO: Handle error
        //     });


        const proposal = CreatingProposalStore.proposal;
        console.log(proposal);
        ProposalActionCreators.createProposal(proposal)
            .then(() => {
                ProposalActionCreators.cleanCreatingProposal();
                this.context.router.push('/proposals');
            }, () => {
                // TODO: Handle error
            });
    }

    getProposalColor() {
        let color;

        console.log(CreatingProposalStore.proposal.selectedType);

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
                icon = 'icon-proyecto';
                break;
            case 'sports':
            case 'hobbies':
            case 'games':
                icon = 'icon-hobbie';
                break;
            case 'shows':
            case 'restaurants':
            case 'plans':
                icon = 'icon-experiencia';
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
        const {strings, proposal, industrySectorChoices} = this.props;

        const dailyWeekdayOptions = {
            monday   : strings.monday,
            tuesday  : strings.tuesday,
            wednesday: strings.wednesday,
            thursday : strings.thursday,
            friday   : strings.friday,
            saturday : strings.saturday,
            sunday   : strings.sunday
        };

        const stringRanges = {
            Morning  : strings.morning,
            Afternoon: strings.afternoon,
            Night    : strings.night,
        };

        return (
            <div className="views">
                <div className="view view-main proposal-preview-view">
                    <TopNavBar
                        position={'absolute'}
                        background={'transparent'}
                        iconLeft={'arrow-left'}
                        textSize={'small'}
                        onLeftLinkClickHandler={this.topNavBarLeftLinkClick}
                        onRightLinkClickHandler={this.topNavBarRightLinkClick}/>
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
                                <p className={'category'}>{proposal.fields.type}</p>
                                <p>{proposal.fields.description}</p>

                                {proposal.fields.industry ?
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
                                    <ProposalFilterPreview proposalFilters={proposal.proposalFilters}/>
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
                    continueText={strings.publishProposal}
                    totalSteps={0}
                    onClickHandler={this.handleStepsBarClick}/>
            </div>
        );




















        // const {strings, proposal, availability} = this.props;
        //
        //
        // const canContinue = availability !== null;
        // const disableSubstract = this.state.disableSubstract;
        //
        // const dailyWeekdayOptions = {
        //     monday    : strings.monday,
        //     tuesday   : strings.tuesday,
        //     wednesday : strings.wednesday,
        //     thursday  : strings.thursday,
        //     friday    : strings.friday,
        //     saturday  : strings.saturday,
        //     sunday    : strings.sunday
        // };
        //
        // const stringRanges = {
        //     Morning   : strings.morning,
        //     Afternoon : strings.afternoon,
        //     Night     : strings.night,
        // };
        //
        // return (
        //     <div className="views">
        //         <div className="view view-main proposals-project-availability-view">
        //             <TopNavBar
        //                 background={'transparent'}
        //                 iconLeft={'arrow-left'}
        //                 firstIconRight={'x'}
        //                 textCenter={strings.publishProposal}
        //                 textSize={'small'}
        //                 onLeftLinkClickHandler={this.topNavBarLeftLinkClick}
        //                 onRightLinkClickHandler={this.topNavBarRightLinkClick}/>
        //             <div className="proposals-project-availability-wrapper">
        //                 <h2>{strings.title}</h2>
        //                 <div className="proposals-project-availability-frame-wrapper">
        //                     <Frame
        //                         onClickHandler={this.onClickAvailabilityHandler}>
        //                         <div className={'rounded-icon-wrapper'}>
        //                             <RoundedIcon
        //                                 icon={'calendar'}
        //                                 size={'small'}
        //                                 color={'#2B3857'}
        //                                 background={'#FFFFFF'}
        //                                 border={'1px solid #F0F1FA'}/>
        //                         </div>
        //                         <div className="text-wrapper">
        //                             <div className="title small">{strings.availabilityTitle}</div>
        //                             {availability ? (
        //                                 <div className="resume small">
        //                                     {availability.dynamic.map((day, index) =>
        //                                         <div key={index}>
        //                                             {dailyWeekdayOptions[day.weekday]}
        //                                             ,
        //                                             {day.range.map((range, rangeIndex) =>
        //                                                 <span key={rangeIndex}> {day.range.length === rangeIndex + 1 ? strings.and + ' ' + stringRanges[range] : stringRanges[range]}</span>
        //                                             )}
        //                                         </div>
        //                                     )}
        //
        //                                     {availability.static.map((day, index) =>
        //                                         <div key={index}>
        //                                             {strings.from} {day.days.start} {strings.to} {day.days.end}
        //                                             ,
        //                                             {day.range.map((range, rangeIndex) =>
        //                                                 <span key={rangeIndex}> {day.range.length === rangeIndex + 1 ? strings.and + ' ' + stringRanges[range] : stringRanges[range]}</span>
        //                                             )}
        //                                         </div>
        //                                     )}
        //                                 </div>
        //                             ) : (
        //                                 <div className="resume small">{strings.availabilityDescription}</div>
        //                             )}
        //                         </div>
        //                     </Frame>
        //                 </div>
        //                 <Frame>
        //                     <div className={'rounded-icon-wrapper'}>
        //                         <RoundedIcon
        //                             icon={'users'}
        //                             size={'small'}
        //                             color={'#2B3857'}
        //                             background={'#FFFFFF'}
        //                             border={'1px solid #F0F1FA'}/>
        //                     </div>
        //                     <div className="text-participants-wrapper">
        //                         <div className="title small">{strings.participantsTitle}</div>
        //                     </div>
        //                     <div className={'participants-number'}>
        //                         <RoundedIcon
        //                             disabled={disableSubstract}
        //                             color={disableSubstract ? this.getHexadecimalColor() : '#FFFFFF'}
        //                             background={disableSubstract ? '#FFFFFF' : this.getHexadecimalColor()}
        //                             icon={'minus'} size={'small'}
        //                             border={'1px solid #F0F1FA'}
        //                             onClickHandler={this.onClickProjectParticipantsSubstractHandler}/>
        //                         <div className={'participants-number-text'}>{CreatingProposalStore.proposal.fields.participantLimit}</div>
        //                         <RoundedIcon
        //                             background={this.getHexadecimalColor()}
        //                             icon={'plus'}
        //                             size={'small'}
        //                             onClickHandler={this.onClickProjectParticipantsPlusHandler}/>
        //                     </div>
        //                 </Frame>
        //             </div>
        //         </div>
        //         <StepsBar
        //             color={this.getProposalColor()}
        //             totalSteps={5}
        //             currentStep={3}
        //             continueText={strings.stepsBarContinueText}
        //             cantContinueText={strings.stepsBarCantContinueText}
        //             canContinue={canContinue}
        //             onClickHandler={this.handleStepsBarClick}/>
        //     </div>
        // );
    }
}

ProposalPreviewPage.defaultProps = {
    strings: {
        publishProposal         : 'Publish proposal',
        project        : 'Project',
        sectors        : 'Sectors',
        skills         : 'Habilities',
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
        withinRadioOf  : 'within radio of'
    }
};