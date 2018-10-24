import PropTypes from 'prop-types';
import React, { Component } from 'react';
import translate from '../i18n/Translate';
import TopNavBar from '../components/TopNavBar/TopNavBar.js';
import '../../scss/pages/proposals-project-professional.scss';
import InputSelectText from "../components/RegisterFields/InputSelectText/InputSelectText";
import StepsBar from "../components/ui/StepsBar/StepsBar";
import ProfileStore from "../stores/ProfileStore";
import connectToStores from "../utils/connectToStores";
import * as ProposalActionCreators from "../actions/ProposalActionCreators";

function getState() {
    const metadata = ProfileStore.getMetadata();
    const choices = metadata && metadata.industry ? metadata.industry.choices : [];

    return {
        choices
    };
}

@translate('ProposalsProjectProfessionalPage')
@connectToStores([ProfileStore], getState)
export default class ProposalsProjectProfessionalPage extends Component {

    static propTypes = {
        // Injected by @translate:
        strings  : PropTypes.object,
        // Injected by @connectToStores:
        choices          : PropTypes.array,
        canContinue : PropTypes.bool,
    };

    static contextTypes = {
        router: PropTypes.object.isRequired
    };

    constructor(props) {
        super(props);
        this.state = {
            professionalSector   : [],
        };

        this.handleStepsBar = this.handleStepsBar.bind(this);
        this.topNavBarLeftLinkClick = this.topNavBarLeftLinkClick.bind(this);
        this.topNavBarRightLinkClick = this.topNavBarRightLinkClick.bind(this);
        this.onClickInputSelectTextHandler = this.onClickInputSelectTextHandler.bind(this);
    }

    handleStepsBar(event) {
        const proposal = {
            professionalSector: this.state.professionalSector,
        };
        ProposalActionCreators.mergeCreatingProposal(proposal);
        this.context.router.push('/proposals-project-habilities');
    }

    topNavBarLeftLinkClick() {
        this.context.router.push('/proposals-project-basic');
    }

    topNavBarRightLinkClick() {
        this.context.router.push('/proposals');
    }

    onClickInputSelectTextHandler(event) {
        this.setState({
            professionalSector: event,
        });
    }

    render() {
        const {strings, choices} = this.props;
        const canContinue = this.state.professionalSector.length >= 1;
        console.log(this.state.professionalSector);

        return (
            <div className="views">
                <div className="view view-main proposals-project-professional-view">
                    <TopNavBar
                        background={'transparent'}
                        iconLeft={'arrow-left'}
                        firstIconRight={'x'}
                        textCenter={strings.publishProposal}
                        textSize={'small'}
                        onLeftLinkClickHandler={this.topNavBarLeftLinkClick}
                        onRightLinkClickHandler={this.topNavBarRightLinkClick}/>
                    <div className="proposals-project-professional-wrapper">
                        <h2>{strings.title}</h2>
                        <InputSelectText
                            chipsColor={'blue'}
                            options={choices}
                            selectedLabel={strings.selectedLabel}
                            placeholder={strings.placeholder}
                            onClickHandler={this.onClickInputSelectTextHandler}/>
                    </div>
                </div>
                <StepsBar
                    color={'blue'}
                    totalSteps={5}
                    currentStep={1}
                    continueText={strings.stepsBarContinueText}
                    cantContinueText={strings.stepsBarCantContinueText}
                    canContinue={canContinue}
                    onClickHandler={this.handleStepsBar}/>
            </div>
        );
    }
}

ProposalsProjectProfessionalPage.defaultProps = {
    strings: {
        title: 'What sector skills would you want for the project?',
        placeholder: 'Search professional sector',
        selectedLabel: 'Sectors you want',
        stepsBarContinueText: 'Continue',
        stepsBarCantContinueText: 'Choose one to continue',
    }
};