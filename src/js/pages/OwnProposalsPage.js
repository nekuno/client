import PropTypes from 'prop-types';
import React, { Component } from 'react';
import translate from '../i18n/Translate';
import connectToStores from '../utils/connectToStores';
import AuthenticatedComponent from '../components/AuthenticatedComponent';
import BottomNavBar from '../components/BottomNavBar/BottomNavBar.js';
import TopNavBar from '../components/TopNavBar/TopNavBar.js';
import OwnProposalCard from '../components/Proposal/OwnProposalCard/OwnProposalCard.js';
import WorkersStore from '../stores/WorkersStore';
import '../../scss/pages/own-proposals.scss';

import CarouselContinuous from "../components/ui/CarouselContinuous/CarouselContinuous";
import ProposalStore from "../stores/ProposalStore";
import * as QuestionActionCreators from "../actions/QuestionActionCreators";
import * as ProposalActionCreators from "../actions/ProposalActionCreators";
import RoundedIcon from "../components/ui/RoundedIcon/RoundedIcon";
import SelectInline from "../components/ui/SelectInline/SelectInline";
import ProposalRecommendationsStore from "../stores/ProposalRecommendationsStore";

/**
 * Requests data from server (or store) for current props.
 */
function requestData(props) {
    ProposalStore.setInitial();
    ProposalActionCreators.requestOwnProposals();
}


function getState(props) {

    const networks = WorkersStore.getAll();
    const error = WorkersStore.getConnectError();
    const isLoading = WorkersStore.isLoading();
    const ownProposals = ProposalStore.getAllOwn();

    return {
        networks,
        error,
        isLoading,
        ownProposals
    };
}

@AuthenticatedComponent
@translate('OwnProposalsPage')
@connectToStores([WorkersStore, ProposalStore, ProposalRecommendationsStore], getState)
export default class OwnProposalsPage extends Component {

    static propTypes = {
        // Injected by @AuthenticatedComponent
        user        : PropTypes.object.isRequired,
        // Injected by @translate:
        strings     : PropTypes.object,
        // Injected by @connectToStores:
        networks    : PropTypes.array.isRequired,
        error       : PropTypes.bool,
        isLoading   : PropTypes.bool,
        ownProposals: PropTypes.array,
    };

    static contextTypes = {
        router: PropTypes.object.isRequired
    };

    constructor(props) {
        super(props);

        this.clickProposal = this.clickProposal.bind(this);
    }

    componentDidMount() {
        window.setTimeout(() => requestData(this.props), 0);
    }

    clickProposal(proposalId) {
        this.context.router.push('/proposal/' + proposalId);
    }

    getCards(proposals) {
        return proposals.map((proposal, index) => {
                return <OwnProposalCard key={index} {...proposal} onClickHandler={() => this.clickProposal(proposal.id)}/>
            }
        );
    }

    renderProposalIcon(proposal) {
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
        const {user, ownProposals, networks, notifications, strings} = this.props;
        let imgSrc = user && user.photo ? user.photo.thumbnail.medium : 'img/no-img/medium.jpg';

        const carouselMargin = -15;

        const numberOfProposalsFeatured = 10;

        console.log(ownProposals);

        // TODO: Number of matches
        return (
            <div className="own-proposals-published-view">
                <TopNavBar textCenter={strings.myPlans} imageLeft={imgSrc} boxShadow={true} />
                <div className="own-proposals-wrapper">
                    <div className="pre-card-title">{strings.popularProposals}</div>
                    {/*<div className="view-all">{strings.viewAll}</div>*/}
                    {ownProposals ?
                        <div className="proposals">
                            <CarouselContinuous items={this.getCards(ownProposals.slice(0, numberOfProposalsFeatured))} marginRight={carouselMargin}/>
                        </div>
                        : null }
                    {ownProposals.length > numberOfProposalsFeatured ?
                        <div>
                            <div className="pre-card-title">{strings.otherPublishedProposals}</div>
                            {ownProposals.slice(numberOfProposalsFeatured, ownProposals.length).map((proposal, index) =>
                                <div key={index} className={"other-published-proposals"} onClick={() => this.clickProposal(proposal.id)}>
                                    <div className={"proposal"}>
                                        <div className={"icon"}>
                                            {this.renderProposalIcon(proposal)}
                                        </div>
                                        <div className={"proposal-text"}>{proposal.fields.title}</div>
                                        <div className={"matches"}>
                                            <div className={"number"}>{proposal.countMatches}</div>
                                            <div className={"match"}>{strings.matches}</div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                        : null

                    }
                </div>
                <BottomNavBar current={'plans'} notifications={notifications}/>
            </div>
        );
    }

}

OwnProposalsPage.defaultProps = {
    strings: {
        myPlans                : 'My Plans',
        popularProposals       : 'Most popular proposals',
        otherPublished         : 'Other published proposals',
        matches                : 'Matches',
        otherPublishedProposals: 'Other published proposals',
        published              : "Published",
        others                 : "Others",
    }
};