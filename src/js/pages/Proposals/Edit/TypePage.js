import PropTypes from 'prop-types';
import React, { Component } from 'react';
import translate from '../../../i18n/Translate';
import AuthenticatedComponent from "../../../components/AuthenticatedComponent";
import connectToStores from "../../../utils/connectToStores";
import TopNavBar from '../../../components/TopNavBar/TopNavBar.js';
import StepsBar from "../../../components/ui/StepsBar/StepsBar";
import CreatingProposalStore from '../../../stores/CreatingProposalStore';
import * as ProposalActionCreators from "../../../actions/ProposalActionCreators";
import ProposalStore from "../../../stores/ProposalStore";
import '../../../../scss/pages/proposals/edit/type-page.scss';
import InputSelectText from "../../../components/RegisterFields/InputSelectText/InputSelectText";
import ProfileStore from "../../../stores/ProfileStore";
import InputTag from "../../../components/RegisterFields/InputTag/InputTag";
import * as TagSuggestionsActionCreators from "../../../actions/TagSuggestionsActionCreators";
import TagSuggestionsStore from "../../../stores/TagSuggestionsStore";
import InputSelectImage from "../../../components/RegisterFields/InputSelectImage/InputSelectImage";



function resetTagSuggestions() {
    TagSuggestionsActionCreators.resetTagSuggestions();
}

/**
 * Requests data from server (or store) for current props.
 */
function requestData(props) {
    ProposalActionCreators.requestOwnProposals();
}

/**
 * Retrieves state from stores for current props.
 */
function getState(props) {
    const proposalId = props.params.proposalId;

    const proposal = CreatingProposalStore.proposal;

    const metadata = ProfileStore.getMetadata();
    const industryOptions = metadata && metadata.industry ? metadata.industry.choices : [];
    const leisureOptions = TagSuggestionsStore.tags.map(tag => tag.name);
    let experienceOptions = null;

    switch (CreatingProposalStore.proposal.type) {
        case 'shows':
            experienceOptions = metadata && metadata.shows ? metadata.shows.choices : [];
            break;
        case 'restaurants':
            experienceOptions = metadata && metadata.restaurants ? metadata.restaurants.choices : [];
            break;
        case 'plans':
            experienceOptions = metadata && metadata.plans ? metadata.plans.choices : [];
            break;
        default:
            break;
    }


    return {
        proposal,
        industryOptions,
        leisureOptions,
        experienceOptions,
    };
}

@AuthenticatedComponent
@translate('ProposalTypeEditPage')
@connectToStores([ProposalStore, ProfileStore, TagSuggestionsStore], getState)
export default class ProposalTypeEditPage extends Component {

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
        industryOptions : PropTypes.array,
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


