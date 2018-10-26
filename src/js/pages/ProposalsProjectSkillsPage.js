import PropTypes from 'prop-types';
import React, { Component } from 'react';
import translate from '../i18n/Translate';
import TopNavBar from '../components/TopNavBar/TopNavBar.js';
import '../../scss/pages/proposals-project-skills.scss';
import InputSelectText from "../components/RegisterFields/InputSelectText/InputSelectText";
import StepsBar from "../components/ui/StepsBar/StepsBar";
import ProfileStore from "../stores/ProfileStore";
import connectToStores from "../utils/connectToStores";
import * as ProposalActionCreators from "../actions/ProposalActionCreators";
import InputTag from "../components/RegisterFields/InputTag/InputTag";
import TagSuggestionsStore from "../stores/TagSuggestionsStore";
import * as TagSuggestionsActionCreators from "../actions/TagSuggestionsActionCreators";

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

@translate('ProposalsProjectSkillsPage')
@connectToStores([TagSuggestionsStore], getState)
export default class ProposalsProjectSkillsPage extends Component {

    static propTypes = {
        // Injected by @translate:
        strings     : PropTypes.object,
        // Injected by @connectToStores:
        choices     : PropTypes.array,
        canContinue : PropTypes.bool,
    };

    static contextTypes = {
        router: PropTypes.object.isRequired
    };

    constructor(props) {
        super(props);
        this.state = {
            skills   : [],
        };

        this.handleStepsBar = this.handleStepsBar.bind(this);
        this.topNavBarLeftLinkClick = this.topNavBarLeftLinkClick.bind(this);
        this.topNavBarRightLinkClick = this.topNavBarRightLinkClick.bind(this);
        this.onClickInputTagHandler = this.onClickInputTagHandler.bind(this);
        this.onChangeInputTagHandler = this.onChangeInputTagHandler.bind(this);
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

    onClickInputTagHandler(event) {
        resetTagSuggestions();

        this.setState({
            skills: event,
        });
    }

    onChangeInputTagHandler(event) {
        if (event) {
            TagSuggestionsActionCreators.requestProfileTagSuggestions(event, 'profession');
        } else {
            resetTagSuggestions();
        }
    }

    render() {
        const {strings, choices} = this.props;
        const canContinue = this.state.skills.length > 0;

        return (
            <div className="views">
                <div className="view view-main proposals-project-skills-view">
                    <TopNavBar
                        background={'transparent'}
                        iconLeft={'arrow-left'}
                        firstIconRight={'x'}
                        textCenter={strings.publishProposal}
                        textSize={'small'}
                        onLeftLinkClickHandler={this.topNavBarLeftLinkClick}
                        onRightLinkClickHandler={this.topNavBarRightLinkClick}/>
                    <div className="proposals-project-skills-wrapper">
                        <h2>{strings.title}</h2>
                        <InputTag tags={choices}
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
                    onClickHandler={this.handleStepsBar}/>
            </div>
        );
    }
}

ProposalsProjectSkillsPage.defaultProps = {
    strings: {
        title: 'What skills would you like for the project?',
        placeholder: 'Search hability',
        selectedLabel: 'Habilities youu want',
        stepsBarContinueText: 'Continue',
        stepsBarCantContinueText: 'Indicate one to continue',
    }
};