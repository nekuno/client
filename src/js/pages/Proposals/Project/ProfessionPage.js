import PropTypes from 'prop-types';
import React, { Component } from 'react';
import translate from '../../../i18n/Translate';
import TopNavBar from '../../../components/TopNavBar/TopNavBar.js';
import '../../../../scss/pages/proposals-project-profession.scss';
import StepsBar from "../../../components/ui/StepsBar/StepsBar";
import connectToStores from "../../../utils/connectToStores";
import * as ProposalActionCreators from "../../../actions/ProposalActionCreators";
import InputTag from "../../../components/RegisterFields/InputTag/InputTag";
import TagSuggestionsStore from "../../../stores/TagSuggestionsStore";
import * as TagSuggestionsActionCreators from "../../../actions/TagSuggestionsActionCreators";

function resetTagSuggestions() {
    TagSuggestionsActionCreators.resetTagSuggestions();
}

function getState() {
    const tags = TagSuggestionsStore.tags || [];
    const choices = tags.map(tag => tag.name);

    return {
        choices
    };
}

@translate('ProposalsProjectProfessionPage')
@connectToStores([TagSuggestionsStore], getState)
export default class ProfessionPage extends Component {

    static propTypes = {
        // Injected by @translate:
        strings     : PropTypes.object,
        // Injected by @connectToStores:
        choices     : PropTypes.array,
        canContinue : PropTypes.bool,
    };

    static contextTypes = {
        router : PropTypes.object.isRequired
    };

    constructor(props) {
        super(props);
        this.state = {
            profession : [],
        };

        this.topNavBarLeftLinkClick = this.topNavBarLeftLinkClick.bind(this);
        this.topNavBarRightLinkClick = this.topNavBarRightLinkClick.bind(this);
        this.onChangeInputTagHandler = this.onChangeInputTagHandler.bind(this);
        this.onClickInputTagHandler = this.onClickInputTagHandler.bind(this);
        this.handleStepsBarClick = this.handleStepsBarClick.bind(this);
    }

    topNavBarLeftLinkClick() {
        this.context.router.push('/proposals-project-industry');
    }

    topNavBarRightLinkClick() {
        this.context.router.push('/proposals');
    }

    onChangeInputTagHandler(event) {
        if (event) {
            TagSuggestionsActionCreators.requestProfileTagSuggestions(event, 'profession');
        } else {
            resetTagSuggestions();
        }
    }

    onClickInputTagHandler(event) {
        resetTagSuggestions();

        this.setState({
            profession: event,
        });
    }

    handleStepsBarClick() {
        const proposal = {
            profession: this.state.profession,
        };
        ProposalActionCreators.mergeCreatingProposal(proposal);
        this.context.router.push('/proposals-project-availability');
    }

    render() {
        const {strings, choices} = this.props;
        const canContinue = this.state.profession.length > 0;

        return (
            <div className="views">
                <div className="view view-main proposals-project-profession-view">
                    <TopNavBar
                        background={'transparent'}
                        iconLeft={'arrow-left'}
                        firstIconRight={'x'}
                        textCenter={strings.publishProposal}
                        textSize={'small'}
                        onLeftLinkClickHandler={this.topNavBarLeftLinkClick}
                        onRightLinkClickHandler={this.topNavBarRightLinkClick}/>
                    <div className="proposals-project-profession-wrapper">
                        <h2>{strings.title}</h2>
                        <InputTag
                            tags={choices}
                            placeholder={strings.placeholder}
                            searchIcon={true}
                            size={'small'}
                            chipsColor={'blue'}
                            onChangeHandler={this.onChangeInputTagHandler}
                            onClickHandler={this.onClickInputTagHandler}
                            selectedLabel={strings.selectedLabel}/>
                    </div>
                </div>
                <StepsBar
                    color={'blue'}
                    totalSteps={5}
                    currentStep={2}
                    continueText={strings.stepsBarContinueText}
                    cantContinueText={strings.stepsBarCantContinueText}
                    canContinue={canContinue}
                    onClickHandler={this.handleStepsBarClick}/>
            </div>
        );
    }
}

ProfessionPage.defaultProps = {
    strings: {
        title                    : 'What skills would you like for the project?',
        placeholder              : 'Search hability',
        selectedLabel            : 'Habilities you want',
        stepsBarContinueText     : 'Continue',
        stepsBarCantContinueText : 'Indicate one to continue',
    }
};