import PropTypes from 'prop-types';
import React, { Component } from 'react';
import translate from '../../../i18n/Translate';
import TopNavBar from '../../../components/TopNavBar/TopNavBar.js';
import '../../../../scss/pages/proposals/experience/availability.scss';
import StepsBar from "../../../components/ui/StepsBar/StepsBar";
import connectToStores from "../../../utils/connectToStores";
import * as ProposalActionCreators from "../../../actions/ProposalActionCreators";
import Frame from "../../../components/ui/Frame/Frame";
import RoundedIcon from "../../../components/ui/RoundedIcon/RoundedIcon";
import CreatingProposalStore from "../../../stores/CreatingProposalStore";

function getState() {
    const availability = CreatingProposalStore.availability;

    return {
        availability,
    };
}

@translate('ProposalsLeisureAvailabilityPage')
@connectToStores([CreatingProposalStore], getState)
export default class AvailabilityPage extends Component {

    static propTypes = {
        // Injected by @translate:
        strings      : PropTypes.object,
        // Injected by @connectToStores:
        availability : PropTypes.object,
        canContinue  : PropTypes.bool,
    };

    static contextTypes = {
        router : PropTypes.object.isRequired
    };

    constructor(props) {
        super(props);
        this.state = {
            participantLimit : 1,
            disableSubstract : true,
        };

        this.topNavBarLeftLinkClick = this.topNavBarLeftLinkClick.bind(this);
        this.topNavBarRightLinkClick = this.topNavBarRightLinkClick.bind(this);
        this.onClickAvailabilityHandler = this.onClickAvailabilityHandler.bind(this);
        this.onClickParticipantsSubstractHandler = this.onClickParticipantsSubstractHandler.bind(this);
        this.onClickParticipantsPlusHandler = this.onClickParticipantsPlusHandler.bind(this);
        this.handleStepsBarClick = this.handleStepsBarClick.bind(this);
    }

    componentWillMount() {
        if (CreatingProposalStore.proposal.participantLimit) {
            this.setState({
                participantLimit : CreatingProposalStore.proposal.participantLimit,
            });
            if (CreatingProposalStore.proposal.participantLimit > 1) {
                this.setState({
                    disableSubstract : false,
                });
            }
        }
    }

    topNavBarLeftLinkClick() {
        this.context.router.push('/proposals-experience-type');
    }

    topNavBarRightLinkClick() {
        ProposalActionCreators.cleanCreatingProposal();
        this.context.router.push('/proposals');
    }

    onClickAvailabilityHandler() {
        const proposal = {
            participantLimit : this.state.participantLimit,
        };
        ProposalActionCreators.mergeCreatingProposal(proposal);
        this.context.router.push('/proposals-experience-availability-dates');
    }

    onClickParticipantsSubstractHandler() {
        const newParticipantLimit = this.state.participantLimit - 1;
        this.setState({
            participantLimit : newParticipantLimit,
        });

        if (newParticipantLimit < 2) {
            this.setState({
                disableSubstract : true,
            });
        }
    }

    onClickParticipantsPlusHandler() {
        const newParticipantLimit = this.state.participantLimit + 1;
        this.setState({
            participantLimit : newParticipantLimit,
        });

        if (newParticipantLimit > 1) {
            this.setState({
                disableSubstract : false,
            });
        }
    }

    handleStepsBarClick() {
        const proposal = {
            participantLimit : this.state.participantLimit,
        };
        ProposalActionCreators.mergeCreatingProposal(proposal);
        this.context.router.push('/proposals-experience-features');
    }

    render() {
        const {strings, availability} = this.props;
        const canContinue = (!(availability.dynamic.length === 0 && availability.static.length === 0));
        const participantLimit = this.state.participantLimit;
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

        return (
            <div className="views">
                <div className="view view-main proposals-experience-availability-view">
                    <TopNavBar
                        background={'transparent'}
                        iconLeft={'arrow-left'}
                        firstIconRight={'x'}
                        textCenter={strings.publishProposal}
                        textSize={'small'}
                        onLeftLinkClickHandler={this.topNavBarLeftLinkClick}
                        onRightLinkClickHandler={this.topNavBarRightLinkClick}/>
                    <div className="proposals-experience-availability-wrapper">
                        <h2>{strings.title}</h2>
                        <div className="proposals-experience-availability-frame-wrapper">
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
                                            {availability.static !== [] ?
                                                availability.static.map((day, index) =>
                                                <div key={index}>
                                                    {strings.from} {day.days.start} {strings.to} {day.days.end}
                                                    ,
                                                    {day.range.map((range, rangeIndex) =>
                                                        <span key={rangeIndex}> {day.range.length === rangeIndex + 1 ? strings.and + ' ' + stringRanges[range] : stringRanges[range]}</span>
                                                    )}
                                                </div>
                                                )
                                                : null}
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
                                    color={disableSubstract?'#818fa1':'#FFFFFF'}
                                    background={disableSubstract?'#FFFFFF':'#7bd47e'}
                                    icon={'minus'} size={'small'}
                                    border={'1px solid #F0F1FA'}
                                    onClickHandler={this.onClickParticipantsSubstractHandler}/>
                                <div className={'participants-number-text'}>{participantLimit}</div>
                                <RoundedIcon
                                    background={'#7bd47e'}
                                    icon={'plus'}
                                    size={'small'}
                                    onClickHandler={this.onClickParticipantsPlusHandler}/>
                            </div>
                        </Frame>
                    </div>
                </div>
                <StepsBar
                    color={'green'}
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

AvailabilityPage.defaultProps = {
    strings: {
        publishProposal         : 'Publish proposal',
        title                   : 'What availability and number of people need?',
        availabilityTitle       : 'Availability',
        availabilityDescription : 'Indicate in what time or range of days',
        participantsTitle       : 'Number of participants',
        stepsBarContinueText    : 'Continue',
        stepsBarCantContinueText: 'Indicate at least one parameter',
        monday                  : 'Monday',
        tuesday                 : 'Tuesday',
        wednesday               : 'Wednesday',
        thursday                : 'Thursday',
        friday                  : 'Friday',
        saturday                : 'Saturday',
        sunday                  : 'Sunday',
        and                     : 'and',
        morning                 : 'morning',
        afternoon               : 'afternoon',
        night                   : 'night',
        from                    : 'From',
        to                      : 'to',
    }
};
