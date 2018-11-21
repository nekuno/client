import PropTypes from 'prop-types';
import React, { Component } from 'react';
import translate from '../../../i18n/Translate';
import TopNavBar from '../../../components/TopNavBar/TopNavBar.js';
import '../../../../scss/pages/proposals/project/industry.scss';
import InputSelectText from "../../../components/RegisterFields/InputSelectText/InputSelectText";
import StepsBar from "../../../components/ui/StepsBar/StepsBar";
import ProfileStore from "../../../stores/ProfileStore";
import connectToStores from "../../../utils/connectToStores";
import * as ProposalActionCreators from "../../../actions/ProposalActionCreators";
import CreatingProposalStore from "../../../stores/CreatingProposalStore";
import TagSuggestionsStore from "../../../stores/TagSuggestionsStore";

function getState() {
    const metadata = ProfileStore.getMetadata();
    const industryOptions = metadata && metadata.industry ? metadata.industry.choices : [];

    return {
        industryOptions : industryOptions
    };
}

@translate('ProposalsProjectIndustryPage')
@connectToStores([ProfileStore, TagSuggestionsStore], getState)
export default class IndustryPage extends Component {

    static propTypes = {
        // Injected by @translate:
        strings         : PropTypes.object,
        // Injected by @connectToStores:
        industryOptions : PropTypes.array,
        canContinue     : PropTypes.bool,
    };

    static contextTypes = {
        router : PropTypes.object.isRequired
    };

    constructor(props) {
        super(props);
        this.state = {
            industry : [],
        };

        this.topNavBarLeftLinkClick = this.topNavBarLeftLinkClick.bind(this);
        this.topNavBarRightLinkClick = this.topNavBarRightLinkClick.bind(this);
        this.onClickInputSelectTextHandler = this.onClickInputSelectTextHandler.bind(this);
        this.handleStepsBarClick = this.handleStepsBarClick.bind(this);
    }

    componentWillMount() {
        // if (CreatingProposalStore.proposal.industry !== undefined) { // TODO: Not shows the selected industries
        //     this.setState({
        //         industry : CreatingProposalStore.proposal.industry,
        //     });
        // }
    }

    topNavBarLeftLinkClick() {
        this.context.router.push('/proposals-project-basic');
    }

    topNavBarRightLinkClick() {
        this.context.router.push('/proposals');
    }

    onClickInputSelectTextHandler(event) {
        this.setState({
            industry : event,
        });
    }

    handleStepsBarClick() {
        const proposal = {
            industry : this.state.industry,
        };
        ProposalActionCreators.mergeCreatingProposal(proposal);
        this.context.router.push('/proposals-project-profession');
    }

    render() {
        const {strings, industryOptions} = this.props;
        const canContinue = this.state.industry.length >= 1;

        return (
            <div className="views">
                <div className="view view-main proposals-project-industry-view">
                    <TopNavBar
                        background={'transparent'}
                        iconLeft={'arrow-left'}
                        firstIconRight={'x'}
                        textCenter={strings.publishProposal}
                        textSize={'small'}
                        onLeftLinkClickHandler={this.topNavBarLeftLinkClick}
                        onRightLinkClickHandler={this.topNavBarRightLinkClick}/>
                    <div className="proposals-project-industry-wrapper">
                        <h2>{strings.title}</h2>
                        <InputSelectText
                            chipsColor={'blue'}
                            options={industryOptions}
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
                    onClickHandler={this.handleStepsBarClick}/>
            </div>
        );
    }
}

IndustryPage.defaultProps = {
    strings: {
        title                    : 'What sector skills would you want for the project?',
        placeholder              : 'Search professional sector',
        selectedLabel            : 'Sectors you want',
        stepsBarContinueText     : 'Continue',
        stepsBarCantContinueText : 'Choose one to continue',
    }
};