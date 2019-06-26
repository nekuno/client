import PropTypes from 'prop-types';
import React, { Component } from 'react';
import translate from '../../../i18n/Translate';
import TopNavBar from '../../../components/ui/TopNavBar';
import '../../../../scss/pages/proposals/leisure/availability.scss';
import StepsBar from "../../../components/ui/StepsBar";
import connectToStores from "../../../utils/connectToStores";
import * as ProposalActionCreators from "../../../actions/ProposalActionCreators";
import Frame from "../../../components/ui/Frame/";
import RoundedIcon from "../../../components/ui/RoundedIcon";
import CreatingProposalStore from "../../../stores/CreatingProposalStore";
import ProposalIcon from "../Project/PreviewPage";
import AvailabilityPreview from "../../../components/ui/AvailabilityPreview";

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
        this.context.router.push('/proposals-leisure-type');
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
        this.context.router.push('/proposals-leisure-availability-dates');
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
        this.context.router.push('/proposals-leisure-features');
    }

    render() {
        const {strings, availability} = this.props;
        const canContinue = (!(availability.dynamic.length === 0 && availability.static.length === 0));
        const participantLimit = this.state.participantLimit;
        const disableSubstract = this.state.disableSubstract;

        return (
            <div className="views">
                <div className="view view-main proposals-leisure-availability-view">
                    <TopNavBar
                        background={'transparent'}
                        leftIcon={'arrow-left'}
                        rightIcon={'x'}
                        centerText={strings.publishProposal}
                        textSize={'small'}
                        onLeftLinkClickHandler={this.topNavBarLeftLinkClick}
                        onRightLinkClickHandler={this.topNavBarRightLinkClick}/>
                    <div className="proposals-leisure-availability-wrapper">
                        <h2>{strings.title}</h2>
                        <div className="proposals-leisure-availability-frame-wrapper">
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
                                    background={disableSubstract?'#FFFFFF':'#D380D3'}
                                    icon={'minus'} size={'small'}
                                    border={'1px solid #F0F1FA'}
                                    onClickHandler={this.onClickParticipantsSubstractHandler}/>
                                <div className={'participants-number-text'}>{participantLimit}</div>
                                <RoundedIcon
                                    background={'#D380D3'}
                                    icon={'plus'}
                                    size={'small'}
                                    onClickHandler={this.onClickParticipantsPlusHandler}/>
                            </div>
                        </Frame>
                    </div>
                </div>
                <StepsBar
                    color={'pink'}
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
    }
};
