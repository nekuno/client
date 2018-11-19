import PropTypes from 'prop-types';
import React, { Component } from 'react';
import translate from '../../../i18n/Translate';
import TopNavBar from '../../../components/TopNavBar/TopNavBar.js';
import '../../../../scss/pages/proposals/leisure/type.scss';
import InputSelectText from "../../../components/RegisterFields/InputSelectText/InputSelectText";
import StepsBar from "../../../components/ui/StepsBar/StepsBar";
import connectToStores from "../../../utils/connectToStores";
import * as ProposalActionCreators from "../../../actions/ProposalActionCreators";
import TagSuggestionsStore from "../../../stores/TagSuggestionsStore";
import * as TagSuggestionsActionCreators from "../../../actions/TagSuggestionsActionCreators";
import InputTag from "../../../components/RegisterFields/InputTag/InputTag";
import CreatingProposalStore from "../../../stores/CreatingProposalStore";

function resetTagSuggestions() {
    TagSuggestionsActionCreators.resetTagSuggestions();
}

function getState() {
    const tags = TagSuggestionsStore.tags || [];
    const typeOptions = tags.map(tag => tag.name);

    return {
        typeOptions : typeOptions
    };
}

@translate('ProposalsLeisureTypePage')
@connectToStores([TagSuggestionsStore], getState)
export default class TypePage extends Component {

    static propTypes = {
        // Injected by @translate:
        strings     : PropTypes.object,
        // Injected by @connectToStores:
        typeOptions : PropTypes.array,
        canContinue : PropTypes.bool,
    };

    static contextTypes = {
        router : PropTypes.object.isRequired
    };

    constructor(props) {
        super(props);
        this.state = {
            leisureType : [],
        };

        this.topNavBarLeftLinkClick = this.topNavBarLeftLinkClick.bind(this);
        this.topNavBarRightLinkClick = this.topNavBarRightLinkClick.bind(this);
        this.handleInputTagClick = this.handleInputTagClick.bind(this);
        this.handleInputTagChange = this.handleInputTagChange.bind(this);
        this.handleStepsBarClick = this.handleStepsBarClick.bind(this);
    }

    componentWillMount() {
        resetTagSuggestions(); // TODO: Not shows the selected values
    }

    topNavBarLeftLinkClick() {
        this.context.router.push('/proposals-leisure-basic');
    }

    topNavBarRightLinkClick() {
        this.context.router.push('/proposals');
    }
    handleInputTagClick(tags) {
        resetTagSuggestions();

        this.setState({
            leisureType: tags,
        });
    }

    handleInputTagChange(text) {
        console.log(CreatingProposalStore.proposal.fields.leisureType);
        if (text) {
            if (CreatingProposalStore.proposal.fields.leisureType) {
                TagSuggestionsActionCreators.requestProfileTagSuggestions(text, CreatingProposalStore.proposal.fields.leisureType);
            }
        } else {
            resetTagSuggestions();
        }
    }

    handleStepsBarClick() {
        const proposal = {
            leisureType : this.state.leisureType,
        };
        ProposalActionCreators.mergeCreatingProposal(proposal);
        this.context.router.push('/proposals-leisure-availability');
    }

    render() {
        const {strings, typeOptions} = this.props;
        const canContinue = this.state.leisureType.length >= 1;

        return (
            <div className="views">
                <div className="view view-main proposals-leisure-type-view">
                    <TopNavBar
                        background={'transparent'}
                        iconLeft={'arrow-left'}
                        firstIconRight={'x'}
                        textCenter={strings.publishProposal}
                        textSize={'small'}
                        onLeftLinkClickHandler={this.topNavBarLeftLinkClick}
                        onRightLinkClickHandler={this.topNavBarRightLinkClick}/>
                    <div className="proposals-leisure-type-wrapper">
                        <h2>{strings.title}</h2>
                        <InputTag
                            tags={typeOptions}
                            placeholder={strings.placeholder}
                            searchIcon={true}
                            size={'small'}
                            chipsColor={'blue'}
                            onChangeHandler={this.handleInputTagChange}
                            onClickHandler={this.handleInputTagClick}
                            selectedLabel={strings.selectedLabel}/>
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

TypePage.defaultProps = {
    strings: {
        title                    : 'Select what your proposal is about',
        placeholder              : 'Search',
        selectedLabel            : 'Selected values',
        stepsBarContinueText     : 'Continue',
        stepsBarCantContinueText : 'Choose one to continue',
    }
};