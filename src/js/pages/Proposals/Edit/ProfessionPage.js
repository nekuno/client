import PropTypes from 'prop-types';
import React, { Component } from 'react';
import translate from '../../../i18n/Translate';
import AuthenticatedComponent from "../../../components/AuthenticatedComponent";
import connectToStores from "../../../utils/connectToStores";
import TopNavBar from '../../../components/ui/TopNavBar';
import StepsBar from "../../../components/ui/StepsBar";
import CreatingProposalStore from '../../../stores/CreatingProposalStore';
import * as ProposalActionCreators from "../../../actions/ProposalActionCreators";
import ProposalStore from "../../../stores/ProposalStore";
import '../../../../scss/pages/proposals/edit/type-page.scss';
import InputTag from "../../../components/RegisterFields/InputTag";
import * as TagSuggestionsActionCreators from "../../../actions/TagSuggestionsActionCreators";
import TagSuggestionsStore from "../../../stores/TagSuggestionsStore";


function resetTagSuggestions() {
    TagSuggestionsActionCreators.resetTagSuggestions();
}

/**
 * Retrieves state from stores for current props.
 */
function getState(props) {
    const proposalId = props.params.proposalId;


    const tags = TagSuggestionsStore.tags || [];
    const professionChoices = tags.map(tag => tag.name);

    const proposal = CreatingProposalStore.proposal;




    // let proposal;
    // if (proposalId) {
    //     proposal = ProposalStore.getOwnProposal(proposalId);
    //     if (proposal) {
    //         CreatingProposalStore.proposal.fields.profession = proposal.fields.profession;
    //     }
    // } else {
    //
    //     // CreatingProposalStore.proposal.fields.profession = [];
    // }


    return {
        proposal,
        professionChoices
    };
}

@AuthenticatedComponent
@translate('ProposalProfessionEditPage')
@connectToStores([ProposalStore, CreatingProposalStore, TagSuggestionsStore], getState)
export default class ProposalProfessionEditPage extends Component {

    static propTypes = {
        params           : PropTypes.shape({
            proposalId: PropTypes.string
        }).isRequired,
        // Injected by @AuthenticatedComponent
        user        : PropTypes.object.isRequired,
        // Injected by @translate:
        strings     : PropTypes.object,
        // Injected by @connectToStores:
        proposal    : PropTypes.object,
        professionChoices : PropTypes.array,
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

    // componentWillMount() {
    // if (CreatingProposalStore.proposal.industry !== undefined) { // TODO: Not shows the selected industries
    //     this.setState({
    //         industry : CreatingProposalStore.proposal.industry,
    //     });
    // }
    // }

    topNavBarLeftLinkClick() {
        this.context.router.goBack();
    }

    topNavBarRightLinkClick() {
        ProposalActionCreators.cleanCreatingProposal();
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

        CreatingProposalStore.proposal.fields.profession = event;
    }

    handleStepsBarClick() {
        const {params} = this.props;


        // const proposal = {
        //     fields: CreatingProposalStore.proposal.fields,
        //     type: CreatingProposalStore.proposal.type
        // };

        ProposalActionCreators.mergeCreatingProposal(CreatingProposalStore.proposal);

        // ProposalActionCreators.mergeCreatingProposal(proposal);

        if (params.proposalId) {
            this.context.router.push('/proposal-availability-edit/' + params.proposalId);
        } else {
            this.context.router.push('/proposal-availability-edit/');
        }
    }

    getProposalColor() {
        let color;

        if (CreatingProposalStore.proposal.selectedType) {
            switch (CreatingProposalStore.proposal.selectedType) {
                case 'leisure':
                    color = 'pink';
                    break;
                case 'experience':
                    color = 'green';
                    break;
                default:
                    color = 'blue';
                    break;
            }
        } else {
            switch (CreatingProposalStore.proposal.type) {
                case 'sports':
                case 'hobbies':
                case 'games':
                    color = 'pink';
                    break;
                case 'shows':
                case 'restaurants':
                case 'plans':
                    color = 'green';
                    break;
                default:
                    color = 'blue';
                    break;
            }
        }

        return color;
    }

    render() {
        const {strings, proposal, professionChoices} = this.props;
        const canContinue = !!CreatingProposalStore.proposal.fields.profession;

        return (
            CreatingProposalStore.proposal && proposal ?
                <div className="views">
                    <div className="view view-main proposal-type-edit">
                        <TopNavBar
                            background={'transparent'}
                            leftIcon={'arrow-left'}
                            rightIcon={'x'}
                            centerText={CreatingProposalStore.proposal.id ? strings.editProposal : strings.publishProposal}
                            textSize={'small'}
                            onLeftLinkClickHandler={this.topNavBarLeftLinkClick}
                            onRightLinkClickHandler={this.topNavBarRightLinkClick}/>
                        <div className="proposal-wrapper">
                            <h2>{strings.title}</h2>
                            {professionChoices ?
                                <InputTag
                                    tags={professionChoices}
                                    placeholder={strings.placeholder}
                                    searchIcon={true}
                                    size={'small'}
                                    chipsColor={'blue'}
                                    onChangeHandler={this.onChangeInputTagHandler}
                                    onClickHandler={this.onClickInputTagHandler}
                                    selected={proposal.fields.profession}
                                    selectedLabel={strings.selectedItems}/>
                                :
                                null
                            }
                        </div>
                    </div>
                    <StepsBar
                        color={this.getProposalColor()}
                        totalSteps={5}
                        currentStep={1}
                        continueText={strings.stepsBarContinueText}
                        cantContinueText={strings.stepsBarCantContinueText}
                        canContinue={canContinue}
                        onClickHandler={this.handleStepsBarClick}/>
                </div>
                :
                null
        );
    }
}

ProposalProfessionEditPage.defaultProps = {
    strings: {
        publishProposal          : 'Publish proposal',
        editProposal             : 'Edit proposal',
        title                    : 'What skills would you like for the project?',
        placeholder              : 'Search skill',
        selectedItems            : 'Skills you want',
        stepsBarCantContinueText : 'You cannot continue',
        stepsBarContinueText     : 'Continue',
    }
};