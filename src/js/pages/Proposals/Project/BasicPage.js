import PropTypes from 'prop-types';
import React, { Component } from 'react';
import translate from '../../../i18n/Translate';
import TopNavBar from '../../../components/TopNavBar/TopNavBar.js';
import '../../../../scss/pages/proposals/project/basic.scss';
import StepsBar from "../../../components/ui/StepsBar/StepsBar";
import Input from "../../../components/ui/Input/Input";
import Textarea from "../../../components/ui/Textarea/Textarea";
import CreatingProposalStore from '../../../stores/CreatingProposalStore';
import * as ProposalActionCreators from "../../../actions/ProposalActionCreators";

@translate('ProposalsProjectBasicPage')
export default class BasicPage extends Component {

    static propTypes = {
        // Injected by @translate:
        strings     : PropTypes.object,
        canContinue : PropTypes.bool,
    };

    static contextTypes = {
        router : PropTypes.object.isRequired
    };

    constructor(props) {
        super(props);
        this.state = {
            title       : '',
            description : '',
        };

        this.topNavBarLeftLinkClick = this.topNavBarLeftLinkClick.bind(this);
        this.topNavBarRightLinkClick = this.topNavBarRightLinkClick.bind(this);
        this.handleTitleChange = this.handleTitleChange.bind(this);
        this.handleDescriptionChange = this.handleDescriptionChange.bind(this);
        this.handleStepsBarClick = this.handleStepsBarClick.bind(this);
    }

    componentWillMount() {
        if (CreatingProposalStore.proposal.fields) {
            if (CreatingProposalStore.proposal.fields.title) {
                this.setState({
                    title : CreatingProposalStore.proposal.fields.title,
                });
            }
            if (CreatingProposalStore.proposal.fields.description) {
                this.setState({
                    description : CreatingProposalStore.proposal.fields.description,
                });
            }
        }
    }

    topNavBarLeftLinkClick() {
        this.context.router.push('/proposals-project-introduction');
    }

    topNavBarRightLinkClick() {
        ProposalActionCreators.cleanCreatingProposal();
        this.context.router.push('/proposals');
    }

    handleTitleChange(event) {
        this.setState({title : event});
    }

    handleDescriptionChange(event) {
        this.setState({description : event});
    }

    handleStepsBarClick() {
        const proposal = {
            type        : 'work',
            fields : {
                title       : this.state.title,
                description : this.state.description,
            }
        };
        ProposalActionCreators.mergeCreatingProposal(proposal);
        this.context.router.push('/proposals-project-industry');
    }

    render() {
        const {strings} = this.props;
        const canContinue = this.state.title !== "" && this.state.description !== "";

        return (
            <div className="views">
                <div className="view view-main proposals-project-basic-view">
                    <TopNavBar
                        background={'transparent'}
                        iconLeft={'arrow-left'}
                        firstIconRight={'x'}
                        textCenter={strings.publishProposal}
                        textSize={'small'}
                        onLeftLinkClickHandler={this.topNavBarLeftLinkClick}
                        onRightLinkClickHandler={this.topNavBarRightLinkClick}/>
                    <div className="proposals-project-basic-wrapper">
                        <h2>{strings.title}</h2>
                        <div className={'image-wrapper'}>
                            <img src={'../../../../img/default-upload-image.png'}/>
                        </div>
                        <Input
                            size={'small'}
                            placeholder={strings.titlePlaceholder}
                            defaultValue={this.state.title}
                            onChange={this.handleTitleChange}/>
                        <Textarea
                            defaultValue={this.state.description}
                            onChange={this.handleDescriptionChange}
                            placeholder={strings.descriptionPlaceholder}/>
                    </div>
                </div>
                <StepsBar
                    color={'blue'}
                    totalSteps={5}
                    currentStep={0}
                    continueText={strings.stepsBarContinueText}
                    cantContinueText={strings.stepsBarCantContinueText}
                    canContinue={canContinue}
                    onClickHandler={this.handleStepsBarClick}/>
            </div>
        );
    }

}

BasicPage.defaultProps = {
    strings: {
        publishProposal          : 'Publish proposal',
        title                    : 'What is your project proposal?',
        titlePlaceholder         : 'Propose title',
        descriptionPlaceholder   : 'Explain how you want to carry it out...',
        stepsBarContinueText     : 'Continue',
        stepsBarCantContinueText : 'You cannot continue',
    }
};