import PropTypes from 'prop-types';
import React, { Component } from 'react';
import translate from '../../../i18n/Translate';
import TopNavBar from '../../../components/ui/TopNavBar';
import '../../../../scss/pages/proposals/project/availability.scss';
import StepsBar from "../../../components/ui/StepsBar";
import connectToStores from "../../../utils/connectToStores";
import * as ProposalActionCreators from "../../../actions/ProposalActionCreators";
import Frame from "../../../components/ui/Frame/";
import RoundedIcon from "../../../components/ui/RoundedIcon";
import CreatingProposalStore from "../../../stores/CreatingProposalStore";
import ProposalIcon from "./PreviewPage";
import AvailabilityPreview from "../../../components/ui/AvailabilityPreview";

function getState() {
    const availability = CreatingProposalStore.availability;

    return {
        availability,
    };
}

@translate('ProposalsProjectAvailabilityPage')
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
        this.onClickProjectParticipantsSubstractHandler = this.onClickProjectParticipantsSubstractHandler.bind(this);
        this.onClickProjectParticipantsPlusHandler = this.onClickProjectParticipantsPlusHandler.bind(this);
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
        this.context.router.push('/proposals-project-profession');
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
        this.context.router.push('/proposals-project-availability-dates');
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
    }

    handleStepsBarClick() {
        const proposal = {
            participantLimit : this.state.participantLimit,
        };
        ProposalActionCreators.mergeCreatingProposal(proposal);
        this.context.router.push('/proposals-project-features');
    }

    render() {
        const {strings, availability} = this.props;
        const canContinue = (!(availability.dynamic.length === 0 && availability.static.length === 0));
        const participantLimit = this.state.participantLimit;
        const disableSubstract = this.state.disableSubstract;

        return (
            <div className="views">
                <div className="view view-main proposals-project-availability-view">
                    <TopNavBar
                        background={'transparent'}
                        leftIcon={'arrow-left'}
                        rightIcon={'x'}
                        centerText={strings.publishProposal}
                        textSize={'small'}
                        onLeftLinkClickHandler={this.topNavBarLeftLinkClick}
                        onRightLinkClickHandler={this.topNavBarRightLinkClick}/>
                    <div className="proposals-project-availability-wrapper">
                        <h2>{strings.title}</h2>
                        <div className="proposals-project-availability-frame-wrapper">
                            <Frame
                                onClickHandler={this.onClickAvailabilityHandler}>
                                <AvailabilityPreview availability={availability}/>
                            </Frame>
                        </div>
                        <Frame>
                            <div className={'rounded-icon-wrapper'}>
                                <ProposalIcon size={'medium-small'} icon={'participants'} background={'white'}/>
                            </div>
                            <div className="text-participants-wrapper">
                                <div className="title small">{strings.participantsTitle}</div>
                            </div>
                            <div className={'participants-number'}>
                                <RoundedIcon
                                    disabled={disableSubstract}
                                    color={disableSubstract?'#818fa1':'#FFFFFF'}
                                    background={disableSubstract?'#FFFFFF':'#63CAFF'}
                                    icon={'minus'} size={'small'}
                                    border={'1px solid #F0F1FA'}
                                    onClickHandler={this.onClickProjectParticipantsSubstractHandler}/>
                                <div className={'participants-number-text'}>{participantLimit}</div>
                                <RoundedIcon
                                    background={'#63CAFF'}
                                    icon={'plus'}
                                    size={'small'}
                                    onClickHandler={this.onClickProjectParticipantsPlusHandler}/>
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
                    onClickHandler={this.handleStepsBarClick}/>
            </div>
        );
    }
}

AvailabilityPage.defaultProps = {
    strings: {
        publishProposal          : 'Publish proposal',
        title                    : 'What implication do you need for the project?',
        availabilityTitle        : 'Availability',
        availabilityDescription  : 'Indicate in what time or range of days you would like to develop the project',
        participantsTitle        : 'Number of participants',
        stepsBarContinueText     : 'Continue',
        stepsBarCantContinueText : 'Indicate at least one parameter',
    }
};
