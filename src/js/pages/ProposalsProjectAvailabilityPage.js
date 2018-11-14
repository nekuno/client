import PropTypes from 'prop-types';
import React, { Component } from 'react';
import translate from '../i18n/Translate';
import TopNavBar from '../components/TopNavBar/TopNavBar.js';
import '../../scss/pages/proposals-project-availability.scss';
import InputSelectText from "../components/RegisterFields/InputSelectText/InputSelectText";
import StepsBar from "../components/ui/StepsBar/StepsBar";
import ProfileStore from "../stores/ProfileStore";
import connectToStores from "../utils/connectToStores";
import * as ProposalActionCreators from "../actions/ProposalActionCreators";
import InputTag from "../components/RegisterFields/InputTag/InputTag";
import TagSuggestionsStore from "../stores/TagSuggestionsStore";
import * as TagSuggestionsActionCreators from "../actions/TagSuggestionsActionCreators";
import Frame from "../components/ui/Frame/Frame";
import RoundedIcon from "../components/ui/RoundedIcon/RoundedIcon";
import Chip from "../components/ui/Chip/Chip";
import AvailabilityEdit from "../components/Availability/AvailabilityEdit/AvailabilityEdit";
import CreatingProposalStore from "../stores/CreatingProposalStore";
import LocaleStore from "../stores/LocaleStore";
import styles from "../components/ui/RoundedIcon/RoundedIcon.scss";

function getState() {
    const proposal = CreatingProposalStore.proposal;
    const availability = proposal.availability ? proposal.availability : null;

    return {
        availability,
    };
}

@translate('ProposalsProjectAvailabilityPage')
@connectToStores([CreatingProposalStore], getState)
export default class ProposalsProjectAvailabilityPage extends Component {

    static propTypes = {
        // Injected by @translate:
        strings     : PropTypes.object,
        // Injected by @connectToStores:
        availability: PropTypes.object,
        canContinue : PropTypes.bool,
    };

    static contextTypes = {
        router: PropTypes.object.isRequired
    };

    constructor(props) {
        super(props);
        this.state = {
            projectMembers: 1,
            disableSubstract: true,
        };



        this.handleStepsBar = this.handleStepsBar.bind(this);
        this.topNavBarLeftLinkClick = this.topNavBarLeftLinkClick.bind(this);
        this.topNavBarRightLinkClick = this.topNavBarRightLinkClick.bind(this);

        this.onClickAvailabilityHandler = this.onClickAvailabilityHandler.bind(this);

        this.onClickProjectMembersPlusHandler = this.onClickProjectMembersPlusHandler.bind(this);
        this.onClickProjectMembersSubstractHandler = this.onClickProjectMembersSubstractHandler.bind(this);
    }

    componentWillMount() {
        if (CreatingProposalStore.proposal.projectMembers) {
            this.setState({
                projectMembers: CreatingProposalStore.proposal.projectMembers,
            });
        }
    }

    handleStepsBar() {
        const proposal = {
            projectMembers: this.state.projectMembers,
        };
        ProposalActionCreators.mergeCreatingProposal(proposal);
        this.context.router.push('/proposals-project-features');
    }

    topNavBarLeftLinkClick() {
        this.context.router.push('/proposals-project-skills');
    }

    topNavBarRightLinkClick() {
        this.context.router.push('/proposals');
    }

    onClickAvailabilityHandler() {
        const proposal = {
            projectMembers: this.state.projectMembers,
        };
        ProposalActionCreators.mergeCreatingProposal(proposal);
        this.context.router.push('/proposals-project-availability-dates');
    }

    onClickProjectMembersPlusHandler() {
        const newProjectMembers = this.state.projectMembers + 1;
        this.setState({
            projectMembers: newProjectMembers,
        });

        if (newProjectMembers > 1) {
            this.setState({
                disableSubstract: false,
            });
        }
    }

    onClickProjectMembersSubstractHandler() {
        const newProjectMembers = this.state.projectMembers - 1;
        this.setState({
            projectMembers: newProjectMembers,
        });

        if (newProjectMembers < 2) {
            this.setState({
                disableSubstract: true,
            });
        }
    }

    render() {
        const {strings, availability} = this.props;
        const canContinue = availability !== null;
        const projectMembers = this.state.projectMembers;
        const disableSubstract = this.state.disableSubstract;

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
            morning  : strings.morning,
            afternoon: strings.afternoon,
            night    : strings.night,
        };

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
                            <Frame onClickHandler={this.onClickAvailabilityHandler}>

                                <div className={'rounded-icon-wrapper'}>
                                    <RoundedIcon
                                        icon={'calendar'}
                                        size={'small'}
                                        color={'#2B3857'}
                                        background={'#FBFCFD'}
                                        border={'1px solid #F0F1FA'}/>
                                </div>

                                <div className="text-wrapper">

                                    <div className="title small">{strings.availabilityTitle}</div>


                                    {availability ? (
                                        <div className="resume small">
                                            {availability.dynamic.map((day, index) =>
                                                <div key={day.weekday}>
                                                    {dailyWeekdayOptions[day.weekday]}
                                                    , {strings.scheduleOf}
                                                    {day.range.map((range, rangeIndex) =>
                                                        <span key={rangeIndex}> {day.range.length === rangeIndex + 1 ? strings.and + ' ' + stringRanges[range] : stringRanges[range]}</span>
                                                    )}
                                                </div>
                                            )}

                                            {availability.static.map((day, index) =>
                                                <div key={index}>
                                                    {strings.from} {day.days.start} {strings.to} {day.days.end}
                                                    , {strings.scheduleOf}
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
                                    background={'#FBFCFD'}
                                    border={'1px solid #F0F1FA'}/>
                            </div>
                            <div className="text-participants-wrapper">
                                <div className="title small">{strings.participantsTitle}</div>
                            </div>
                            <div className={'participants-number'}>
                                <RoundedIcon disabled={disableSubstract} color={disableSubstract?'#818fa1':'#FFFFFF'} background={disableSubstract?'#FFFFFF':'#63CAFF'} icon={'minus'} size={'small'} border={'1px solid #F0F1FA'} onClickHandler={this.onClickProjectMembersSubstractHandler}/>
                                <div className={'participants-number-text'}>{projectMembers}</div>
                                <RoundedIcon background={'#63CAFF'} icon={'plus'} size={'small'} onClickHandler={this.onClickProjectMembersPlusHandler}/>
                            </div>
                        </Frame>


                    </div>
                </div>
                <StepsBar
                    color={'blue'}
                    totalSteps={5}
                    currentStep={3}
                    continueText={strings.stepsBarContinueText}
                    cantContinueText={strings.stepsBarCantContinueText}
                    canContinue={canContinue}
                    onClickHandler={this.handleStepsBar}/>
            </div>
        );
    }
}

ProposalsProjectAvailabilityPage.defaultProps = {
    strings: {
        publishProposal         : 'Publish proposal',
        title                   : 'What implication do you need for the project?',
        availabilityTitle       : 'Availability',
        availabilityDescription : 'Indicate in what time or range of days you would like to develop the project',
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
        scheduleOf              : 'schedule of',
        morning                 : 'morning',
        afternoon               : 'afternoon',
        night                   : 'night',
        from                    : 'From',
        to                      : 'to',
    }
};
