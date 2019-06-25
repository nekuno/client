import PropTypes from 'prop-types';
import React, { Component } from 'react';
import translate from '../../../i18n/Translate';
import TopNavBar from '../../../components/ui/TopNavBar';
import '../../../../scss/pages/proposals/experience/type.scss';
import InputSelectText from "../../../components/RegisterFields/InputSelectText/InputSelectText";
import StepsBar from "../../../components/ui/StepsBar";
import connectToStores from "../../../utils/connectToStores";
import * as ProposalActionCreators from "../../../actions/ProposalActionCreators";
import TagSuggestionsStore from "../../../stores/TagSuggestionsStore";
import * as TagSuggestionsActionCreators from "../../../actions/TagSuggestionsActionCreators";
import InputTag from "../../../components/RegisterFields/InputTag/InputTag";
import CreatingProposalStore from "../../../stores/CreatingProposalStore";
import InputSelectImage from "../../../components/RegisterFields/InputSelectImage";
import {action} from "@storybook/addon-actions";
import LoginActionCreators from "../../../actions/LoginActionCreators";
import * as UserActionCreators from "../../../actions/UserActionCreators";
import ProfileStore from "../../../stores/ProfileStore";


function requestData(props) {
    if (!props.metadata) {
        UserActionCreators.requestMetadata();
    }
}

function getState() {
    const metadata = ProfileStore.getMetadata();
    let typeOptions = null;

    switch (CreatingProposalStore.proposal.type) {
        case 'shows':
            typeOptions = metadata && metadata.shows ? metadata.shows.choices : [];
            break;
        case 'restaurants':
            typeOptions = metadata && metadata.restaurants ? metadata.restaurants.choices : [];
            break;
        case 'plans':
            typeOptions = metadata && metadata.plans ? metadata.plans.choices : [];
            break;
        default:
            break;
    }

    return {
        typeOptions
    };
}

@translate('ProposalsLeisureTypePage')
@connectToStores([ProfileStore], getState)
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
            type : [],
        };

        this.topNavBarLeftLinkClick = this.topNavBarLeftLinkClick.bind(this);
        this.topNavBarRightLinkClick = this.topNavBarRightLinkClick.bind(this);
        // this.handleInputTagClick = this.handleInputTagClick.bind(this);
        // this.handleInputTagChange = this.handleInputTagChange.bind(this);
        this.onChange = this.onChange.bind(this);
        this.handleStepsBarClick = this.handleStepsBarClick.bind(this);
    }

    componentDidMount() {
        // if (!this.props.username) {
        //     this.context.router.push('/answer-username');
        // }
        requestData(this.props);
    }

    topNavBarLeftLinkClick() {
        this.context.router.push('/proposals-experience-basic');
    }

    topNavBarRightLinkClick() {
        ProposalActionCreators.cleanCreatingProposal();
        this.context.router.push('/proposals');
    }

    // handleInputTagClick(tags) {
    //     resetTagSuggestions();
    //
    //     this.setState({
    //         type: tags,
    //     });
    // }
    //
    // handleInputTagChange(text) {
    //     if (text) {
    //         if (CreatingProposalStore.proposal.type) {
    //             TagSuggestionsActionCreators.requestProfileTagSuggestions(text, CreatingProposalStore.proposal.type);
    //         }
    //     } else {
    //         resetTagSuggestions();
    //     }
    // }

    onChange(typeOptions) {
        const {profile} = this.props;
        this.setState({
            type: typeOptions,
        });

        LoginActionCreators.preRegisterProfile({...profile, ...{restaurants: typeOptions}});
    }

    handleStepsBarClick() {
        const proposal = {
            typeValues : this.state.type,
        };
        ProposalActionCreators.mergeCreatingProposal(proposal);
        this.context.router.push('/proposals-experience-availability');
    }

    render() {
        const {strings, typeOptions} = this.props;
        const canContinue = this.state.type.length >= 1;

        return (
            <div className="views">
                <div className="view view-main proposals-experience-type-view">
                    <TopNavBar
                        background={'transparent'}
                        iconLeft={'arrow-left'}
                        firstIconRight={'x'}
                        textCenter={strings.publishProposal}
                        textSize={'small'}
                        onLeftLinkClickHandler={this.topNavBarLeftLinkClick}
                        onRightLinkClickHandler={this.topNavBarRightLinkClick}/>
                    <div className="proposals-experience-type-wrapper">
                        <h2>{strings.title}</h2>
                        <InputSelectImage
                            options={typeOptions}
                            placeholder={strings.placeholder}
                            onClickHandler={this.onChange}
                        />
                    </div>
                </div>
                <StepsBar
                    color={'green'}
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
        publishProposal          : 'Publish proposal',
        title                    : 'Select what your proposal is about',
        placeholder              : 'Search',
        selectedLabel            : 'Selected values',
        stepsBarContinueText     : 'Continue',
        stepsBarCantContinueText : 'Choose one to continue',
    }
};