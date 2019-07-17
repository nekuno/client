import PropTypes from 'prop-types';
import React, { Component } from 'react';
import translate from '../../../i18n/Translate';
import AuthenticatedComponent from "../../../components/AuthenticatedComponent";
import connectToStores from "../../../utils/connectToStores";
import TopNavBar from '../../../components/ui/TopNavBar';
import StepsBar from "../../../components/ui/StepsBar";
import Input from "../../../components/ui/Input/";
import Textarea from "../../../components/ui/Textarea";
import CreatingProposalStore from '../../../stores/CreatingProposalStore';
import * as ProposalActionCreators from "../../../actions/ProposalActionCreators";
import SelectInline from "../../../components/ui/SelectInline";
import ProposalStore from "../../../stores/ProposalStore";
import '../../../../scss/pages/proposals/edit/basic-page.scss';

/**
 * Requests data from server (or store) for current props.
 */
function requestData() {
    ProposalActionCreators.requestOwnProposals();
}

/**
 * Retrieves state from stores for current props.
 */
function getState(props) {
    const proposalId = props.params.proposalId;
    let proposal;
    if (proposalId) {
        proposal = ProposalStore.getOwnProposal(proposalId);
        if (proposal) {
            CreatingProposalStore.proposal.id = proposal.id;
            CreatingProposalStore.proposal.type = proposal.type;
            CreatingProposalStore.proposal.filters = proposal.filters;
            CreatingProposalStore.proposal.fields = proposal.fields;
        }
    } else {
        proposal = {};
        if (!CreatingProposalStore.proposal.fields.title)
            CreatingProposalStore.proposal.fields.title = "";
        if (!CreatingProposalStore.proposal.fields.description)
            CreatingProposalStore.proposal.fields.description = "";
        if (!CreatingProposalStore.proposal.filters)
            CreatingProposalStore.proposal.filters = {};
        if (!CreatingProposalStore.proposal.type)
            CreatingProposalStore.proposal.type = "";
    }

    return {
        proposal,
    };
}

@AuthenticatedComponent
@translate('ProposalBasicEditPage')
@connectToStores([ProposalStore, CreatingProposalStore], getState)
export default class ProposalBasicEditPage extends Component {

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

    componentDidMount() {
        requestData(this.props);
    }

    // componentWillMount() {
    //     if (CreatingProposalStore.proposal.fields) {
    //         if (CreatingProposalStore.proposal.type) {
    //             this.setState({
    //                 type : CreatingProposalStore.proposal.type,
    //             });
    //         }
    //         if (CreatingProposalStore.proposal.fields.title) {
    //             this.setState({
    //                 title : CreatingProposalStore.proposal.fields.title,
    //             });
    //         }
    //         if (CreatingProposalStore.proposal.fields.description) {
    //             this.setState({
    //                 description : CreatingProposalStore.proposal.fields.description,
    //             });
    //         }
    //     }
    // }

    topNavBarLeftLinkClick() {
        ProposalActionCreators.cleanCreatingProposal();
        this.context.router.goBack();
    }

    topNavBarRightLinkClick() {
        ProposalActionCreators.cleanCreatingProposal();
        this.context.router.push('/proposals');
    }

    handleTitleChange(event) {
        this.setState({title : event});
        CreatingProposalStore.proposal.fields.title = event;
    }

    handleDescriptionChange(event) {
        this.setState({description : event});
        CreatingProposalStore.proposal.fields.description = event;
    }

    handleSelectInlineClick(event) {
        this.setState({event: event[0]});
        CreatingProposalStore.proposal.type = event[0];
    }

