import PropTypes from 'prop-types';
import React, { Component } from 'react';
import translate from '../i18n/Translate';
import TopNavBar from '../components/TopNavBar/TopNavBar.js';
import '../../scss/pages/proposals-project-basic.scss';
import Overlay from "../components/ui/Overlay/Overlay";
import Button from "../components/ui/Button/Button";
import InputSelectText from "../components/RegisterFields/InputSelectText/InputSelectText";
import StepsBar from "../components/ui/StepsBar/StepsBar";
import Input from "../components/ui/Input/Input";
import Textarea from "../components/ui/Textarea/Textarea";
import {linkTo} from "@storybook/addon-links";
import {action} from "@storybook/addon-actions";
import {mergeCreatingProposal} from "../actions/ProposalActionCreators";
import CreatingProposalStore from '../stores/CreatingProposalStore';
import * as ProposalActionCreators from "../actions/ProposalActionCreators";


@translate('ProposalsProjectBasicPage')
export default class ProposalsProjectBasicPage extends Component {

    static propTypes = {
        // Injected by @translate:
        strings  : PropTypes.object,
        canContinue : PropTypes.bool,
    };

    static contextTypes = {
        router: PropTypes.object.isRequired
    };

    constructor(props) {
        super(props);
        this.state = {
            title   : '',
            resume  : '',
        };

        this.handleTitleChange = this.handleTitleChange.bind(this);
        this.handleResumeChange = this.handleResumeChange.bind(this);
        this.handleStepsBar = this.handleStepsBar.bind(this);
        this.topNavBarRightLinkClick = this.topNavBarRightLinkClick.bind(this);
        this.topNavBarLeftLinkClick = this.topNavBarLeftLinkClick.bind(this);
    }

    handleTitleChange(event) {
        this.setState({title: event});
    }

    handleResumeChange(event) {
        this.setState({resume: event});
    }

    handleStepsBar(event) {
        const proposal = {
            title: this.state.title,
            description: this.state.resume,
        };
        ProposalActionCreators.mergeCreatingProposal(proposal);
        this.context.router.push('/proposals-project-professional');
    }

    topNavBarRightLinkClick() {
        this.context.router.push('/proposals');
    }

    topNavBarLeftLinkClick() {
        this.context.router.push('/proposals-project-introduction');
    }

    render() {
        const {strings} = this.props;
        const canContinue = this.state.title !== "" && this.state.resume !== "";

        return (
            <div className="views">
                <div className="view view-main proposals-project-basic-view">
                    <TopNavBar background={'transparent'} iconLeft={'arrow-left'} firstIconRight={'x'} textCenter={strings.publishProposal} textSize={'small'} onLeftLinkClickHandler={this.topNavBarLeftLinkClick} onRightLinkClickHandler={this.topNavBarRightLinkClick}/>
                    <div className="proposals-project-basic-wrapper">
                        <h2>{strings.title}</h2>
                        <div className={'image-wrapper'}>
                            <img src={'http://via.placeholder.com/480x240'}/>
                        </div>
                        <Input size={'small'} placeholder={strings.titlePlaceholder} defaultValue={this.state.title} onChange={this.handleTitleChange}/>
                        <Textarea defaultValue={this.state.resume} onChange={this.handleResumeChange} placeholder={strings.resumePlaceholder}/>
                    </div>
                </div>
                <StepsBar color={'blue'} totalSteps={5} currentStep={0} continueText={strings.stepsBarContinueText} cantContinueText={strings.stepsBarCantContinueText} canContinue={canContinue} onClickHandler={this.handleStepsBar}/>
            </div>
        );
    }

}

ProposalsProjectBasicPage.defaultProps = {
    strings: {
        publishProposal: 'Publish proposal',
        title: 'What is your project proposal?',
        titlePlaceholder: 'Propose title',
        resumePlaceholder: 'Explain how you want to carry it out...',
        stepsBarContinueText: 'Continue',
        stepsBarCantContinueText: 'You cannot continue',
    }
};