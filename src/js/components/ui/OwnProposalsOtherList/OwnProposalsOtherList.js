import PropTypes from 'prop-types';
import React, { Component } from 'react';
import styles from './OwnProposalsOtherList.scss';
import Scroll from "../../Scroll/Scroll";
import CardContentList from "../../interests/CardContentList";
import connectToStores from "../../../utils/connectToStores";
import ProposalStore from "../../../stores/ProposalStore";
import ProposalSummary from "../../Proposal/ProposalSummary/ProposalSummary";
import * as ProposalActionCreators from "../../../actions/ProposalActionCreators";
import translate from "../../../i18n/Translate";

function getState(props) {
    const proposalsLiked = ProposalStore.getOwnProposalsLiked();
    const isLoading = ProposalStore.isRequesting();

    return {
        proposalsLiked,
        isLoading
    }
}

@connectToStores([ProposalStore], getState)
@translate('OwnProposalsOtherList')
export default class OwnProposalsOtherList extends Component {

    static propTypes = {
        proposalsLiked: PropTypes.array,
        // Injected by @translate:
        strings       : PropTypes.object,
        // Injected by @connectToStores:
        isLoading     : PropTypes.bool,
    };

    static contextTypes = {
        router: PropTypes.object.isRequired
    };

    constructor(props) {
        super(props);

        this.getProposalSummaries = this.getProposalSummaries.bind(this);
        this.onBottomScroll = this.onBottomScroll.bind(this);
        this.requestMore = this.requestMore.bind(this);
        this.addFirstText = this.addFirstText.bind(this);
        this.addSeparation = this.addSeparation.bind(this);
    }

    onBottomScroll() {
        if (!this.props.isLoading) {
            this.requestMore();
        }
    }

    requestMore() {
        const url = ProposalStore.getOwnProposalsLikedPaginationUrl();
        ProposalActionCreators.requestOwnProposalsLiked(url);
    }

    clickProposal(proposal) {
        const proposalId = proposal.id;
        this.context.router.push('/proposal/' + proposalId);
    }

    getProposalSummaries() {
        const {proposalsLiked} = this.props;

        let summaries = proposalsLiked.map((proposalLiked) => {
            const proposal = proposalLiked['proposal'];
            const hasMatch = proposalLiked['has_match'];
            const owner = proposalLiked['owner'];
            return <div key={proposal.id} onClick={this.clickProposal.bind(this, proposal)}><ProposalSummary proposal={proposal} hasMatch={hasMatch} owner={owner} onClickHandler={this.clickProposal}/></div>
        });

        summaries = this.addFirstText(summaries);
        summaries = this.addSeparation(summaries);

        return summaries;
    }

    addFirstText(summaries) {
        const {strings} = this.props;
        const first = <div key='first' className={styles.first}> {strings.first} </div>;
        summaries.splice(0, 0, first);

        return summaries;
    }

    addSeparation(summaries) {
        const {strings, proposalsLiked} = this.props;
        const indexOfNotMatch = proposalsLiked.findIndex((proposal) => {
            return proposal.has_match === false
        });
        const separation = <div key='separation' className={styles.separation}> {strings.separation} </div>;
        summaries.splice(indexOfNotMatch + 1, 0, separation);

        return summaries;
    }

    render() {
        const {isLoading} = this.props;
        const summaries = this.getProposalSummaries();
        const containerId = "own-proposals-other-list";

        return (
            <div className={styles.ownproposalsotherlist} id={containerId}>
                <Scroll
                    items={summaries}
                    firstItems={this.props.firstItems}
                    columns={2}
                    onLoad={this.props.onBottomScroll}
                    containerId={containerId}
                    loading={isLoading}
                    flex={false}
                />
            </div>
        );
    }
}

CardContentList.defaultProps = {
    strings          : {
        loading   : 'Loading interests',
        empty     : 'No interests',
        first     : 'Proposals with match',
        separation: 'Other proposals'
    },
    'firstItems'     : [],
    'onBottomScroll' : () => {
    },
    'isLoading'      : false,
    'loadingFirst'   : false,
    scrollContainerId: 'view'
};