        this.handleInputTagClick = this.handleInputTagClick.bind(this);
        this.handleInputTagChange = this.handleInputTagChange.bind(this);
        this.onClickInputSelectTextHandler = this.onClickInputSelectTextHandler.bind(this);
        this.handleStepsBarClick = this.handleStepsBarClick.bind(this);
    }

    componentDidMount() {
        requestData(this.props);
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


    onClickInputSelectTextHandler(event) {
        this.setState({
            type : event,
        });
        CreatingProposalStore.proposal.fields.industry = event;
    }

    handleInputTagClick(event) {
        resetTagSuggestions();

        this.setState({
            type: event,
        });

        switch (CreatingProposalStore.proposal.type) {
            case 'sports':
                CreatingProposalStore.proposal.fields.sports = event;
                break;
            case 'hobbies':
                CreatingProposalStore.proposal.fields.hobbies = event;
                break;
            case 'games':
                CreatingProposalStore.proposal.fields.games = event;
            default:
                break;
        }
    }

    handleInputTagChange(event) {
        if (event) {
            if (CreatingProposalStore.proposal.type) {
                TagSuggestionsActionCreators.requestProfileTagSuggestions(event, CreatingProposalStore.proposal.type);
            }
        } else {
            resetTagSuggestions();
        }
    }

    onChange(event) {

        // this.setState({
        //     type: event,
        // });

        switch (CreatingProposalStore.proposal.type) {
            case 'shows':
                CreatingProposalStore.proposal.fields.shows = event;
                break;
            case 'restaurants':
                CreatingProposalStore.proposal.fields.restaurants = event;
                break;
            case 'plans':
                CreatingProposalStore.proposal.fields.plans = event;
            default:
                break;
        }

        //LoginActionCreators.preRegisterProfile({...profile, ...{restaurants: event}});
    }

    handleStepsBarClick() {
        const {params} = this.props;

        ProposalActionCreators.mergeCreatingProposal(CreatingProposalStore.proposal);

        if (CreatingProposalStore.proposal.type === 'work') {
            if (params.proposalId) {
                this.context.router.push('/proposal-profession-edit/' + params.proposalId);
            } else {
                this.context.router.push('/proposal-profession-edit/');
            }
        } else {
            if (params.proposalId) {
                this.context.router.push('/proposal-availability-edit/' + params.proposalId);
            } else {
                this.context.router.push('/proposal-availability-edit/');
            }
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



    renderTypeInput() {
        const {strings, proposal, industryOptions, leisureOptions, experienceOptions} = this.props;

        let component;
        switch (CreatingProposalStore.proposal.type) {
            case 'sports':
                component = <InputTag
                    tags={leisureOptions}
                    placeholder={strings.inputPlaceholder}
                    searchIcon={true}
                    size={'small'}
                    chipsColor={'pink'}
                    onChangeHandler={this.handleInputTagChange}
                    onClickHandler={this.handleInputTagClick}
                    selectedLabel={strings.selectedItems}
                    selected={proposal.fields.sports}/>;
                break;
            case 'hobbies':
                component = <InputTag
                    tags={leisureOptions}
                    placeholder={strings.inputPlaceholder}
                    searchIcon={true}
                    size={'small'}
                    chipsColor={'pink'}
                    onChangeHandler={this.handleInputTagChange}
                    onClickHandler={this.handleInputTagClick}
                    selectedLabel={strings.selectedItems}
                    selected={proposal.fields.hobbies}/>;
                break;
            case 'games':
                component = <InputTag
                    tags={leisureOptions}
                    placeholder={strings.inputPlaceholder}
                    searchIcon={true}
                    size={'small'}
                    chipsColor={'pink'}
                    onChangeHandler={this.handleInputTagChange}
                    onClickHandler={this.handleInputTagClick}
                    selectedLabel={strings.selectedItems}
                    selected={proposal.fields.games}/>;
                break;
            case 'shows':
            case 'restaurants':
            case 'plans':
                component = <InputSelectImage
                    options={experienceOptions}
                    placeholder={strings.inputPlaceholder}
                    onClickHandler={this.onChange}/>;
                break;
            default:
                component = <InputSelectText
                    chipsColor={'blue'}
                    options={industryOptions}
                    selectedLabel={strings.selectedItems}
                    placeholder={strings.inputPlaceholder}
                    onClickHandler={this.onClickInputSelectTextHandler}
                    selectedValues={proposal.fields.industry}/>;
                break;
        }

        return component;
    }

    render() {
        const {strings, proposal} = this.props;
        const canContinue =
            CreatingProposalStore.proposal.fields.title !== "" &&
            CreatingProposalStore.proposal.fields.description !== "" &&
            CreatingProposalStore.proposal.type !== "";


        return (
            CreatingProposalStore.proposal && proposal ?
                <div className="views">
                    <div className="view view-main proposal-type-edit">
                        <TopNavBar
                            background={'transparent'}
                            iconLeft={'arrow-left'}
                            firstIconRight={'x'}
                            textCenter={CreatingProposalStore.proposal.id ? strings.editProposal : strings.publishProposal}
                            textSize={'small'}
                            onLeftLinkClickHandler={this.topNavBarLeftLinkClick}
                            onRightLinkClickHandler={this.topNavBarRightLinkClick}/>
                        <div className="proposal-wrapper">
                            <h2>{strings.title}</h2>
                            {this.renderTypeInput()}
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

ProposalTypeEditPage.defaultProps = {
    strings: {
        publishProposal          : 'Publish proposal',
        editProposal             : 'Edit proposal',
        title                    : 'What is your proposal?',
        inputPlaceholder         : 'Search professional sector',
        selectedItems            : 'Selected items',
        stepsBarCantContinueText : 'You cannot continue',
        stepsBarContinueText     : 'Continue',
    }
};