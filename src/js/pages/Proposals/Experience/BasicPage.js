import PropTypes from 'prop-types';
import React, { Component } from 'react';
import translate from '../../../i18n/Translate';
import TopNavBar from '../../../components/TopNavBar/TopNavBar.js';
import '../../../../scss/pages/proposals/experience/basic.scss';
import StepsBar from "../../../components/ui/StepsBar/StepsBar";
import Input from "../../../components/ui/Input/Input";
import Textarea from "../../../components/ui/Textarea/Textarea";
import CreatingProposalStore from '../../../stores/CreatingProposalStore';
import * as ProposalActionCreators from "../../../actions/ProposalActionCreators";
import SelectInline from "../../../components/ui/SelectInline/SelectInline";

@translate('ProposalsExperienceBasicPage')
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
            type        : '',
            title       : '',
            description : '',
        };

        this.topNavBarLeftLinkClick = this.topNavBarLeftLinkClick.bind(this);
        this.topNavBarRightLinkClick = this.topNavBarRightLinkClick.bind(this);
        this.handleTitleChange = this.handleTitleChange.bind(this);
        this.handleDescriptionChange = this.handleDescriptionChange.bind(this);
        this.handleSelectInlineClick = this.handleSelectInlineClick.bind(this);
        this.handleStepsBarClick = this.handleStepsBarClick.bind(this);
    }

    componentWillMount() {
        if (CreatingProposalStore.proposal.fields) {
            if (CreatingProposalStore.proposal.type) {
                this.setState({
                    type : CreatingProposalStore.proposal.type,
                });
            }
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
        this.context.router.push('/proposals-experience-introduction');
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

    handleSelectInlineClick(event) {
        this.setState({type : event});
    }

    handleStepsBarClick() {
        const proposal = {
            type : this.state.type,
            fields : {
                title       : this.state.title,
                description : this.state.description,
            }
        };
        ProposalActionCreators.mergeCreatingProposal(proposal);
        this.context.router.push('/proposals-experience-type');
    }

    render() {
        const {strings} = this.props;
        const canContinue = this.state.title !== "" && this.state.description !== "" && this.state.type !== "";

        const TypeChoices = [
            {
                id: "events",
                text: strings.events
            },
            {
                id: "gourmet",
                text: strings.gourmet
            },
            {
                id: "plan",
                text: strings.plan
            }
        ];
        return (
            <div className="views">
                <div className="view view-main proposals-experience-basic-view">
                    <TopNavBar
                        background={'transparent'}
                        iconLeft={'arrow-left'}
                        firstIconRight={'x'}
                        textCenter={strings.publishProposal}
                        textSize={'small'}
                        onLeftLinkClickHandler={this.topNavBarLeftLinkClick}
                        onRightLinkClickHandler={this.topNavBarRightLinkClick}/>
                    <div className="proposals-experience-basic-wrapper">
                        <h2>{strings.title}</h2>
                        <SelectInline
                            onClickHandler={this.handleSelectInlineClick}
                            color={'green'}
                            options={TypeChoices}
                            defaultOption={this.state.type[0]}/>
                        <div className={'image-wrapper'}>
                            <img src={'http://via.placeholder.com/480x240'}/>
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
                    color={'green'}
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
        title                    : 'What is your proposal?',
        events                   : 'Events',
        gourmet                  : 'Gourmet',
        plan                     : 'Plan',
        titlePlaceholder         : 'Propose title',
        descriptionPlaceholder   : 'Explain how you want to carry it out...',
        stepsBarContinueText     : 'Continue',
        stepsBarCantContinueText : 'You cannot continue',
    }
};