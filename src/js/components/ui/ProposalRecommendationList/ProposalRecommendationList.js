import PropTypes from 'prop-types';
import React, { Component } from 'react';
import styles from './ProposalRecommendationList.scss';
import ProposalCard from "../../Proposal/ProposalCard/ProposalCard";
import * as ProposalActionCreators from '../../../actions/ProposalActionCreators';

export default class ProposalRecommendationList extends Component {

    static propTypes = {
        recommendations: PropTypes.array.isRequired
    };

    constructor(props) {
        super(props);

        this.likeCandidate = this.likeCandidate.bind(this);
        this.skipCandidate = this.skipCandidate.bind(this);
        this.likeProposal = this.likeProposal.bind(this);
        this.skipProposal = this.skipProposal.bind(this);
    }

    likeProposal() {
        const shownRecommendation = this.props.recommendations[0];
        const proposalId = shownRecommendation.proposal.id;
        ProposalActionCreators.interestProposal(proposalId);
    }

    likeCandidate() {
        const shownRecommendation = this.props.recommendations[0];
        const candidateId = shownRecommendation.qnoow_id;
        ProposalActionCreators.acceptCandidate(candidateId);
    }

    skipProposal() {
        const shownRecommendation = this.props.recommendations[0];
        const proposalId = shownRecommendation.proposal.id;
        ProposalActionCreators.skipProposal(proposalId);
    }

    skipCandidate() {
        const shownRecommendation = this.props.recommendations[0];
        const candidateId = shownRecommendation.qnoow_id;
        ProposalActionCreators.skipCandidate(candidateId);
    }

    renderCard(recommendation) {
        return recommendation.proposal ?
            this.renderProposalCard(recommendation)
            :
            this.renderCandidateCard(recommendation)
    }

    renderProposalCard(recommendation) {
        return <div>
            <ProposalCard proposal={recommendation.proposal} user={recommendation.owner}/>
            <input type='button' value='skip' onClick={this.skipProposal}/>
            <input type='button' value='like' onClick={this.likeProposal}/>
        </div>
    }

    renderCandidateCard(recommendation) {
        return <div>
            UserCardHere <br/>
            <input type='button' value='skip' onClick={this.skipCandidate}/>
            <input type='button' value='like' onClick={this.likeCandidate}/>
        </div>;
    }

    renderShownRecommendation(recommendation) {
        if (null === recommendation) {
            return null;
        }

        return <div className={styles.shownRecommendation} key='shown'>
            {this.renderCard()}
        </div>
    }

    renderNextRecommendation(recommendation) {
        if (null === recommendation) {
            return null;
        }

        return <div className={styles.nextRecommendation} key='next'>
            {this.renderCard()}
        </div>
    }

    render() {
        const {recommendations} = this.props;
        const shownRecommendation = recommendations.length > 0 ? recommendations[0] : null;
        const nextRecommendation = recommendations.length > 1 ? recommendations[1] : null;

        return (
            <div className={styles.proposalRecommendationList}>
                <div className="proposals-wrapper">
                    {this.renderShownRecommendation(shownRecommendation)}
                    {this.renderNextRecommendation(nextRecommendation)}
                </div>
            </div>
        );
    }
}