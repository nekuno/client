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


@translate('ProposalsProjectAvailabilityDatesPage')
export default class ProposalsProjectAvailabilityDatesPage extends Component {

    static propTypes = {
        // Injected by @translate:
        strings     : PropTypes.object,
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

    }

    handleStepsBar() {
        const proposal = {
            skills: this.state.skills,
        };
        ProposalActionCreators.mergeCreatingProposal(proposal);
        this.context.router.push('/proposals-project-availability');
    }

    topNavBarLeftLinkClick() {
        this.context.router.push('/proposals-project-basic');
    }

    topNavBarRightLinkClick() {
        this.context.router.push('/proposals');
    }

    render() {
        const {strings} = this.props;
        const canContinue = true;
        const projectMembers = this.state.projectMembers;
        const disableSubstract = this.state.disableSubstract;

        return (
            <div className="views">
                <div className="view view-main proposals-project-availability-dates-view">
                    <TopNavBar
                        background={'transparent'}
                        iconLeft={'arrow-left'}
                        firstIconRight={'x'}
                        textCenter={strings.publishProposal}
                        textSize={'small'}
                        onLeftLinkClickHandler={this.topNavBarLeftLinkClick}
                        onRightLinkClickHandler={this.topNavBarRightLinkClick}/>
                    <div className="proposals-project-availability-dates-wrapper">
                        <AvailabilityEdit/>
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

ProposalsProjectAvailabilityDatesPage.defaultProps = {
    strings: {
        publishProposal         : 'Publish proposal',
        title                   : 'What implication do you need for the project?',
        availabilityTitle       : 'Availability',
        availabilityDescription : 'Indicate in what time or range of days you would like to develop the project',
        participantsTitle       : 'Number of participants',
        stepsBarContinueText    : 'Continue',
        stepsBarCantContinueText: 'Indicate at least one parameter',
    }
};