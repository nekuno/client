import PropTypes from 'prop-types';
import React, { Component } from 'react';
import styles from './ProposalRecommendationList.scss';
import ReactSwipe from 'react-swipe';
import ProposalCard from "../../Proposal/ProposalCard/ProposalCard";
import * as ProposalActionCreators from '../../../actions/ProposalActionCreators';
import CandidateCard from "../../Proposal/CandidateCard/CandidateCard";

export default class ProposalRecommendationList extends Component {

    static propTypes = {
        recommendations: PropTypes.array.isRequired
    };

    constructor(props) {
        super(props);

        this.state = {swiping: 0};

        this.likeCandidate = this.likeCandidate.bind(this);
        this.skipCandidate = this.skipCandidate.bind(this);
        this.likeProposal = this.likeProposal.bind(this);
        this.skipProposal = this.skipProposal.bind(this);
        this.swiping = this.swiping.bind(this);
        this.callback = this.callback.bind(this);
        this.transitionEnd = this.transitionEnd.bind(this);
    }

    likeProposal() {
        const shownRecommendation = this.props.recommendations[0];
        const proposalId = shownRecommendation.proposal.id;
        ProposalActionCreators.interestProposal(proposalId);
    }

    likeCandidate() {
        const shownRecommendation = this.props.recommendations[0];
        const candidateId = shownRecommendation.id;
        const proposalId = shownRecommendation.proposal.id;
        const data = {candidateId, proposalId};
        ProposalActionCreators.acceptCandidate(data);
    }

    skipProposal() {
        const shownRecommendation = this.props.recommendations[0];
        const proposalId = shownRecommendation.proposal.id;
        ProposalActionCreators.skipProposal(proposalId);
    }

    skipCandidate() {
        const shownRecommendation = this.props.recommendations[0];
        const candidateId = shownRecommendation.id;
        const proposalId = shownRecommendation.proposal.id;
        const data = {candidateId, proposalId};
        ProposalActionCreators.skipCandidate(data);
    }

    renderCard(recommendation) {
        return recommendation.owner ?
            this.renderProposalCard(recommendation)
            :
            this.renderCandidateCard(recommendation)
    }

    renderProposalCard(recommendation) {
        return <div key={recommendation.proposal.id}>
            <ProposalCard proposal={recommendation.proposal} user={recommendation.owner}/>
        </div>
    }

    renderCandidateCard(recommendation) {
        return <div key={recommendation.id}>
            <CandidateCard proposal={recommendation.proposal} user={recommendation}/> <br/>
        </div>;
    }

    renderRecommendations(recommendations) {
        return ([
            <div className={styles.prev} key={'prev'}>1</div>,
            this.renderCard(recommendations[0]),
            <div className={styles.next} key={'next'}>2</div>
        ]);
    }

    callback() {
        const isProposal = this.props.recommendations[0].hasOwnProperty('owner');
        const isLiking = this.state.swiping < -0;
        const isSkipping = this.state.swiping > 0;

        if (isLiking) {
            if (isProposal) {
                this.likeProposal();
            } else {
                this.likeCandidate();
            }
        }
        if (isSkipping) {
            if (isProposal) {
                this.skipProposal();
            } else {
                this.skipCandidate();
            }
        }

        if (isLiking || isSkipping) {
            // this.state.swiper.slide(1, 0);
            this.setState({swiping: 0});
            // this.state.swiper.setup();
            this.forceUpdate();
        }

    }

    transitionEnd() {
        this.swiper.opacity = 1;
        this.setState({swiping: 0});
    }

    swiping(percentage) {
        this.swiper.opacity = Math.max(1 - (Math.abs(percentage)), 0);
        this.setState({swiping: percentage})
    }

    render() {
        const {recommendations} = this.props;
        const opacity = Math.max(1 - (Math.abs(this.state.swiping)), 0);

        const firstRecommendation = recommendations[0];

        return (
            <div className={styles.proposalRecommendationList}>
                <div style={{opacity: opacity}}>
                    {firstRecommendation ?
                        <ReactSwipe
                            ref={el => (this.swiper = el)}
                            swipeOptions={{
                                continuous   : true,
                                speed        : 100,
                                startSlide   : 1,
                                swiping      : this.swiping,
                                callback     : this.callback,
                                transitionEnd: this.transitionEnd,
                            }}
                            childCount={recommendations.length}>
                            {this.renderRecommendations(recommendations)}
                        </ReactSwipe>
                        :
                        null
                    }
                </div>
            </div>
        );
    }
}