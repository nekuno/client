import PropTypes from 'prop-types';
import React, { Component } from 'react';
import translate from '../../../i18n/Translate';
import TopNavBar from '../../../components/ui/TopNavBar';
import '../../../../scss/pages/proposals/project/preview.scss';
import CreatingProposalStore from "../../../stores/CreatingProposalStore";
import connectToStores from "../../../utils/connectToStores";
import ProfileStore from "../../../stores/ProfileStore";
import StepsBar from "../../../components/ui/StepsBar";
import FilterStore from "../../../stores/FilterStore";
import ProposalFilterPreview from "../../../components/ui/ProposalFilterPreview/";
import ProposalStore from "../../../stores/ProposalStore";
import * as ProposalActionCreators from '../../../actions/ProposalActionCreators';
import ProposalIcon from "../../../components/ui/ProposalIcon";
import AvailabilityPreview from "../../../components/ui/AvailabilityPreview";

function getState() {
    const proposal = CreatingProposalStore.proposal || '';
    const title = proposal.fields.title;
    const description = proposal.fields.description;
    const industrySector = proposal.fields.industry;
    const profession = proposal.fields.profession;
    const availability = CreatingProposalStore.availability;
    const participantLimit = proposal.fields.participantLimit;
    const proposalFilters = proposal.filters.userFilters;

    const filters = FilterStore.filters;


    const metadata = ProfileStore.getMetadata();
    const industrySectorChoices = metadata && metadata.industry ? metadata.industry.choices : [];

    return {
        title,
        description,
        industrySector,
        profession,
        availability,
        participantLimit,
        proposalFilters,
        industrySectorChoices,
        filters,
    };
}

@translate('ProposalsProjectPreviewPage')
@connectToStores([CreatingProposalStore, FilterStore, ProposalStore], getState)
export default class PreviewPage extends Component {

    static propTypes = {
        // Injected by @translate:
        strings               : PropTypes.object,
        canContinue           : PropTypes.bool,
        // Injected by @connectToStores:
        title                 : PropTypes.string,
        description           : PropTypes.string,
        industrySector        : PropTypes.array,
        profession            : PropTypes.array,
        availability          : PropTypes.object,
        participantLimit      : PropTypes.number,
        proposalFilters       : PropTypes.object,
        industrySectorChoices : PropTypes.array,
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

    componentDidMount() {
        if (CreatingProposalStore.proposal.fields.title === '') {
            this.context.router.push('/proposals');
        }
    }

    handleTitleChange(event) {
        this.setState({title: event});
    }

    handleResumeChange(event) {
        this.setState({description: event});
    }

    topNavBarLeftLinkClick() {
        this.context.router.push('/proposals-project-features');
    }

    topNavBarRightLinkClick() {
        ProposalActionCreators.cleanCreatingProposal();
        this.context.router.push('/proposals');
    }

    handleStepsBarClick() {
        const proposal = CreatingProposalStore.proposal;
        proposal.type = 'work';
        ProposalActionCreators.createProposal(proposal)
            .then(() => {
                ProposalActionCreators.cleanCreatingProposal();
                this.context.router.push('/proposals');
            }, () => {
                // TODO: Handle error
            });
    }

    render() {
        const {strings, title, description, industrySector, profession, availability, participantLimit, proposalFilters, industrySectorChoices} = this.props;

        return (
            <div className="views">
                <div className="view view-main proposals-project-preview-view">
                    <TopNavBar
                        position={'absolute'}
                        background={'transparent'}
                        leftIcon={'arrow-left'}
                        rightIcon={'icon-project'}
                        textSize={'small'}
                        onLeftLinkClickHandler={this.topNavBarLeftLinkClick}
                        onRightLinkClickHandler={this.topNavBarRightLinkClick}/>
                    <div className="proposals-project-preview-wrapper">
                        <div className={'image-wrapper'}>
                            <img src={'https://via.placeholder.com/480x240'}/>
                            <h2 className={'bottom-left'}>{title}</h2>
                        </div>
                        <div className={'content-wrapper'}>
                            <p className={'category'}>{strings.project}</p>
                            <p>{description}</p>

                            <div className={'information-wrapper'}>
                                <div className={'rounded-icon-wrapper'}>
                                    <ProposalIcon size={'medium-small'} icon={'skills'} background={'white'}/>
                                </div>
                                <div className={'text-wrapper'}>
                                    <div className={'title small'}>{strings.sectors}</div>
                                    {industrySector.map((item, index) =>
                                        <div className={'small'} key={index}>
                                            {industrySectorChoices.find(x => x.id === item).text}
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className={'information-wrapper'}>
                                <div className={'rounded-icon-wrapper'}>
                                    <ProposalIcon size={'medium-small'} icon={'sectors'} background={'white'}/>
                                </div>
                                <div className={'text-wrapper'}>
                                    <div className={'title small'}>{strings.profession}</div>
                                    {profession.map((item, index) =>
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
                                    <ProposalIcon size={'medium-small'} icon={icon} background={'white'}/>
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
                    color={'blue'}
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
        project         : 'Project',
        sectors         : 'Sectors',
        profession      : 'Skills',
        availability    : 'Availability',
        numberOfMembers : 'Number of members',
        publishProposal : 'Publish proposal',
        people          : 'people',
    }
};