    handleStepsBarClick() {
        const {params} = this.props;

        ProposalActionCreators.mergeCreatingProposal(CreatingProposalStore.proposal);

        if (params.proposalId) {
            this.context.router.push('/proposal-type-edit/' + params.proposalId);
        } else {
            this.context.router.push('/proposal-type-edit/');
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

    renderSelectInline() {
        const {strings} = this.props;
        let component;

        const leisureOptions = [
            {
                id: "sports",
                text: strings.sports
            },
            {
                id: "hobbies",
                text: strings.hobbies
            },
            {
                id: "games",
                text: strings.games
            }
        ];

        const experienceOptions = [
            {
                id: "shows",
                text: strings.shows
            },
            {
                id: "restaurants",
                text: strings.restaurants
            },
            {
                id: "plans",
                text: strings.plans
            }
        ];

        if (CreatingProposalStore.proposal.selectedType) {
            switch (CreatingProposalStore.proposal.selectedType) {
                case 'leisure':
                    component = <SelectInline
                        color={'pink'}
                        options={leisureOptions}
                        defaultOption={CreatingProposalStore.proposal.type}
                        onClickHandler={this.handleSelectInlineClick}/>;
                    break;
                case 'experience':
                    component = <SelectInline
                        color={'green'}
                        options={experienceOptions}
                        defaultOption={CreatingProposalStore.proposal.type}
                        onClickHandler={this.handleSelectInlineClick}/>;
                    break;
                default:
                    component = null;
                    break;
            }
        } else {
            switch (CreatingProposalStore.proposal.type) {
                case 'sports':
                case 'hobbies':
                case 'games':
                    component = <SelectInline
                        color={'pink'}
                        options={leisureOptions}
                        defaultOption={CreatingProposalStore.proposal.type}
                        onClickHandler={this.handleSelectInlineClick}/>;
                    break;
                case 'shows':
                case 'restaurants':
                case 'plans':
                    component = <SelectInline
                        color={'green'}
                        options={experienceOptions}
                        defaultOption={CreatingProposalStore.proposal.type}
                        onClickHandler={this.handleSelectInlineClick}/>;
                    break;
                default:
                    component = null;
                    break;
            }
        }

        return component;
    }

    render() {
        const {strings} = this.props;
        const canContinue =
            CreatingProposalStore.proposal.fields.title !== "" &&
            CreatingProposalStore.proposal.fields.description !== "" &&
            CreatingProposalStore.proposal.type !== "";

        return (
            CreatingProposalStore.proposal ?
                <div className='views'>
                    <TopNavBar
                        background={'transparent'}
                        leftIcon={'arrow-left'}
                        rightIcon={'x'}
                        centerText={CreatingProposalStore.proposal.id ? strings.editProposal : strings.publishProposal}
                        textSize={'small'}
                        onLeftLinkClickHandler={this.topNavBarLeftLinkClick}
                        onRightLinkClickHandler={this.topNavBarRightLinkClick}/>
                    <div className="view view-main proposal-basic-edit">
                        <div className="proposal-wrapper">
                            <h2>{strings.title}</h2>
                            <div>
                                {this.renderSelectInline()}
                                <div className={'image-wrapper'}>
                                    <img src={'../../../../img/default-upload-image.png'}/>
                                </div>
                                <Input
                                    size={'small'}
                                    placeholder={strings.titlePlaceholder}
                                    defaultValue={CreatingProposalStore.proposal.fields.title}
                                    onChange={this.handleTitleChange}/>
                                <Textarea
                                defaultValue={CreatingProposalStore.proposal.fields.description}
                                placeholder={strings.descriptionPlaceholder}
                                onChange={this.handleDescriptionChange}/>
                            </div>
                        </div>
                    </div>
                    <StepsBar
                        color={this.getProposalColor()}
                        totalSteps={5}
                        currentStep={0}
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

ProposalBasicEditPage.defaultProps = {
    strings: {
        publishProposal          : 'Publish proposal',
        editProposal             : 'Edit proposal',
        title                    : 'What is your proposal?',
        titlePlaceholder         : 'Propose title',
        descriptionPlaceholder   : 'Explain how you want to carry it out...',
        shows                    : 'Events',
        restaurants              : 'Gourmet',
        plans                    : 'Plans',
        sports                   : 'Sports',
        hobbies                  : 'Hobbys',
        games                    : 'Games',
        stepsBarCantContinueText : 'You cannot continue',
        stepsBarContinueText     : 'Continue',
    }
};