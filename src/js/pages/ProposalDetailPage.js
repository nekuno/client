import PropTypes from 'prop-types';
import React, { Component } from 'react';
import translate from '../i18n/Translate';
import connectToStores from '../utils/connectToStores';
import AuthenticatedComponent from '../components/AuthenticatedComponent';
import TopNavBar from '../components/TopNavBar/TopNavBar.js';
import '../../scss/pages/proposal-detail.scss';
import ProposalStore from "../stores/ProposalStore";
import * as ProposalActionCreators from "../actions/ProposalActionCreators";
import RoundedIcon from "../components/ui/RoundedIcon/RoundedIcon";
import ProposalFilterPreview from "../components/ui/ProposalFilterPreview/ProposalFilterPreview";
import ProfileStore from "../stores/ProfileStore";
import TagSuggestionsStore from "../stores/TagSuggestionsStore";
import RoundedImage from "../components/ui/RoundedImage/RoundedImage";
import ChatUserStatusStore from "../stores/ChatUserStatusStore";

/**
 * Requests data from server for current props.
 */
function requestData(props) {
    ProposalActionCreators.requestOwnProposals();
}

function getState(props) {
    const proposalId = props.params.proposalId;
    const proposal = ProposalStore.getOwnProposal(proposalId);

    const metadata = ProfileStore.getMetadata();
    const industryChoices = metadata && metadata.industry ? metadata.industry.choices : [];

    const onlineUserIds = ChatUserStatusStore.getOnlineUserIds() || [];


    return {
        proposal,
        industryChoices,
        onlineUserIds,
    };
}

@AuthenticatedComponent
@translate('ProposalDetailPage')
@connectToStores([ProposalStore, ProfileStore, TagSuggestionsStore, ChatUserStatusStore], getState)
export default class ProposalDetailPage extends Component {

    static propTypes = {
        params           : PropTypes.shape({
            proposalId: PropTypes.string.isRequired
        }).isRequired,
        // Injected by @AuthenticatedComponent
        user        : PropTypes.object.isRequired,
        // Injected by @translate:
        strings     : PropTypes.object,
        // Injected by @connectToStores:
        proposal    : PropTypes.object,
        industryChoices : PropTypes.array,
        onlineUserIds : PropTypes.array,
    };

    constructor(props) {
        super(props);

        this.removeProposalClick = this.removeProposalClick.bind(this);
        this.viewAllMatchesClick = this.viewAllMatchesClick.bind(this);
    }

    static contextTypes = {
        router: PropTypes.object.isRequired
    };

    componentDidMount() {
        requestData(this.props);
    }

    removeProposalClick() {
        ProposalActionCreators.deleteProposal(this.props.params.proposalId);
    }

    handleContinueClick() {
        // TODO: Go edit proposal
    }

    viewAllMatchesClick() {
        this.context.router.push(`/proposal/` + this.props.params.proposalId + `/matches`);
    }

    renderFloatingIcon() {
        const {proposal} = this.props;
        let icon = '';

        switch (proposal.type) {
            case 'work':
                icon = 'icon-project';
                break;
            case 'sports':
                icon = 'icon-hobbie';
                break;
            case 'hobbies':
                icon = 'icon-hobbie';
                break;
            case 'games':
                icon = 'icon-hobbie';
                break;
            case 'shows':
                icon = 'icon-experience';
                break;
            case 'restaurants':
                icon = 'icon-experience';
                break;
            case 'plans':
                icon = 'icon-experience';
                break;
            default:
                break;
        }

        return (
            <span className={icon}>
                <span className="path1"></span>
                <span className="path2"></span>
                <span className="path3"></span>
                <span className="path4"></span>
                <span className="path5"></span>
                <span className="path6"></span>
                <span className="path7"></span>
            </span>
        );
    }

