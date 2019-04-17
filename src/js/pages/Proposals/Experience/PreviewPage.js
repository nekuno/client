import PropTypes from 'prop-types';
import React, { Component } from 'react';
import translate from '../../../i18n/Translate';
import TopNavBar from '../../../components/TopNavBar/TopNavBar.js';
import '../../../../scss/pages/proposals/experience/preview.scss';
import CreatingProposalStore from "../../../stores/CreatingProposalStore";
import connectToStores from "../../../utils/connectToStores";
import StepsBar from "../../../components/ui/StepsBar/StepsBar";
import FilterStore from "../../../stores/FilterStore";
import ProposalFilterPreview from "../../../components/ui/ProposalFilterPreview/ProposalFilterPreview";
import ProposalStore from "../../../stores/ProposalStore";
import * as ProposalActionCreators from '../../../actions/ProposalActionCreators';
import ProposalIcon from "../../../components/ui/ProposalIcon/ProposalIcon";
import AvailabilityPreview from "../../../components/ui/AvailabilityPreview/AvailabilityPreview";

function getState() {
    const proposal = CreatingProposalStore.proposal;
    const title = proposal.fields.title;
    const description = proposal.fields.description;
    const type = proposal.type;
    const typeValues = proposal.fields.typeValues;
    const availability = CreatingProposalStore.availability;
    const participantLimit = proposal.fields.participantLimit;
    const proposalFilters = proposal.filters.userFilters;

    const filters = FilterStore.filters;

    return {
        title,
        description,
        type,
        typeValues,
        availability,
        participantLimit,
        proposalFilters,
        filters,
    };
}

@translate('ProposalsLeisurePreviewPage')
@connectToStores([CreatingProposalStore, FilterStore, ProposalStore], getState)
export default class PreviewPage extends Component {

    static propTypes = {
        // Injected by @translate:
        strings               : PropTypes.object,
        canContinue           : PropTypes.bool,
        // Injected by @connectToStores:
        title                 : PropTypes.string,
        description           : PropTypes.string,
        type                  : PropTypes.string,
        typeValues            : PropTypes.array,
        availability          : PropTypes.object,
        participantLimit      : PropTypes.number,
        proposalFilters       : PropTypes.object,
        filters               : PropTypes.object,
    };

    static contextTypes = {
        router: PropTypes.object.isRequired
    };

    constructor(props) {
        super(props);

        this.handleTitleChange = this.handleTitleChange.bind(this);
        this.handleResumeChange = this.handleResumeChange.bind(this);
        this.topNavBarRightLinkClick = this.topNavBarRightLinkClick.bind(this);
        this.topNavBarLeftLinkClick = this.topNavBarLeftLinkClick.bind(this);
        this.handleStepsBarClick = this.handleStepsBarClick.bind(this);
    }

    componentWillMount() {

    }

    handleTitleChange(event) {
        this.setState({title: event});
    }

    handleResumeChange(event) {
        this.setState({resume: event});
    }

    topNavBarLeftLinkClick() {
        this.context.router.push('/proposals-experience-features');
    }

    topNavBarRightLinkClick() {
        ProposalActionCreators.cleanCreatingProposal();
        this.context.router.push('/proposals');
    }

    handleStepsBarClick() {
        const proposal = CreatingProposalStore.getFinalProposal();
        ProposalActionCreators.createProposal(proposal)
            .then(() => {
                ProposalActionCreators.cleanCreatingProposal();
                this.context.router.push('/proposals');
            }, () => {
                // TODO: Handle error
            });
    }

    render() {
        const {strings, title, description, type, typeValues, availability, participantLimit, proposalFilters} = this.props;

        return (
            <div className="views">
                <div className="view view-main proposals-experience-preview-view">
                    <TopNavBar
                        position={'absolute'}
                        background={'transparent'}
                        iconLeft={'arrow-left'}
                        firstIconRight={'icon-experiencia'}
                        textSize={'small'}
                        onLeftLinkClickHandler={this.topNavBarLeftLinkClick}
                        onRightLinkClickHandler={this.topNavBarRightLinkClick}/>
                    <div className="proposals-experience-preview-wrapper">
                        <div className={'image-wrapper'}>
                            <img src={'https://via.placeholder.com/480x240'} alt={'https://via.placeholder.com/480x240'}/>
                            <h2 className={'bottom-left'}>{title}</h2>
                        </div>
                        <div className={'content-wrapper'}>
                            <p className={'category'}>{type}</p>
                            <p>{description}</p>

                            <div className={'information-wrapper'}>
                                <div className={'rounded-icon-wrapper'}>
                                    <ProposalIcon size={'medium-small'} icon={'sectors'} background={'white'}/>
                                </div>
                                <div className={'text-wrapper'}>
                                    <div className={'title small'}>{strings.profession}</div>
                                    {typeValues.map((item, index) =>
                                        <div className={'small'} key={index}>
                                            {item}
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className={'information-wrapper'}>
                                <AvailabilityPreview availability={availability}/>
                            </div>

                            <div className={'information-wrapper'}>
                                <div className={'rounded-icon-wrapper'}>
                                    <ProposalIcon size={'medium-small'} icon={'participants'} background={'white'}/>
                                </div>
                                <div className={'text-wrapper'}>
                                    <div className={'title small'}>{strings.numberOfMembers}</div>
                                    <div className={'resume small'}>{participantLimit} {strings.people}</div>
                                </div>
                            </div>

                            <ProposalFilterPreview proposalFilters={proposalFilters}/>
                        </div>
                    </div>
                </div>
                <StepsBar
                    color={'green'}
                    canContinue={true}
                    continueText={strings.publishProposal}
                    totalSteps={0}
                    onClickHandler={this.handleStepsBarClick}/>
            </div>
        );
    }

}

PreviewPage.defaultProps = {
    strings: {
        publishProposal         : 'Publish proposal',
        project        : 'Project',
        sectors        : 'Sectors',
        skills         : 'Habilities',
        availability   : 'Availability',
        numberOfMembers: 'Number of members',
        filterText     : 'Filters to your proposal target',
        basics         : 'Basics',
        culture        : 'Culture and languages',
        drugs          : 'Drugs and other services',
        familiar       : 'Familiar aspects',
        people         : 'people',
        years          : 'years',
        withinRadioOf  : 'within radio of'
    }
};