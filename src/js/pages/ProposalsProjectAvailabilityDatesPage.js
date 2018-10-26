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


@translate('ProposalsProjectAvailabilityPage')
export default class ProposalsProjectAvailabilityPage extends Component {

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

        this.onClickProjectMembersPlusHandler = this.onClickProjectMembersPlusHandler.bind(this);
        this.onClickProjectMembersSubstractHandler = this.onClickProjectMembersSubstractHandler.bind(this);
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
        const {strings} = this.props;
        const canContinue = true;
        const projectMembers = this.state.projectMembers;
        const disableSubstract = this.state.disableSubstract;

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
                        <Frame>
                            <div className="steam-icon">
                                <RoundedIcon icon={'calendar'} size={'small'}/>
                            </div>
                            <div className="text-wrapper">
                                <div className="title small">{strings.availabilityTitle}</div>
                                <div className="resume small">{strings.availabilityDescription}</div>
                                <AvailabilityEdit/>
                            </div>
                        </Frame>

                        <Frame>
                            <div className="steam-icon">
                                <RoundedIcon icon={'people'} size={'small'}/>
                            </div>
                            <div className="text-wrapper">
                                <div className="title small">{strings.participantsTitle}</div>
                                <RoundedIcon disabled={disableSubstract} background={'#63CAFF'} icon={'minus'} size={'small'} onClickHandler={this.onClickProjectMembersSubstractHandler}/>
                                <span>{projectMembers}</span>
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
    }
};