    render() {
        const {params, user, strings, proposal, industryChoices, onlineUserIds} = this.props;
        return (
            proposal ?
                <div className="proposal-detail-view">
                    <TopNavBar
                        position={'absolute'}
                        background={'transparent'}
                        iconLeft={'arrow-left'}
                        textSize={'small'}
                        onLeftLinkClickHandler={this.topNavBarLeftLinkClick}
                        onRightLinkClickHandler={this.topNavBarRightLinkClick}/>
                    <div className="proposals-project-preview-wrapper">
                        <div className={"proposal-floating-icon-container"}>
                            {this.renderFloatingIcon()}
                        </div>
                        <div className={'image-wrapper'}>
                            <img src={'https://via.placeholder.com/480x240'}/>
                            <h2 className={'bottom-left'}>{proposal.fields.title}</h2>
                        </div>
                        <div className={'content-wrapper'}>

                            <div className={'proposal-users-match'}>
                                <div className={'proposal-users-match-header'}>
                                    <div className={'matches-number'}>{strings.numberOfMatches.replace("%numberOfMatches%", proposal.countMatches)}</div>
                                    <div className={'view-all'} onClick={this.viewAllMatchesClick}>{strings.viewAll}</div>
                                </div>
                                <div className={'proposal-users-match-body'}>
                                    <div className={'proposal-users-image'}>
                                        <RoundedImage url={'https://dummyimage.com/50x50/000/fff'} size={'x-small'}/>
                                        <div className={"status online"}></div>
                                    </div>
                                    <div className={'proposal-users-image'}>
                                        <RoundedImage url={'https://dummyimage.com/50x50/000/fff'} size={'x-small'}/>
                                        <div className={"status offline"}></div>
                                    </div>
                                    <div className={'proposal-users-image'}>
                                        <RoundedImage url={'https://dummyimage.com/50x50/000/fff'} size={'x-small'}/>
                                        <div className={"status offline"}></div>
                                    </div>
                                    <div className={'proposal-users-image'}>
                                        <RoundedImage url={'https://dummyimage.com/50x50/000/fff'} size={'x-small'}/>
                                        <div className={"status offline"}></div>
                                    </div>
                                    <div className={'proposal-users-image'}>
                                        <RoundedImage url={'https://dummyimage.com/50x50/000/fff'} size={'x-small'}/>
                                        <div className={"status online"}></div>
                                    </div>
                                    <div className={'proposal-users-image'}>
                                        <RoundedImage url={'https://dummyimage.com/50x50/000/fff'} size={'x-small'}/>
                                        <div className={"status offline"}></div>
                                    </div>
                                </div>
                            </div>

                            <p className={'category'}>{strings.project}</p>
                            <p>{proposal.fields.description}</p>

                            {proposal.fields.industry && industryChoices.length > 0 ?
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
                                        {proposal.fields.industry.map((item, index) =>
                                            <div className={'small'} key={index}>
                                                {/*{industryChoices.find(x => x.id === item.value).text}*/}
                                            </div>
                                        )}
                                    </div>
                                </div>
                                : null
                            }
                            {proposal.fields.profession && proposal.fields.profession.length > 0 ?
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
                                        {proposal.fields.profession.map((item, index) =>
                                            <div className={'small'} key={index}>
                                                {item}
                                            </div>
                                        )}
                                    </div>
                                </div>
                                : null
                            }


                            {/*<div className={'information-wrapper'}>*/}
                                {/*<div className={'rounded-icon-wrapper'}>*/}
                                    {/*<RoundedIcon*/}
                                        {/*icon={'calendar'}*/}
                                        {/*size={'small'}*/}
                                        {/*color={'#2B3857'}*/}
                                        {/*background={'#FBFCFD'}*/}
                                        {/*border={'1px solid #F0F1FA'}/>*/}
                                {/*</div>*/}
                                {/*<div className={'text-wrapper'}>*/}
                                    {/*<div className={'title small'}>{strings.availability}</div>*/}
                                    {/*{availability ? (*/}
                                        {/*<div className="resume small">*/}
                                            {/*{availability.dynamic.map((day, index) =>*/}
                                                {/*<div key={index}>*/}
                                                    {/*{dailyWeekdayOptions[day.weekday]}*/}
                                                    {/*,*/}
                                                    {/*{day.range.map((range, rangeIndex) =>*/}
                                                        {/*<span key={rangeIndex}> {day.range.length === rangeIndex + 1 ? strings.and + ' ' + stringRanges[range] : stringRanges[range]}</span>*/}
                                                    {/*)}*/}
                                                {/*</div>*/}
                                            {/*)}*/}

                                            {/*{availability.static.map((day, index) =>*/}
                                                {/*<div key={index}>*/}
                                                    {/*{strings.from} {day.days.start} {strings.to} {day.days.end}*/}
                                                    {/*,*/}
                                                    {/*{day.range.map((range, rangeIndex) =>*/}
                                                        {/*<span key={rangeIndex}> {day.range.length === rangeIndex + 1 ? strings.and + ' ' + stringRanges[range] : stringRanges[range]}</span>*/}
                                                    {/*)}*/}
                                                {/*</div>*/}
                                            {/*)}*/}
                                        {/*</div>*/}
                                    {/*) : (*/}
                                        {/*<div className="resume small">{strings.availabilityDescription}</div>*/}
                                    {/*)}*/}
                                {/*</div>*/}
                            {/*</div>*/}
                            {proposal.fields.participantLimit ?
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
                                    <div className={'resume small'}>{proposal.fields.participantLimit} {strings.people}</div>
                                </div>
                            </div>
                                : null
                            }
                            {proposal.filters ?
                                <ProposalFilterPreview proposalFilters={proposal.filters.userFilters}/>
                                : null
                            }
                        </div>

                        <div className={'remove-proposal-container'}>
                            <div className={'remove-proposal-title'} onClick={this.removeProposalClick}>{strings.deleteProposal}</div>
                            <div className={'remove-proposal-description'}>{strings.deleteProposalDescription}</div>
                        </div>
                    </div>

                    <div className="skip-nav-bar" onClick={this.handleContinueClick}>
                        <div className="text">{strings.editProposal}</div>
                    </div>
                </div>
                : null
        );
    }

}

ProposalDetailPage.defaultProps = {
    strings: {
        myPlans         : 'My Plans',
        popularProposals: 'Most popular proposals',
        otherPublished  : 'Other published proposals',
        matches         : 'Matches',

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
        morning         : 'morning',
        afternoon       : 'afternoon',
        night           : 'night',
        from            : 'From',
        to              : 'to',
        editProposal    : 'Edit proposal',
        numberOfMatches : 'Good! %numberOfMatches% matches',
        viewAll         : 'View all',
        deleteProposal  : 'Delete proposal',
        deleteProposalDescription : 'If you delete the proposal the data will be completely deleted and will no longer be visible to users who have matched this.',
    }
};