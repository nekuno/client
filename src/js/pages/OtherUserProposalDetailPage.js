import PropTypes from 'prop-types';
import React, {Component} from 'react';
import translate from '../i18n/Translate';
import connectToStores from '../utils/connectToStores';
import AuthenticatedComponent from '../components/AuthenticatedComponent';
import TopNavBar from '../components/TopNavBar/TopNavBar.js';
import '../../scss/pages/other-user-proposal-detail.scss';
import ProposalStore from "../stores/ProposalStore";
import * as UserActionCreators from "../actions/UserActionCreators";
import * as ProposalActionCreators from "../actions/ProposalActionCreators";
import RoundedIcon from "../components/ui/RoundedIcon/RoundedIcon";
import RoundedImage from "../components/ui/RoundedImage/RoundedImage";
import MatchingBars from "../components/ui/MatchingBars/MatchingBars";
import UserStore from "../stores/UserStore";
import ProfileStore from "../stores/ProfileStore";

/**
 * Requests data from server for current props.
 */
function requestData(props) {
    UserActionCreators.requestUser(props.params.slug);
}

function getState(props) {
    const userSlug = props.params.slug;
    const proposalId = props.params.proposalId;

    const proposal = ProposalStore.get(userSlug, proposalId);
    const otherUser = UserStore.getBySlug(userSlug);

    const otherUserProfile = ProfileStore.getWithMetadata(userSlug);

    const metadata = ProfileStore.getMetadata();
    const industrySectorChoices = metadata && metadata.industry ? metadata.industry.choices : null;

    return {
        proposal,
        otherUser,
        otherUserProfile,
        industrySectorChoices,
    };
}

@AuthenticatedComponent
@translate('OtherUserProposalDetailPage')
@connectToStores([ProposalStore, UserStore, ProfileStore], getState)
export default class OtherUserProposalDetailPage extends Component {

    static propTypes = {
        params: PropTypes.shape({
            slug: PropTypes.string.isRequired,
            proposalId: PropTypes.string.isRequired
        }).isRequired,
        // Injected by @AuthenticatedComponent
        user: PropTypes.object.isRequired,
        // Injected by @translate:
        strings: PropTypes.object,
        // Injected by @connectToStores:
        proposal: PropTypes.object,
        otherUser: PropTypes.object,
        industrySectorChoices: PropTypes.array,
        otherUserProfile: PropTypes.object,
    };

    constructor(props) {
        super(props);

        this.topNavBarLeftLinkClick = this.topNavBarLeftLinkClick.bind(this);
    }

    static contextTypes = {
        router: PropTypes.object.isRequired
    };

    componentDidMount() {
        requestData(this.props);
    }

    topNavBarLeftLinkClick() {
        this.context.router.push(`/p/` + this.props.params.slug + `/proposals`);
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


    renderProposalType() {
        const {proposal, strings} = this.props;
        let proposalType = '';

        switch (proposal.type) {
            case 'work':
                proposalType = strings.project;
                break;
            case 'sports':
                proposalType = strings.leisure;
                break;
            case 'hobbies':
                proposalType = strings.leisure;
                break;
            case 'games':
                proposalType = strings.leisure;
                break;
            case 'shows':
                proposalType = strings.experience;
                break;
            case 'restaurants':
                proposalType = strings.experience;
                break;
            case 'plans':
                proposalType = strings.experience;
                break;
            default:
                break;
        }
        return proposalType;
    }

    render() {
        const {params, user, strings, proposal, otherUser, otherUserProfile, industrySectorChoices} = this.props;

        console.log(proposal);
        console.log(otherUser);
        console.log(otherUserProfile);
        console.log(industrySectorChoices);

        // TODO: Get matching and similarity
        // TODO: Get Availability
        // TODO: Get ParticipantLimit
        return (
            <div className="other-user-proposal-detail-view">
                <TopNavBar
                    position={'absolute'}
                    background={'transparent'}
                    iconLeft={'arrow-left'}
                    onLeftLinkClickHandler={this.topNavBarLeftLinkClick}/>
                {proposal.fields ?
                    <div className="other-user-proposal-detail-wrapper">

                        <div className={"proposal-floating-icon-container"}>
                            {this.renderFloatingIcon()}
                        </div>
                        <div className={'image-wrapper'}>
                            <img src={'https://via.placeholder.com/480x240'}/>
                            <h2 className={'bottom-left'}>{proposal.fields.title}</h2>
                        </div>

                        <div className={'user-data'}>
                            <RoundedImage size={'small'} url={otherUser.photo.thumbnail.small}/>
                            <div className={'user-text'}>
                                <div className={'username'}>{otherUser.username}</div>
                                {otherUserProfile[0] ?
                                    <div className={'age-city'}>{otherUserProfile[0].fields.location.value} &bull; {otherUserProfile[0].fields.birthday.value}</div>
                                    : null
                                }
                            </div>
                        </div>
                        <MatchingBars matching={0} similarity={0}/>

                        <div className={'content-wrapper'}>
                            <p className={'category'}>{this.renderProposalType()}</p>
                            <p>{proposal.fields.description}</p>

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
                                    {industrySectorChoices ?
                                        proposal.fields.industry.map((item, index) =>
                                            <div className={'small'} key={index}>
                                                {industrySectorChoices.find(x => x.id === item.value).text}
                                            </div>
                                        )
                                        : null
                                    }
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
                                    {proposal.fields.profession.map((item, index) =>
                                        <div className={'small'} key={index}>
                                            {item}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>


                    </div>
                    : null
                }
            </div>
        );
    }
}

OtherUserProposalDetailPage.defaultProps = {
    strings: {
        project    : 'Project',
        leisure    : 'Leisure',
        experience : 'Experience',

        sectors: 'Sectors',
        skills: 'Skills',
    }
};