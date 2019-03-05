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
import InputTag from "../../../components/RegisterFields/InputTag/InputTag";
import Frame from "../../../components/ui/Frame/Frame";
import RoundedIcon from "../../../components/ui/RoundedIcon/RoundedIcon";

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
    let proposal = CreatingProposalStore.proposal;
    proposal.fields.participantLimit = proposal.fields.participantLimit ? proposal.fields.participantLimit : 1;

    let availability = null;
    if (proposal) {
        availability = proposal.fields.availability ? proposal.fields.availability : null;
    }

    console.log(CreatingProposalStore.proposal);
    console.log(proposal);


    return {
        proposal,
        availability
    };
}

@AuthenticatedComponent
@translate('ProposalAvailabilityEditPage')
@connectToStores([ProposalStore, CreatingProposalStore], getState)
export default class ProposalAvailabilityEditPage extends Component {

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
        availability : PropTypes.object,
    };

    static contextTypes = {
        router : PropTypes.object.isRequired
    };

    constructor(props) {
        super(props);

        this.state = {
            participantLimit : props.proposal.fields.participantLimit ? props.proposal.fields.participantLimit : 1,
            disableSubstract : props.proposal.fields.participantLimit === 1,
        };

        this.topNavBarLeftLinkClick = this.topNavBarLeftLinkClick.bind(this);
        this.topNavBarRightLinkClick = this.topNavBarRightLinkClick.bind(this);
        this.onClickAvailabilityHandler = this.onClickAvailabilityHandler.bind(this);
        this.onClickProjectParticipantsSubstractHandler = this.onClickProjectParticipantsSubstractHandler.bind(this);
        this.onClickProjectParticipantsPlusHandler = this.onClickProjectParticipantsPlusHandler.bind(this);
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

    onClickAvailabilityHandler() {
        const {params} = this.props;
        console.log(CreatingProposalStore.proposal);

        //
        // const proposal = {
        //     participantLimit : CreatingProposalStore.proposal.fields.participantLimit,
        // };
        // ProposalActionCreators.mergeCreatingProposal(CreatingProposalStore.proposal);

        if (params.proposalId) {
            this.context.router.push('/proposal-availability-dates-edit/' + params.proposalId);
        } else {
            this.context.router.push('/proposal-availability-dates-edit/');
        }
    }

    onClickProjectParticipantsSubstractHandler() {
        const newParticipantLimit = this.state.participantLimit - 1;
        this.setState({
            participantLimit : newParticipantLimit,
        });

        if (newParticipantLimit < 2) {
            this.setState({
                disableSubstract : true,
            });
        }

        const proposal = {
            fields : {
                participantLimit : this.state.participantLimit,
            }
        };

        ProposalActionCreators.mergeCreatingProposal(proposal);
        // CreatingProposalStore.proposal.fields.participantLimit = newParticipantLimit;
    }

    onClickProjectParticipantsPlusHandler() {
        const newParticipantLimit = this.state.participantLimit + 1;
        this.setState({
            participantLimit : newParticipantLimit,
        });

        if (newParticipantLimit > 1) {
            this.setState({
                disableSubstract : false,
            });
        }

        const proposal = {
            fields : {
                participantLimit : this.state.participantLimit,
            }
        };

        ProposalActionCreators.mergeCreatingProposal(proposal);
        // CreatingProposalStore.proposal.fields.participantLimit = newParticipantLimit;
    }



    handleStepsBarClick() {
        const {params} = this.props;

        // CreatingProposalStore.proposal.fields.participantLimit = this.state.participantLimit;
        //
        // const proposal = {
        //     fields: CreatingProposalStore.proposal.fields,
        //     type: CreatingProposalStore.proposal.type
        // };

        // const proposal = {
        //     fields : {
        //         participantLimit : this.state.participantLimit,
        //     }
        // };
        //
        // ProposalActionCreators.mergeCreatingProposal(proposal);

        if (params.proposalId) {
            this.context.router.push('/proposal-features-edit/' + params.proposalId);
        } else {
            this.context.router.push('/proposal-features-edit/');
        }
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

    render() {
        const {strings, proposal, availability} = this.props;


        const canContinue = availability !== null;
        const disableSubstract = this.state.disableSubstract;

        const dailyWeekdayOptions = {
            monday    : strings.monday,
            tuesday   : strings.tuesday,
            wednesday : strings.wednesday,
            thursday  : strings.thursday,
            friday    : strings.friday,
            saturday  : strings.saturday,
            sunday    : strings.sunday
        };

        const stringRanges = {
            Morning   : strings.morning,
            Afternoon : strings.afternoon,
            Night     : strings.night,
        };

        console.log(CreatingProposalStore.proposal);

        return (
            <div className="views">
                <div className="view view-main proposals-project-availability-view">
                    <TopNavBar
                        background={'transparent'}
                        iconLeft={'arrow-left'}
                        firstIconRight={'x'}
                        textCenter={strings.publishProposal}
                        textSize={'small'}
                        onLeftLinkClickHandler={this.topNavBarLeftLinkClick}
                        onRightLinkClickHandler={this.topNavBarRightLinkClick}/>
                    <div className="proposals-project-availability-wrapper">
                        <h2>{strings.title}</h2>
                        <div className="proposals-project-availability-frame-wrapper">
                            <Frame
                                onClickHandler={this.onClickAvailabilityHandler}>
                                <div className={'rounded-icon-wrapper'}>
                                    <RoundedIcon
                                        icon={'calendar'}
                                        size={'small'}
                                        color={'#2B3857'}
                                        background={'#FFFFFF'}
                                        border={'1px solid #F0F1FA'}/>
                                </div>
                                <div className="text-wrapper">
                                    <div className="title small">{strings.availabilityTitle}</div>
                                    {availability ? (
                                        <div className="resume small">
                                            {availability.dynamic.map((day, index) =>
                                                <div key={index}>
                                                    {dailyWeekdayOptions[day.weekday]}
                                                    ,
                                                    {day.range.map((range, rangeIndex) =>
                                                        <span key={rangeIndex}> {day.range.length === rangeIndex + 1 ? strings.and + ' ' + stringRanges[range] : stringRanges[range]}</span>
                                                    )}
                                                </div>
                                            )}

                                            {availability.static.map((day, index) =>
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
                            </Frame>
                        </div>
                        <Frame>
                            <div className={'rounded-icon-wrapper'}>
                                <RoundedIcon
                                    icon={'users'}
                                    size={'small'}
                                    color={'#2B3857'}
                                    background={'#FFFFFF'}
                                    border={'1px solid #F0F1FA'}/>
                            </div>
                            <div className="text-participants-wrapper">
                                <div className="title small">{strings.participantsTitle}</div>
                            </div>
                            <div className={'participants-number'}>
                                <RoundedIcon
                                    disabled={disableSubstract}
                                    color={disableSubstract ? this.getHexadecimalColor() : '#FFFFFF'}
                                    background={disableSubstract ? '#FFFFFF' : this.getHexadecimalColor()}
                                    icon={'minus'} size={'small'}
                                    border={'1px solid #F0F1FA'}
                                    onClickHandler={this.onClickProjectParticipantsSubstractHandler}/>
                                <div className={'participants-number-text'}>{CreatingProposalStore.proposal.fields.participantLimit}</div>
                                <RoundedIcon
                                    background={this.getHexadecimalColor()}
                                    icon={'plus'}
                                    size={'small'}
                                    onClickHandler={this.onClickProjectParticipantsPlusHandler}/>
                            </div>
                        </Frame>
                    </div>
                </div>
                <StepsBar
                    color={this.getProposalColor()}
                    totalSteps={5}
                    currentStep={3}
                    continueText={strings.stepsBarContinueText}
                    cantContinueText={strings.stepsBarCantContinueText}
                    canContinue={canContinue}
                    onClickHandler={this.handleStepsBarClick}/>
            </div>
        );
    }
}

ProposalAvailabilityEditPage.defaultProps = {
    strings: {
        publishProposal          : 'Publish proposal',
        title                    : 'What implication do you need for the project?',
        availabilityTitle        : 'Availability',
        availabilityDescription  : 'Indicate in what time or range of days you would like to develop the project',
        participantsTitle        : 'Number of participants',
        stepsBarContinueText     : 'Continue',
        stepsBarCantContinueText : 'Indicate at least one parameter',
        monday                   : 'Monday',
        tuesday                  : 'Tuesday',
        wednesday                : 'Wednesday',
        thursday                 : 'Thursday',
        friday                   : 'Friday',
        saturday                 : 'Saturday',
        sunday                   : 'Sunday',
        and                      : 'and',
        morning                  : 'morning',
        afternoon                : 'afternoon',
        night                    : 'night',
        from                     : 'From',
        to                       : 'to',
    }
};