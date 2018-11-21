import PropTypes from 'prop-types';
import React, { Component } from 'react';
import translate from '../../../i18n/Translate';
import TopNavBar from '../../../components/TopNavBar/TopNavBar.js';
import '../../../../scss/pages/proposals/project/preview.scss';
import RoundedIcon from "../../../components/ui/RoundedIcon/RoundedIcon";
import CreatingProposalStore from "../../../stores/CreatingProposalStore";
import connectToStores from "../../../utils/connectToStores";
import ProfileStore from "../../../stores/ProfileStore";
import StepsBar from "../../../components/ui/StepsBar/StepsBar";
import FilterStore from "../../../stores/FilterStore";
import ProposalFilterPreview from "../../../components/ui/ProposalFilterPreview/ProposalFilterPreview";
import ProposalStore from "../../../stores/ProposalStore";
import * as ProposalActionCreators from '../../../actions/ProposalActionCreators';

function getState() {
    const proposal = CreatingProposalStore.proposal;
    const title = proposal.fields.title;
    const description = proposal.fields.description;
    const industrySector = proposal.industry;
    const profession = proposal.profession;
    const availability = proposal.availability;
    const participantLimit = proposal.participantLimit;
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

    componentWillMount() {

    }

    handleTitleChange(event) {
        this.setState({title: event});
    }

    handleResumeChange(event) {
        this.setState({resume: event});
    }

    topNavBarRightLinkClick() {
        this.context.router.push('/proposals');
    }

    topNavBarLeftLinkClick() {
        this.context.router.push('/proposals-project-features');
    }

    handleStepsBarClick() {
        const proposal = CreatingProposalStore.proposal;
        proposal.type = 'work';
        ProposalActionCreators.createProposal(proposal)
            .then(() => {
                this.context.router.push('/proposals');
            }, () => {
                // TODO: Handle error
            });
    }

    render() {
        const {strings, title, description, industrySector, profession, availability, participantLimit, proposalFilters, industrySectorChoices, filters} = this.props;

        const dailyWeekdayOptions = {
            monday   : strings.monday,
            tuesday  : strings.tuesday,
            wednesday: strings.wednesday,
            thursday : strings.thursday,
            friday   : strings.friday,
            saturday : strings.saturday,
            sunday   : strings.sunday
        };

        const stringRanges = {
            morning  : strings.morning,
            afternoon: strings.afternoon,
            night    : strings.night,
        };

        return (
            <div className="views">
                <div className="view view-main proposals-project-preview-view">
                    <TopNavBar
                        position={'absolute'}
                        background={'transparent'}
                        iconLeft={'arrow-left'}
                        firstIconRight={'edit'}
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
                                    <RoundedIcon
                                        icon={'briefcase'}
                                        size={'small'}
                                        color={'#2B3857'}
                                        background={'#FBFCFD'}
                                        border={'1px solid #F0F1FA'}/>
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
                                    <RoundedIcon
                                        icon={'briefcase'}
                                        size={'small'}
                                        color={'#2B3857'}
                                        background={'#FBFCFD'}
                                        border={'1px solid #F0F1FA'}/>
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
                                <div className={'rounded-icon-wrapper'}>
                                    <RoundedIcon
                                        icon={'calendar'}
                                        size={'small'}
                                        color={'#2B3857'}
                                        background={'#FBFCFD'}
                                        border={'1px solid #F0F1FA'}/>
                                </div>
                                <div className={'text-wrapper'}>
                                    <div className={'title small'}>{strings.availability}</div>
                                    {availability ? (
                                        <div className="resume small">
                                            {availability.dynamic.map((day, index) =>
                                                <div key={index}>
                                                    {dailyWeekdayOptions[day.weekday]}
                                                    , {strings.scheduleOf}
                                                    {day.range.map((range, rangeIndex) =>
                                                        <span key={rangeIndex}> {day.range.length === rangeIndex + 1 ? strings.and + ' ' + stringRanges[range] : stringRanges[range]}</span>
                                                    )}
                                                </div>
                                            )}

                                            {availability.static.map((day, index) =>
                                                <div key={index}>
                                                    {strings.from} {day.days.start} {strings.to} {day.days.end}
                                                    , {strings.scheduleOf}
                                                    {day.range.map((range, rangeIndex) =>
                                                        <span key={rangeIndex}> {day.range.length === rangeIndex + 1 ? strings.and + ' ' + stringRanges[range] : stringRanges[range]}</span>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    ) : (
                                        <div className="resume small">{strings.availabilityDescription}</div>
                                    )}
                                </div>
                            </div>

                            <div className={'information-wrapper'}>
                                <div className={'rounded-icon-wrapper'}>
                                    <RoundedIcon
                                        icon={'users'}
                                        size={'small'}
                                        color={'#2B3857'}
                                        background={'#FBFCFD'}
                                        border={'1px solid #F0F1FA'}/>
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
        monday          : 'Monday',
        tuesday         : 'Tuesday',
        wednesday       : 'Wednesday',
        thursday        : 'Thursday',
        friday          : 'Friday',
        saturday        : 'Saturday',
        sunday          : 'Sunday',
        and             : 'and',
        scheduleOf      : 'schedule of',
        morning         : 'morning',
        afternoon       : 'afternoon',
        night           : 'night',
        from            : 'From',
        to              : 'to',
    }
};