import PropTypes from 'prop-types';
import React, { Component } from 'react';
import translate from '../i18n/Translate';
import TopNavBar from '../components/TopNavBar/TopNavBar.js';
import '../../scss/pages/proposals-project-preview.scss';
import * as ProposalActionCreators from "../actions/ProposalActionCreators";
import RoundedIcon from "../components/ui/RoundedIcon/RoundedIcon";
import CreatingProposalStore from "../stores/CreatingProposalStore";
import connectToStores from "../utils/connectToStores";
import ProfileStore from "../stores/ProfileStore";
import TagSuggestionsStore from "../stores/TagSuggestionsStore";
import StepsBar from "../components/ui/StepsBar/StepsBar";


function getState() {
    const proposal = CreatingProposalStore.proposal;
    const title = proposal.title;
    const description = proposal.description;
    const professionalSector = proposal.professionalSector;
    const skills = proposal.skills;
    const availability = proposal.availability;
    const projectMembers = proposal.projectMembers;
    const proposalFilters = proposal.proposalFilters;

    const metadata = ProfileStore.getMetadata();
    const professionalSectorChoices = metadata && metadata.industry ? metadata.industry.choices : [];

    return {
        title,
        description,
        professionalSector,
        skills,
        availability,
        projectMembers,
        proposalFilters,
        professionalSectorChoices,
    };
}

@translate('ProposalsProjectPreviewPage')
@connectToStores([CreatingProposalStore, TagSuggestionsStore], getState)
export default class ProposalsProjectPreviewPage extends Component {

    static propTypes = {
        // Injected by @translate:
        strings    : PropTypes.object,
        canContinue: PropTypes.bool,
        // Injected by @connectToStores:
        title      : PropTypes.string,
        description: PropTypes.string,
        professionalSector: PropTypes.array,
        skills: PropTypes.array,
        availability: PropTypes.object,
        projectMembers: PropTypes.number,
        proposalFilters: PropTypes.object,
        professionalSectorChoices    : PropTypes.array,
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
    }

    componentWillMount() {
        // console.log(CreatingProposalStore.proposal);
        // if (CreatingProposalStore.proposal) {
        //     this.setState({
        //         title : CreatingProposalStore.proposal.title,
        //         description: CreatingProposalStore.proposal.description,
        //     });
        // }
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
        this.context.router.push('/proposals-project-introduction');
    }

    renderProposalFilterArray(filter) {
        let filterItem = '';
        Object.keys(filter).map(function(element, index) {
            filterItem += filter[element];
            if (filter.length !== index + 1 && (filter instanceof Array))
                filterItem += ', ';
        });
        return filterItem;
    }

    renderProposalFilterBirthday(filter) {
        return 'From ' + filter.min + ' to ' + filter.max + ' years';
    }

    renderProposalFilterLocation(filter) {
        return filter.location.address + ' within radio of ' + filter.distance + ' km';
    }

    renderProposalFilter(item, filter) {
        switch (item) {
            case 'alcohol':
                return this.renderProposalFilterArray(filter);
                break;
            case 'birthday':
                return this.renderProposalFilterBirthday(filter);
                break;
            case 'civilStatus':
                return this.renderProposalFilterArray(filter);
                break;
            case 'complexion':
                return this.renderProposalFilterArray(filter);
                break;
            case 'descriptiveGender':
                return this.renderProposalFilterArray(filter);
                break;
            case 'ethnicGroup':
                return this.renderProposalFilterArray(filter);
                break;
            case 'eyeColor':
                return this.renderProposalFilterArray(filter);
                break;
            case 'hairColor':
                return this.renderProposalFilterArray(filter);
                break;
            case 'interfaceLanguage':
                return this.renderProposalFilterArray(filter);
                break;
            case 'location':
                return this.renderProposalFilterLocation(filter);
                break;
            case 'objective':
                return this.renderProposalFilterArray(filter);
                break;
            default:
                break;
        }
        // let filterItem = '';
        // Object.keys(item).map(function(element, index) {
        //     if (!(item instanceof Array)) {
        //         filterItem += element + ': ';
        //     }
        //     filterItem += item[element];
        //     if (!(item instanceof Array))
        //         filterItem += ' ';
        //     if (item.length !== index + 1 && (item instanceof Array))
        //         filterItem += ', ';
        // });
        // return filterItem;
    }

    render() {
        const {strings, title, description, professionalSector, skills, availability, projectMembers, proposalFilters, professionalSectorChoices} = this.props;

        console.log(skills);
        console.log(proposalFilters);

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

        console.log(typeof proposalFilters['alcohol']);

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
                                    {professionalSector.map((item, index) =>
                                        <div className={'small'} key={index}>
                                            {professionalSectorChoices.find(x => x.id === item).text}
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
                                    <div className={'title small'}>{strings.skills}</div>
                                    {skills.map((item, index) =>
                                        <div className={'small'} key={index}>
                                            {item}
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
                                    <div className={'title small'}>{strings.availability}</div>
                                    {availability ? (
                                        <div className="resume small">
                                            {availability.dynamic.map((day, index) =>
                                                <div key={day.weekday}>
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
                                        icon={'briefcase'}
                                        size={'small'}
                                        color={'#2B3857'}
                                        background={'#FBFCFD'}
                                        border={'1px solid #F0F1FA'}/>
                                </div>
                                <div className={'text-wrapper'}>
                                    <div className={'title small'}>{strings.numberOfMembers}</div>
                                    <div className={'resume small'}>{projectMembers} {strings.people}</div>
                                </div>
                            </div>

                            <h3>{strings.filterText}</h3>


                            {Object.keys(proposalFilters).map((item, index) =>
                                <div key={index}>
                                    <div className={'small'}><strong>{item}</strong></div>
                                    <div className={'resume small'}>{this.renderProposalFilter(item, proposalFilters[item])}</div>
                                </div>
                            )}

                        </div>
                    </div>
                </div>
                {/*<StepsBar canContinue={true} continueText={strings.publishProposal} totalSteps={0} onClickHandler={this.saveAndContinue}/>*/}

                <StepsBar color={'blue'} canContinue={true} continueText={strings.publishProposal} totalSteps={0}/>
            </div>
        );
    }

}

ProposalsProjectPreviewPage.defaultProps = {
    strings: {
        project: 'Project',
        sectors: 'Sectors',
        habilities: 'Habilities',
        availability: 'Availability',
        numberOfMembers: 'Number of members',
        filterText: 'Filters to your proposal target',
        basics: 'Basics',
        culture: 'Culture and languages',
        drugs: 'Drugs and other services',
        familiar: 'Familiar aspects',
        publishProposal: 'Publish proposal',

        people: 'people',

        monday                  : 'Monday',
        tuesday                 : 'Tuesday',
        wednesday               : 'Wednesday',
        thursday                : 'Thursday',
        friday                  : 'Friday',
        saturday                : 'Saturday',
        sunday                  : 'Sunday',
        and                     : 'and',
        scheduleOf              : 'schedule of',
        morning                 : 'morning',
        afternoon               : 'afternoon',
        night                   : 'night',
        from                    : 'From',
        to                      : 'to',

        continue: 'Publish proposal'

    }
};